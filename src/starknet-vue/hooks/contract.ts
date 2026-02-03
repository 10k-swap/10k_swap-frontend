import { Abi, Contract } from 'starknet5'
import { computed, ComputedRef, toRaw } from 'vue'
import { useStarknet } from '../providers/starknet'
import { defaultProvider } from '../providers/starknet/const'

export function useContract(abi: ComputedRef<Abi>, address: ComputedRef<string | undefined>): ComputedRef<Contract | undefined> {
  const {
    state: { library },
  } = useStarknet()

  return computed(() => {
    if (address.value && library.value) {
      return new Contract(abi.value, address.value, toRaw(library.value))
    }
    return undefined
  })
}

export function useContractDefault(abi: ComputedRef<Abi>, address: ComputedRef<string | undefined>): ComputedRef<Contract | undefined> {
  return computed(() => {
    if (address.value && defaultProvider) {
      return new Contract(abi.value, address.value, defaultProvider)
    }
    return undefined
  })
}
