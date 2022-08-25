import { computed } from 'vue'
import { usePoolStore } from '.'

export function useAllPairs() {
  const store = usePoolStore()
  return computed(() => store.$state.pairs)
}

export function useIsLoadingAllPairs() {
  const store = usePoolStore()
  return computed(() => store.$state.loadingPools)
}

export function useUserPairs() {
  const store = usePoolStore()
  return computed(() => store.$state.userPools)
}
