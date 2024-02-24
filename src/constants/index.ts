import i18n from '../i18n'
import { Percent, JSBI, StarknetChainId } from 'l0k_swap-sdk'

export const CSS_PREFIX = 'l0k-swap'

export const ADDRESS_ZORE = '0x0000000000000000000000000000000000000000000000000000000000000000'

export const MOBILE_SIZE = 768

// default allowed slippage, in bips
export const INITIAL_SWAP_ALLOWED_SLIPPAGE = 200
export const INITIAL_ALLOWED_SLIPPAGE = 200

// 2 days, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 60 * 24 * 2

export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)

export const CHAIN_LABELS: { [chainId in StarknetChainId]: string } = {
  [StarknetChainId.MAINNET]: i18n.global.t('main_network'),
  [StarknetChainId.TESTNET]: i18n.global.t('goerli_test_network'),
}

export const SERVER_URLS: { [chainId in StarknetChainId]: string } = {
  [StarknetChainId.MAINNET]: 'https://api.10kswap.com',
  [StarknetChainId.TESTNET]: 'https://goerli-api.10kswap.com',
}

export const SupporteChainId = StarknetChainId.MAINNET

export const DEFAULT_TXN_DISMISS_MS = 3000

export const ESTIMATE_GAS_FREE = JSBI.multiply(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(15)), JSBI.BigInt(5)) // 0.005 ETH

export const APK_DOWNLOAD_URL = 'https://apk.10kx.com/1.1.0/10kwallet.apk'

export const L0K_X_API = 'https://api.10kx.com'

export const WALLET_HREF = 'https://10kx.com/?wallet'

export const RPCS_V4: { [starknetChainId in StarknetChainId]: string } = {
  [StarknetChainId.MAINNET]: 'https://starknet-mainnet.public.blastapi.io/rpc/v0.4',
  [StarknetChainId.TESTNET]: 'https://starknet-testnet.public.blastapi.io/rpc/v0.4',
}

export const RPCS: { [starknetChainId in StarknetChainId]: string } = {
  [StarknetChainId.MAINNET]: 'https://starknet-mainnet.public.blastapi.io/rpc/v0.5',
  [StarknetChainId.TESTNET]: 'https://starknet-testnet.public.blastapi.io/rpc/v0.5',
}
