import { StarknetChainId } from 'starknet/constants'
import JSBI from 'jsbi'
import i18n from '../i18n'
import { Percent } from '../sdk'

export { StarknetChainId } from 'starknet/constants'

export const CSS_PREFIX = 'l0k-swap'

export const ADDRESS_ZORE = '0x0000000000000000000000000000000000000000000000000000000000000000'

export const PAIR_CONTRACT_CLASS_HASH = '0x78062101eb540ba039dc779bbf908e98b64efb4439bc9abd731e1156abd12cd'

export const MOBILE_SIZE = 768

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 20

// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 60

export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)

export const CHAIN_LABELS: { [chainId in StarknetChainId]: string } = {
  [StarknetChainId.MAINNET]: i18n.global.t('main_network'),
  [StarknetChainId.TESTNET]: i18n.global.t('goerli_test_network'),
}
