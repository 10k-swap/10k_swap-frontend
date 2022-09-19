import { ChainId } from 'l0k_swap-sdk'

export const ROUTER_ADDRESSES: {
  [chainId in ChainId]: string
} = {
  [ChainId.MAINNET]: '0x07a6f98c03379b9513ca84cca1373ff452a7462a3b61598f0af5bb27ad7f76d1',
  [ChainId.TESTNET]: '0x00975910cd99bc56bd289eaaa5cee6cd557f0ddafdb2ce6ebea15b158eb2c664',
}
