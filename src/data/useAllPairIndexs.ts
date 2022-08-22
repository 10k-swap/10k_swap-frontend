import { computed } from 'vue'
import { useStarknetCall } from '../starknet-vue/hooks/call'
import { useFactoryContract } from '../hooks/Contract'

export function useAllPairIndexs() {
  const factoryContract = useFactoryContract()
  const {
    state: { data, loading },
  } = useStarknetCall(factoryContract, 'allPairsLength')
  return computed(() => {
    if (loading) {
      return null
    }
    if (data?.[0]) {
      return Array.from({ length: data[0].toNumber() }, (_, i) => i)
    }
    return undefined
  })
}
