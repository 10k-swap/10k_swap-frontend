import { StarknetChainId } from 'l0k_swap-sdk'
// import { RpcProvider as RpcProviderV4 } from 'starknet4'
import { RpcProvider, RpcProviderOptions } from 'starknet5'
// import { RPCS, RPCS_V4 } from '../constants'
import { RPCS } from '../constants'
import _ from 'lodash'

// export function getRpcProviderV4(chainId: StarknetChainId) {
//   return new RpcProviderV4({ nodeUrl: chainId == StarknetChainId.MAINNET ? RPCS_V4.SN_MAIN : RPCS_V4.SN_GOERLI })
// }

export function getRpcProvider(chainId: StarknetChainId, options?: RpcProviderOptions) {
  const nodeUrl = _.sample(chainId == StarknetChainId.MAINNET ? RPCS.SN_MAIN : RPCS.SN_GOERLI)
  return new RpcProvider({ nodeUrl, ...options })
}
