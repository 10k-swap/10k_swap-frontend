import { Ref, computed, ComputedRef } from 'vue'
import { Percent, Trade, JSBI } from 'l0k_swap-sdk'
import { BIPS_BASE } from '../constants'

export function getSwapApproveAmount(trade: Trade, allowedSlippage: number) {
  return trade.maximumAmountIn(new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE))
}

export default function useSwapApproveAmount(trade: Ref<Trade | null | undefined>, allowedSlippage: ComputedRef<number> | number) {
  return computed(() => {
    if (!trade.value) {
      return undefined
    }

    return getSwapApproveAmount(trade.value, Math.floor(typeof allowedSlippage === 'number' ? allowedSlippage : allowedSlippage.value))
  })
}
