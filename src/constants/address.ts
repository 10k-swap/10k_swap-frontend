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

export const STAKE_ADDRESSES: {
  [chainId in StarknetChainId]: string
} = {
  [StarknetChainId.MAINNET]: '',
  [StarknetChainId.TESTNET]: '0x04e59ea969ff735a7123906048e2b736cd35063a9d6aeb2881cb3ddee2fa86d9',
}
