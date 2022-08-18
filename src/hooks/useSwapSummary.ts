import { computed, ComputedRef, Ref } from 'vue'
import { Trade } from '../sdk'
import useSwapApproveAmount from './useSwapApproveAmount'

export default function useSwapSummary(trade: Ref<Trade | null | undefined>, allowedSlippage: ComputedRef<number> | number) {
  const swapApproveAmount = useSwapApproveAmount(trade, allowedSlippage)

  return computed(() => {
    if (!trade.value) {
      return undefined
    }
    const inputSymbol = trade.value.inputAmount.currency.symbol
    const outputSymbol = trade.value.outputAmount.currency.symbol
    const inputAmount = trade.value.inputAmount.toSignificant(3)
    const outputAmount = trade.value.outputAmount.toSignificant(3)

    return `Approve ${swapApproveAmount.value?.toSignificant(
      3
    )} ${inputSymbol} & Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`
  })
}
