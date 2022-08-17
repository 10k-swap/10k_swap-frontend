import { StarknetChainId } from 'starknet/constants'
import JSBI from 'jsbi'
import i18n from '../i18n'
import { Percent, Token } from '../sdk'

export { StarknetChainId } from 'starknet/constants'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in StarknetChainId]: Token[]
}

export const CSS_PREFIX = 'l0k-swap'

export const ADDRESS_ZORE = '0x0000000000000000000000000000000000000000000000000000000000000000'

export const ROUTER_ADDRESSES: {
  [chainId in StarknetChainId]: string
} = {
  [StarknetChainId.MAINNET]: '',
  [StarknetChainId.TESTNET]: '0x0666a26b85b439dc6e5ab00f4578c8354edf5a1c9ee63d68a97c50949488ccaf',
}

export const MOBILE_SIZE = 768

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 20
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)

export const CHAIN_LABELS: { [chainId in StarknetChainId]: string } = {
  [StarknetChainId.MAINNET]: i18n.global.t('main_network'),
  [StarknetChainId.TESTNET]: i18n.global.t('goerli_test_network'),
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [StarknetChainId.MAINNET]: [],
  [StarknetChainId.TESTNET]: [
    new Token(StarknetChainId.TESTNET, '0x01f16ff16e38786750800d81b89f442e7c88a282b58929516921115e551a14cf', 18, 'TKA', 'TestMainnet Token'),
  ],
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in StarknetChainId]?: { [tokenAddress: string]: Token[] } } = {
  [StarknetChainId.MAINNET]: {},
}
