import i18n from '../i18n'
import { Percent, JSBI, ChainId } from 'l0k_swap-sdk'

export const CSS_PREFIX = 'l0k-swap'

export const ADDRESS_ZORE = '0x0000000000000000000000000000000000000000000000000000000000000000'

export const MOBILE_SIZE = 768

// default allowed slippage, in bips
export const INITIAL_SWAP_ALLOWED_SLIPPAGE = 20
export const INITIAL_ALLOWED_SLIPPAGE = 200

// 60 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 60

export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)

export const CHAIN_LABELS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: i18n.global.t('main_network'),
  [ChainId.TESTNET]: i18n.global.t('goerli_test_network'),
}

export const SERVER_URLS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://api.10kswap.com',
  [ChainId.TESTNET]: 'https://goerli-api.10kswap.com',
}

export const SupporteChainId = ChainId.MAINNET

export const DEFAULT_TXN_DISMISS_MS = 3000
