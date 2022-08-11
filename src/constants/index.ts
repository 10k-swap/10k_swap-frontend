import { StarknetChainId } from 'starknet/constants'
import i18n from '../i18n'
import { Token } from '../sdk'

export { StarknetChainId } from 'starknet/constants'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in StarknetChainId]: Token[]
}

export const CSS_PREFIX = 'l0k-swap'

export const MOBILE_SIZE = 768

export const CHAIN_LABELS: { [chainId in StarknetChainId]: string } = {
  [StarknetChainId.MAINNET]: i18n.global.t('main_network'),
  [StarknetChainId.TESTNET]: i18n.global.t('goerli_test_network'),
}

const TKA = new Token(StarknetChainId.MAINNET, '0x01f16ff16e38786750800d81b89f442e7c88a282b58929516921115e551a14cf', 18, 'TKA', 'TestMainnet Token')
const TKB = new Token(StarknetChainId.MAINNET, '0x06dd5d9a4fa06d10afb39ae267ac6d3999e36e16d160082cf5c612e4ed944f2b', 18, 'TKB', 'TestMainnet Token')

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [StarknetChainId.MAINNET]: [],
  [StarknetChainId.TESTNET]:[TKA, TKB]
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in StarknetChainId]?: { [tokenAddress: string]: Token[] } } = {
  [StarknetChainId.MAINNET]: {},
}
