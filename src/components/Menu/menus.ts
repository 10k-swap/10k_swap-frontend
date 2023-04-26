import i18n from '../../i18n/index'

export const menus = [
  {
    name: i18n.global.t('menu.swap'),
    path: '/',
    includePaths: ['/swap', '/pool', '/faucet', '/analytics'],
  },
  {
    name: i18n.global.t('menu.wallet'),
    path: '/wallet',
    includePaths: ['/wallet'],
  },
]
