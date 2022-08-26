import { StarknetChainId } from 'starknet/constants'
import { Token } from '../sdk'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in StarknetChainId]: Token[]
}

const tokens: ChainTokenList = {
  [StarknetChainId.MAINNET]: [],
  [StarknetChainId.TESTNET]: [
    new Token(StarknetChainId.TESTNET, '0x01036f19169e2bf0c049a1588d63cd82eadd18e9c4798f6bfb962b5541fa7ee5', 6, 'TKA', 'TestMainnet Token'),
    new Token(StarknetChainId.TESTNET, '0x030c6217597b12be57937c9743cc2fafb4e06d1f15487cd87b7fdd787b825b5b', 6, 'TKB', 'TestMainnet Token'),
    new Token(StarknetChainId.TESTNET, '0x043a3737fcd6638ae58fc9e497cee036333f02984e4ff4deaf512333b6220481', 18, 'TKC', 'TestMainnet Token'),
    new Token(StarknetChainId.TESTNET, '0x060079a4e9c922f8143c1b8670c053cec37db6b3894e3e2129f0a408b47dfac3', 18, 'TKD', 'TestMainnet Token'),
    new Token(StarknetChainId.TESTNET, '0x045c1d40d7893b36432736f761d39829fcd97b7d6cd3669bb15c8a87e5841835', 18, 'TKE', 'TestMainnet Token'),
    new Token(StarknetChainId.TESTNET, '0x02f478a90bad4e7b9973508aa3c954468dda7ca1338b6455210ff355c6fba978', 18, 'TKF', 'TestMainnet Token'),
  ],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [StarknetChainId.MAINNET]: [],
  [StarknetChainId.TESTNET]: [],
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in StarknetChainId]?: { [tokenAddress: string]: Token[] } } = {
  [StarknetChainId.MAINNET]: {},
}

export default tokens
