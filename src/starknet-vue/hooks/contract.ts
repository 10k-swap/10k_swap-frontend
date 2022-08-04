import { Abi, Contract } from 'starknet'
import { computed, ComputedRef, toRaw } from 'vue'
import { useStarknet } from '../providers/starknet'

export function useContract(abi: Abi, address: string): ComputedRef<Contract | undefined> {
  const { state: { library } } = useStarknet()

  return computed(() => {
    if (abi && address && library.value) {
      return new Contract(abi, address, toRaw(library.value))
    }
    return undefined
  })
}
