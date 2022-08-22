import { Abi } from 'starknet'
import { computed, ComputedRef } from 'vue'
import erc20 from '../constants/abis/erc20.json'
import l0k_factory_abi from '../constants/abis/l0k_factory_abi.json'
import { useContract } from '../starknet-vue/hooks/contract'
import { FACTORY_ADDRESSES } from '../constants/address'
import { useStarknet } from '../starknet-vue/providers/starknet'

export function useTokenContract(address: ComputedRef<string | undefined>) {
  return useContract(
    computed(() => erc20 as Abi),
    address
  )
}

export function useFactoryContract() {
  const {
    state: { chainId },
  } = useStarknet()
  const address = computed(() => chainId.value && FACTORY_ADDRESSES[chainId.value])

  return useContract(
    computed(() => l0k_factory_abi as Abi),
    address
  )
}
