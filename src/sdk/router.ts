import { TradeType } from './constants'
import invariant from 'tiny-invariant'
import { bnToUint256, Uint256 } from 'starknet/dist/utils/uint256'
import { Percent, Trade } from './entities'
import { BigNumberish } from 'starknet/utils/number'

/**
 * Options for producing the arguments to send call to the router.
 */
export interface TradeOptions {
  /**
   * How much the execution price is allowed to move unfavorably from the trade execution price.
   */
  allowedSlippage: Percent
  /**
   * How long the swap is valid until it expires, in seconds.
   * This will be used to produce a `deadline` parameter which is computed from when the swap call parameters
   * are generated.
   */
  ttl: number
  /**
   * The account that should receive the output of the swap.
   */
  recipient: string

  /**
   * Whether any of the tokens in the path are fee on transfer tokens, which should be handled with special methods
   */
  feeOnTransfer?: boolean
}

/**
 * The parameters to use in the call to the Uniswap V2 Router to execute a trade.
 */
export interface SwapParameters {
  /**
   * The method to call on the Uniswap V2 Router.
   */
  methodName: string
  /**
   * The arguments to pass to the method, all hex encoded.
   */
  args: (BigNumberish | string)[]
}

/**
 * Represents the Uniswap V2 Router, and has static methods for helping execute trades.
 */
export abstract class Router {
  /**
   * Cannot be constructed.
   */
  private constructor() {}
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trade to produce call parameters for
   * @param options options for the call parameters
   */
  public static swapCallParameters(trade: Trade, options: TradeOptions): SwapParameters {
    invariant(options.ttl > 0, 'TTL')

    const to: string = options.recipient
    const amountIn: Uint256 = bnToUint256(trade.maximumAmountIn(options.allowedSlippage).raw.toString())
    const amountOut: Uint256 = bnToUint256(trade.minimumAmountOut(options.allowedSlippage).raw.toString())
    const path: string[] = trade.route.path.map((token) => token.address)
    const deadline = `${(Math.floor(new Date().getTime() / 1000) + options.ttl).toString()}`
    const useFeeOnTransfer = Boolean(options.feeOnTransfer)

    let methodName: string
    let args: (BigNumberish | string)[]
    switch (trade.tradeType) {
      case TradeType.EXACT_INPUT:
        methodName = useFeeOnTransfer ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens' : 'swapExactTokensForTokens'
        // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        args = [
          amountIn.low.toString(),
          amountIn.high.toString(),
          amountOut.low.toString(),
          amountOut.high.toString(),
          path.length + '',
          ...path,
          to,
          deadline,
        ]
        break
      case TradeType.EXACT_OUTPUT:
        invariant(!useFeeOnTransfer, 'EXACT_OUT_FOT')
        methodName = 'swapTokensForExactTokens'
        // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
        args = [
          amountOut.low.toString(),
          amountOut.high.toString(),
          amountIn.low.toString(),
          amountIn.high.toString(),
          path.length + '',
          ...path,
          to,
          deadline,
        ]
        break
    }
    return {
      methodName,
      args,
    }
  }
}
