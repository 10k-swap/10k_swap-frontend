import { Abi, Contract } from 'starknet4'
import { computed, ComputedRef, toRaw } from 'vue'
import { useStarknet } from '../providers/starknet'

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
