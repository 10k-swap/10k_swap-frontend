import { StarknetChainId } from 'l0k_swap-sdk'
import i18n from '../../i18n/index'

export default {
  [StarknetChainId.TESTNET]: [
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
    // {
    //   path: '/analytics',
    //   name: i18n.global.t('nav.analytics'),
    // },
  ],
  [StarknetChainId.MAINNET]: [
    {
      path: '/swap',
      name: i18n.global.t('nav.swap'),
    },
    {
      path: '/pool',
      name: i18n.global.t('nav.pool'),
    },
    // {
    //   path: '/analytics',
    //   name: i18n.global.t('nav.analytics'),
    // },
    // {
    //   path: '/rewards',
    //   name: i18n.global.t('nav.rewards'),
    // },
  ],
}
