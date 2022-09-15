import { ChainId } from 'l0k_swap-sdk'

export const ROUTER_ADDRESSES: {
  [chainId in ChainId]: string
} = {
  [ChainId.MAINNET]: '',
  [ChainId.TESTNET]: '0x00975910cd99bc56bd289eaaa5cee6cd557f0ddafdb2ce6ebea15b158eb2c664',
}
