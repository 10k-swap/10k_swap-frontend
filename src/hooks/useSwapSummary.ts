import { computed, Ref } from 'vue'
import { TokenAmount, Trade } from 'l0k_swap-sdk'
import { useUserSwapSlippageTolerance } from '../state/slippageToleranceSettings/hooks'
import useSwapApproveAmount from './useSwapApproveAmount'

export function getSwapSummary(trade: Trade, swapApproveAmount?: TokenAmount) {
  const inputSymbol = trade.inputAmount.token.symbol
  const outputSymbol = trade.outputAmount.token.symbol
  const inputAmount = trade.inputAmount.toSignificant(3)
  const outputAmount = trade.outputAmount.toSignificant(3)
  const approveAmount = swapApproveAmount?.toSignificant(3)

  return `Approve ${approveAmount} ${inputSymbol} & Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`
}

export default function useSwapSummary(trade: Ref<Trade | null | undefined>) {
  const allowedSlippage = useUserSwapSlippageTolerance()
  const swapApproveAmount = useSwapApproveAmount(trade, allowedSlippage)

  return computed(() => {
    if (!trade.value) {
      return undefined
    }

    return getSwapSummary(trade.value, swapApproveAmount.value)
  })
}
