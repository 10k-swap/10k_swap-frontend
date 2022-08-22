import { AccountInterface, ProviderInterface, Contract, Abi } from 'starknet'
import { StarknetChainId } from '../constants/index'
import l0k_router_abi from '../constants/abis/l0k_router_abi.json'
import { ROUTER_ADDRESSES } from '../constants/address'

export function getRouterContract(chainId: StarknetChainId, library: ProviderInterface | AccountInterface) {
  return new Contract(l0k_router_abi as Abi, ROUTER_ADDRESSES[chainId], library)
}

