import { computed, Ref } from 'vue'
import { ONE_BIPS } from '../constants'
import { Percent, Price } from '../sdk'

export default function usePoolTokenPercentageLabel(
  poolTokenPercentage: Ref<Percent | undefined>,
  price: Ref<Price | undefined>,
  noLiquidity: Ref<boolean | undefined>
) {
  return computed(() => {
    if (noLiquidity.value && price.value) {
      return '100'
    }
    return (poolTokenPercentage.value?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage.value?.toFixed(2)) ?? '0'
  })
}
