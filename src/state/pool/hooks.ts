import { computed, onMounted, watch, ComputedRef } from 'vue'
import { Pool, usePoolStore, UserPool } from '.'
import { useStarknet } from '../../starknet-vue/providers/starknet'

export function useAllPairs(): [ComputedRef<Pool[]>, ComputedRef<boolean>] {
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

  return [computed(() => store.$state.pairs as Pool[]), computed(() => store.$state.loadingPools)]
}

export function useUserPairs(pairs: ComputedRef<Pool[]>): [ComputedRef<UserPool[]>, ComputedRef<boolean>] {
  const store = usePoolStore()
  const userPools = computed(() => store.$state.userPools as UserPool[])

  const {
    state: { chainId, account },
  } = useStarknet()

  const _getUserPairs = () => {
    if (pairs.value.length && account.value && chainId.value) {
      store.getUserPairs(chainId.value, account.value)
    }
  }

  watch([pairs, account], _getUserPairs)
  onMounted(_getUserPairs)

  return [userPools, computed(() => store.$state.loadingUserPools)]
}
