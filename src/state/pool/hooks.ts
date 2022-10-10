import { computed, onMounted, watch } from 'vue'
import { usePoolStore } from '.'
import { useStarknet } from '../../starknet-vue/providers/starknet'

export function useAllPairs() {
  const store = usePoolStore()

  const {
    state: { chainId },
  } = useStarknet()

  onMounted(() => {
    if (chainId.value) {
      store.getAllPairs(chainId.value)
    }
  })
  watch([chainId], () => {
    if (chainId.value) {
      store.getAllPairs(chainId.value)
    }
  })

  return computed(() => store.$state.pairs)
}

export function useIsLoadingAllPairs() {
  const store = usePoolStore()
  return computed(() => store.$state.loadingPools)
}

export function useUserPairs() {
  const store = usePoolStore()
  const pairs = useAllPairs()
  const userPools = computed(() => store.$state.userPools)

  const {
    state: { chainId, account },
  } = useStarknet()

  const _getUserPairs = () => {
    if (pairs.value.length && account.value && chainId.value && !userPools.value.length) {
      store.getUserPairs(chainId.value, account.value)
    }
  }

  watch([pairs, account, chainId], _getUserPairs)
  onMounted(_getUserPairs)

  return userPools
}
