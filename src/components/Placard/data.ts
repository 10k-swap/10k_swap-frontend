import { ChainId } from 'l0k_swap-sdk'
import i18n from '../../i18n'
import { Placard } from './types'

export const placards: Placard[] = [
  {
    content: i18n.global.t('warning'),
    chainIds: [ChainId.MAINNET],
    type: 'warning',
  },
]
