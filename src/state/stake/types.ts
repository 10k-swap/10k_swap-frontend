import { Token } from 'l0k_swap-sdk'

export interface StakePool {
  poolId: number
  token0: Token
  token1: Token
  lpToken: Token
}
