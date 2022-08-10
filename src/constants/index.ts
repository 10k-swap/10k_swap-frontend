import { StarknetChainId } from 'starknet/constants'
import i18n from '../i18n'

export { StarknetChainId } from 'starknet/constants'

export const CSS_PREFIX = 'l0k-swap'

export const MOBILE_SIZE = 768

export const CHAIN_LABELS: { [chainId in StarknetChainId]: string } = {
  [StarknetChainId.MAINNET]: i18n.global.t('main_network'),
  [StarknetChainId.TESTNET]: i18n.global.t('goerli_test_network'),
}
