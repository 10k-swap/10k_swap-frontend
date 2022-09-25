import { Abi, AddTransactionResponse, Contract } from 'starknet'
import { JSBI, Percent, Router, SwapParameters, Trade, TradeType } from 'l0k_swap-sdk'
import { BIPS_BASE, DEFAULT_DEADLINE_FROM_NOW, INITIAL_SWAP_ALLOWED_SLIPPAGE } from '../constants'
import { getRouterContract } from '../utils'
import { computed, ComputedRef, Ref, toRaw } from 'vue'
import { useStarknet } from '../starknet-vue/providers/starknet'
import erc20 from '../constants/abis/erc20.json'
import l0k_router_abi from '../constants/abis/l0k_router_abi.json'
import { isAccountInterface } from '../starknet-vue/utils'
import { bnToUint256 } from 'starknet/dist/utils/uint256'
import { useStarknetTransactionManager } from '../starknet-vue/providers/transaction'
import useSwapSummary from './useSwapSummary'
import useSwapApproveAmount from './useSwapApproveAmount'

enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface SwapCall {
  contract: Contract
  parameters: SwapParameters
}

// interface SuccessfulCall {
//   call: SwapCall
//   gasEstimate: BN
// }

// interface FailedCall {
//   call: SwapCall
//   error: Error
// }

// type EstimatedSwapCall = SuccessfulCall | FailedCall

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param deadline the deadline for the trade
 * @param recipientAddressOrName
 */
function useSwapCallArguments(
  trade: Ref<Trade | null | undefined>, // trade to execute, required
  allowedSlippage: ComputedRef<number> | number = INITIAL_SWAP_ALLOWED_SLIPPAGE, // in bips
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
  trade: Ref<Trade | null | undefined>, // trade to execute, required
  allowedSlippage: ComputedRef<number> | number = INITIAL_SWAP_ALLOWED_SLIPPAGE, // in bips
  deadline: number = DEFAULT_DEADLINE_FROM_NOW // in seconds from now
  // recipientAddressOrName: string | null // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): ComputedRef<{ state: SwapCallbackState; callback: null | (() => Promise<string>); error: string | null }> {
  const {
    state: { account, chainId, library },
  } = useStarknet()

  const { addTransaction } = useStarknetTransactionManager()
  const swapCalls = useSwapCallArguments(trade, allowedSlippage, deadline)
  const summary = useSwapSummary(trade)
  const swapApproveAmount = useSwapApproveAmount(trade, allowedSlippage)

  return computed(() => {
    if (!trade.value || !library.value || !account.value || !chainId.value) {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }

    const libraryRaw = toRaw(library.value)
    if (!isAccountInterface(libraryRaw)) {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'execute: library not a AccountInterface' }
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        const {
          contract,
          parameters: { methodName, args },
        } = swapCalls.value[0]
        console.log('args', args)
        if (!swapApproveAmount.value) {
          throw new Error('No Approve Amount')
        }
        const approveAmount = bnToUint256(swapApproveAmount.value.raw.toString())

        return libraryRaw
          .execute(
            [
              {
                entrypoint: 'approve',
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                contractAddress: trade.value!.inputAmount.token.address,
                calldata: [contract.address, approveAmount.low, approveAmount.high],
              },
              {
                entrypoint: methodName,
                contractAddress: contract.address,
                calldata: args,
              },
            ],
            [erc20 as Abi, l0k_router_abi as Abi]
          )
          .then((response: AddTransactionResponse) => {
            addTransaction({
              status: response.code,
              transactionHash: response.transaction_hash,
              metadata: {
                message: summary.value,
              },
            })

            return response.transaction_hash
          })
          .catch((error: Error) => {
            // otherwise, the error was unexpected and we need to convey that
            console.error(`Swap failed`, error, methodName, args)
            throw new Error(`Swap failed: ${error.message}`)
          })
      },
      error: null,
    }
  })
}

export default useSwapCallback
