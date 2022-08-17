import { Abi, Contract, EstimateFee } from 'starknet'
import { JSBI, Percent, Router, SwapParameters, Trade, TradeType } from '../sdk'
import { BIPS_BASE, DEFAULT_DEADLINE_FROM_NOW, INITIAL_ALLOWED_SLIPPAGE } from '../constants'
// import { useTransactionAdder } from '../state/transactions/hooks'
import { BN, getRouterContract } from '../utils'
import { computed, ComputedRef, toRaw } from 'vue'
import { useStarknet } from '../starknet-vue/providers/starknet'
import erc20 from '../constants/abis/erc20.json'
import l0k_router_abi from '../constants/abis/l0k_router_abi.json'
import { isAccountInterface } from '../starknet-vue/utils'
import { bnToUint256, isUint256 as hasUint256, Uint256 } from 'starknet/dist/utils/uint256'
import { uint256ToBN } from 'starknet/dist/utils/uint256'

const isUint256 = (value: any): value is Uint256 => hasUint256(value)

enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface SwapCall {
  contract: Contract
  parameters: SwapParameters
}

interface SuccessfulCall {
  call: SwapCall
  gasEstimate: BN
}

interface FailedCall {
  call: SwapCall
  error: Error
}

type EstimatedSwapCall = SuccessfulCall | FailedCall

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param deadline the deadline for the trade
 * @param recipientAddressOrName
 */
function useSwapCallArguments(
  trade: ComputedRef<Trade | null | undefined>, // trade to execute, required
  allowedSlippage: ComputedRef<number> | number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  deadline: number = DEFAULT_DEADLINE_FROM_NOW // in seconds from now
  // recipientAddressOrName: string | null // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): ComputedRef<SwapCall[]> {
  const {
    state: { account, chainId, library },
  } = useStarknet()

  return computed(() => {
    if (!trade.value || !library.value || !account.value || !chainId.value) return []

    const contract: Contract | null = getRouterContract(chainId.value, toRaw(library.value))
    if (!contract) {
      return []
    }

    const swapMethods = []

    swapMethods.push(
      Router.swapCallParameters(trade.value, {
        feeOnTransfer: false,
        allowedSlippage: new Percent(
          JSBI.BigInt(Math.floor(typeof allowedSlippage === 'number' ? allowedSlippage : allowedSlippage.value)),
          BIPS_BASE
        ),
        recipient: account.value,
        ttl: deadline,
      })
    )

    if (trade.value.tradeType === TradeType.EXACT_INPUT) {
      swapMethods.push(
        Router.swapCallParameters(trade.value, {
          feeOnTransfer: true,
          allowedSlippage: new Percent(
            JSBI.BigInt(Math.floor(typeof allowedSlippage === 'number' ? allowedSlippage : allowedSlippage.value)),
            BIPS_BASE
          ),
          recipient: account.value,
          ttl: deadline,
        })
      )
    }

    return swapMethods.map((parameters) => ({ parameters, contract }))
  })
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: ComputedRef<Trade | null | undefined>, // trade to execute, required
  allowedSlippage: ComputedRef<number> | number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  deadline: number = DEFAULT_DEADLINE_FROM_NOW // in seconds from now
  // recipientAddressOrName: string | null // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): ComputedRef<{ state: SwapCallbackState; callback: null | (() => Promise<string>); error: string | null }> {
  const {
    state: { account, chainId, library },
  } = useStarknet()

  const swapCalls = useSwapCallArguments(trade, allowedSlippage, deadline)

  // const addTransaction = useTransactionAdder()

  // const { address: recipientAddress } = useENS(recipientAddressOrName)
  // const recipient = recipientAddressOrName === null ? account : recipientAddress

  return computed(() => {
    if (!trade.value || !library.value || !account.value || !chainId.value) {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }

    const libraryRaw = toRaw(library.value)
    if (!isAccountInterface(libraryRaw)) {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'execute: library not a AccountInterface' }
    }
    // if (!recipient) {
    //   if (recipientAddressOrName !== null) {
    //     return { state: SwapCallbackState.INVALID, callback: null, error: 'Invalid recipient' }
    //   }
    //   return { state: SwapCallbackState.LOADING, callback: null, error: null }
    // }

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        const estimatedCalls: EstimatedSwapCall[] = await Promise.all(
          swapCalls.value.map((call) => {
            const {
              parameters: { methodName, args },
              contract,
            } = call

            return contract.estimate(methodName,...args.map((item) => (isUint256(item) ? uint256ToBN(item).toString() : item)))
              .then((gasEstimate: EstimateFee) => {
                console.log(gasEstimate)
                return {
                  call,
                  gasEstimate: gasEstimate.amount,
                }
              })
              .catch((gasError: any) => {
                console.log('gasError', gasError)
                console.info('Gas estimate failed, trying eth_call to extract error', call)

                return contract.callStatic[methodName](...args)
                  .then((result) => {
                    console.info('Unexpected successful call after failed estimate gas', call, gasError, result)
                    return { call, error: new Error('Unexpected issue with estimating the gas. Please try again.') }
                  })
                  .catch((callError) => {
                    console.info('Call threw error', call, callError)
                    let errorMessage: string
                    switch (callError.reason) {
                      case 'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT':
                      case 'UniswapV2Router: EXCESSIVE_INPUT_AMOUNT':
                        errorMessage =
                          'This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.'
                        break
                      default:
                        errorMessage = `The transaction cannot succeed due to error: ${callError.reason}. This is probably an issue with one of the tokens you are swapping.`
                    }
                    return { call, error: new Error(errorMessage) }
                  })
              })
          })
        )

        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        const successfulEstimation = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall => 'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1])
        )

        if (!successfulEstimation) {
          const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
          if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error
          throw new Error('Unexpected error. Please contact support: none of the calls threw an error')
        }

        const {
          call: {
            contract,
            parameters: { methodName, args },
          },
        } = successfulEstimation

        const approveAmount: Uint256 = bnToUint256(
          trade
            .value!.maximumAmountIn(
              new Percent(JSBI.BigInt(Math.floor(typeof allowedSlippage === 'number' ? allowedSlippage : allowedSlippage.value)), BIPS_BASE)
            )
            .raw.toString()
        )
        return libraryRaw
          .execute(
            [
              {
                entrypoint: 'approve',
                contractAddress: trade.value!.inputAmount.currency.address,
                calldata: [contract.address, approveAmount.low, approveAmount.high],
              },
              {
                entrypoint: methodName,
                contractAddress: contract.address,
                calldata: args.reduce<(string | string[])[]>((memo, item) => {
                  if (isUint256(item)) {
                    memo.push(item.low)
                    memo.push(item.high)
                  } else {
                    memo.push(item as string)
                  }
                  return memo
                }, []),
              },
            ],
            [erc20 as Abi, l0k_router_abi as Abi]
          )
          .then((response: any) => {
            const inputSymbol = trade.value!.inputAmount.currency.symbol
            const outputSymbol = trade.value!.outputAmount.currency.symbol
            const inputAmount = trade.value!.inputAmount.toSignificant(3)
            const outputAmount = trade.value!.outputAmount.toSignificant(3)

            const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`
            // const withRecipient =
            //   recipient === account
            //     ? base
            //     : `${base} to ${
            //         recipientAddressOrName && isAddress(recipientAddressOrName) ? shortenAddress(recipientAddressOrName) : recipientAddressOrName
            //       }`

            // addTransaction(response, {
            //   summary: base,
            // })

            return response.hash
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, methodName, args)
              throw new Error(`Swap failed: ${error.message}`)
            }
          })
      },
      error: null,
    }
  })
}

export default useSwapCallback
