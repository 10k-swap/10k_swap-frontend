import { StarknetChainId } from 'l0k_swap-sdk'
import i18n from '../../i18n/index'

export default {
  [StarknetChainId.TESTNET]: [
    {
      path: '/',
      name: i18n.global.t('header.nav.swap'),
    },
    {
      path: '/pool',
      name: i18n.global.t('header.nav.pool'),
    },
    {
      path: '/faucet',
      name: i18n.global.t('header.nav.faucet'),
    },
    {
      path: '/analytics',
      name: i18n.global.t('header.nav.analytics'),
    },
  ],
  [StarknetChainId.MAINNET]: [
    {
      path: '/',
      name: i18n.global.t('header.nav.swap'),
    },
    {
      path: '/pool',
      name: i18n.global.t('header.nav.pool'),
    },
    {
      path: '/analytics',
      name: i18n.global.t('header.nav.analytics'),
    },
  ],
}
