import { ChainId } from 'l0k_swap-sdk'

export interface Placard {
  content: string
  type: 'info' | 'warning' | 'error'
  chainIds: ChainId[]
}
