import { ChainId } from 'l0k_swap-sdk'
import i18n from '../../i18n/index'

export default {
  [ChainId.TESTNET]: [
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
  [ChainId.MAINNET]: [
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
