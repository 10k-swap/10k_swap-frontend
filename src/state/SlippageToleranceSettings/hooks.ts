import { computed } from "vue"
import { useSlippageToleranceSettingsStore } from "."

export function useUserSwapSlippageTolerance(){
  const store = useSlippageToleranceSettingsStore()
  return computed(() => store.$state.slippageTolerances.swap)
}

export function useUserAddLiqiuditSlippageTolerance(){
  const store = useSlippageToleranceSettingsStore()
  return computed(() => store.$state.slippageTolerances.addLiqiudit)
}