import { StarknetChainId } from 'starknet/constants'

export const ROUTER_ADDRESSES: {
  [chainId in StarknetChainId]: string
} = {
  [StarknetChainId.MAINNET]: '',
  [StarknetChainId.TESTNET]: '0x025e0fc6599df886875411e3f1e712a969650e48b634b7cbb6399ef8d1a38359',
}

export const FACTORY_ADDRESSES: {
  [chainId in StarknetChainId]: string
} = {
  [StarknetChainId.MAINNET]: '',
  [StarknetChainId.TESTNET]: '0x007f1e072e1681c316acdc3a3be69be0a8bb02e485c5a54c8113f7804d76d7db',
}
