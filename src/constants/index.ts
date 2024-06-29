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

// export const RPCS_V4: { [starknetChainId in StarknetChainId]: string } = {
//   [StarknetChainId.MAINNET]: 'https://starknet-mainnet.public.blastapi.io/rpc/v0.4',
//   [StarknetChainId.TESTNET]: 'https://starknet-testnet.public.blastapi.io/rpc/v0.4',
// }

export const RPCS: { [starknetChainId in StarknetChainId]: string[] } = {
  [StarknetChainId.MAINNET]: [
    'https://free-rpc.nethermind.io/mainnet-juno',
    'https://starknet-mainnet.g.alchemy.com/v2/qeW9Qg4ew8AKLyzicQ7J7oOFI1NCtKyz',
    'https://starknet-mainnet.g.alchemy.com/v2/cUa595b4LBwHdDZ3uHSBZr7PS1NXgFCQ',
    'https://starknet-mainnet.g.alchemy.com/v2/ekJheYMyUgzO8bxrMq0e6PCgir5WuJqK',
    'https://starknet-mainnet.g.alchemy.com/v2/G9wJH34O_F038b_k329lcjOd_o38JA3j',
    'https://starknet-mainnet.g.alchemy.com/v2/-RKRlVd3tmxZAHYO2QbBNp6E6y7vCXXE',
    'https://starknet-mainnet.g.alchemy.com/v2/MG9LXo50DOJi4_g0qmtShuiJKY4KPQHF',
    'https://starknet-mainnet.g.alchemy.com/v2/JnR9OZ0EoYZTyhz91Kko2UkLLZ1jH7Eu',
    'https://starknet-mainnet.g.alchemy.com/v2/Ekse1g_j948hqjq79TAUGCkGETIxWMSI',
    'https://rpc.starknet.lava.build',
    'https://starknet.blockpi.network/v1/rpc/public',
    'https://starknet-mainnet.public.blastapi.io',
  ],
  [StarknetChainId.TESTNET]: [
    'https://free-rpc.nethermind.io/goerli-juno',
    'https://rpc.starknet-testnet.lava.build',
    'https://starknet-testnet.public.blastapi.io',
  ],
}
