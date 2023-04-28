import { Abi } from 'starknet'
import { computed, ComputedRef } from 'vue'
import erc20 from '../constants/abis/erc20.json'
import naming_abi from '../constants/abis/naming_abi.json'
import { STARKNET_ID_ADDRESSES } from '../constants/address'
import { useContract } from '../starknet-vue/hooks/contract'
import { useStarknet } from '../starknet-vue/providers/starknet'

export function useTokenContract(address: ComputedRef<string | undefined>) {
  return useContract(
    computed(() => erc20 as Abi),
    address
  )
}

export function useNamingContract() {
  const {
    state: { chainId },
  } = useStarknet()
  const address = computed(() => chainId.value && STARKNET_ID_ADDRESSES[chainId.value])

  return useContract(
    computed(() => naming_abi as Abi),
    address
  )
}
