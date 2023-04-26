import { ChainId } from 'l0k_swap-sdk'
import i18n from '../../i18n/index'

export default {
  [ChainId.TESTNET]: [
    {
      path: '/swap',
      name: i18n.global.t('nav.swap'),
    },
    {
      path: '/pool',
      name: i18n.global.t('nav.pool'),
    },
    {
      path: '/faucet',
      name: i18n.global.t('nav.faucet'),
    },
    {
      path: '/analytics',
      name: i18n.global.t('nav.analytics'),
    },
  ],
  [ChainId.MAINNET]: [
    {
      path: '/swap',
      name: i18n.global.t('nav.swap'),
    },
    {
      path: '/pool',
      name: i18n.global.t('nav.pool'),
    },
    {
      path: '/analytics',
      name: i18n.global.t('nav.analytics'),
    },
  ],
}
