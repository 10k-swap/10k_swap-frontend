import { bnToUint256 } from 'starknet/dist/utils/uint256'
import { Ref, computed, ComputedRef } from 'vue'
import JSBI from 'jsbi'
import { Percent, Trade } from '../sdk'
import { BIPS_BASE } from '../constants'

export default function useSwapApproveAmount(trade: Ref<Trade | null | undefined>, allowedSlippage: ComputedRef<number> | number) {
  return computed(() => {
    if (!trade.value) {
      return undefined
    }
    return trade.value.maximumAmountIn(
      new Percent(JSBI.BigInt(Math.floor(typeof allowedSlippage === 'number' ? allowedSlippage : allowedSlippage.value)), BIPS_BASE)
    )
  })
}
