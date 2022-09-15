import { Abi } from 'starknet'
import { computed, ComputedRef } from 'vue'
import erc20 from '../constants/abis/erc20.json'
import { useContract } from '../starknet-vue/hooks/contract'

export function useTokenContract(address: ComputedRef<string | undefined>) {
  return useContract(
    computed(() => erc20 as Abi),
    address
  )
}
