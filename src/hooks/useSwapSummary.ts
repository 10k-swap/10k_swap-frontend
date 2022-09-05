import { computed, Ref } from 'vue'
import { Trade } from '../sdk'
import { useUserSwapSlippageTolerance } from '../state/slippageToleranceSettings/hooks'
import useSwapApproveAmount from './useSwapApproveAmount'

export default function useSwapSummary(trade: Ref<Trade | null | undefined>) {
  const allowedSlippage = useUserSwapSlippageTolerance()
  const swapApproveAmount = useSwapApproveAmount(trade, allowedSlippage)

  return computed(() => {
    if (!trade.value) {
      return undefined
    }
    const inputSymbol = trade.value.inputAmount.currency.symbol
    const outputSymbol = trade.value.outputAmount.currency.symbol
    const inputAmount = trade.value.inputAmount.toSignificant(3)
    const outputAmount = trade.value.outputAmount.toSignificant(3)
    const approveAmount = swapApproveAmount.value?.toSignificant(3)

    return `Approve ${approveAmount} ${inputSymbol} & Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`
  })
}
