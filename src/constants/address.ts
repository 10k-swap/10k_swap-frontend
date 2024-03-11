import { StarknetChainId } from 'l0k_swap-sdk'

export const ROUTER_ADDRESSES: {
  [chainId in StarknetChainId]: string
} = {
  [StarknetChainId.MAINNET]: '0x07a6f98c03379b9513ca84cca1373ff452a7462a3b61598f0af5bb27ad7f76d1',
  [StarknetChainId.TESTNET]: '0x00975910cd99bc56bd289eaaa5cee6cd557f0ddafdb2ce6ebea15b158eb2c664',
}

export const STARKNET_ID_ADDRESSES: {
  [chainId in StarknetChainId]: string
} = {
  [StarknetChainId.MAINNET]: '0x06ac597f8116f886fa1c97a23fa4e08299975ecaf6b598873ca6792b9bbfb678',
  [StarknetChainId.TESTNET]: '0x05cf267a0af6101667013fc6bd3f6c11116a14cda9b8c4b1198520d59f900b17',
}

export const DEFISPRING_DISTRIBUTOR_ADDRESSES: {
  [chainId in StarknetChainId]: string
} = {
  [StarknetChainId.MAINNET]: '0x00dc347ea9e7dc2a307e853b97e7189dfb08679a98e8d5ba549a1872febf2e5d',
  [StarknetChainId.TESTNET]: '',
}
