import { computed, onMounted, watch, ComputedRef } from 'vue'
import { Pool, usePoolStore, UserPool } from '.'
import { useStarknet } from '../../starknet-vue/providers/starknet'

export function useAllPairs(): ComputedRef<Pool[]> {
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

  return computed(() => store.$state.pairs as Pool[])
}

export function useIsLoadingAllPairs() {
  const store = usePoolStore()
  return computed(() => store.$state.loadingPools)
}

export function useUserPairs(): ComputedRef<UserPool[]> {
  const store = usePoolStore()
  const pairs = useAllPairs()
  const userPools = computed(() => store.$state.userPools as UserPool[])

  const {
    state: { chainId, account },
  } = useStarknet()

  const _getUserPairs = () => {
    if (pairs.value.length && account.value && chainId.value) {
      store.getUserPairs(chainId.value, account.value)
    }
  }

  watch([pairs, account, chainId], _getUserPairs)
  onMounted(_getUserPairs)

  return userPools
}

export function useIsLoadingUserPairs() {
  const store = usePoolStore()
  return computed(() => store.$state.loadingUserPools)
}
