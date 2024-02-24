import { StarknetChainId } from 'l0k_swap-sdk'
import { RpcProvider as RpcProviderV4 } from 'starknet4'
import { RpcProvider, RpcProviderOptions } from 'starknet5'
import { RPCS, RPCS_V4 } from '../constants'

export function getRpcProviderV4(chainId: StarknetChainId) {
  return new RpcProviderV4({ nodeUrl: chainId == StarknetChainId.MAINNET ? RPCS_V4.SN_MAIN : RPCS_V4.SN_GOERLI })
}

export function getRpcProvider(chainId: StarknetChainId, options?: RpcProviderOptions) {
  return new RpcProvider({ nodeUrl: chainId == StarknetChainId.MAINNET ? RPCS.SN_MAIN : RPCS.SN_GOERLI, ...options })
}
