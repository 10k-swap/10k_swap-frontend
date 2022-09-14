import { defineStore } from 'pinia'
import { ONE_BIPS, StarknetChainId } from '../../constants'
import getBalances from '../../data/getBalances'
import { Pair, Percent, Token, TokenAmount, ZERO } from 'l0k_swap-sdk'
import { getAllPairs } from '../../server/pairs'

export interface Pool {
  token0: Token
  token1: Token
  pair: Pair
  totalSupply: TokenAmount
  pairAddress: string
  decimals: number
  reserve0: string
  reserve1: string
  APR: number
}

export interface UserPool {
  pair: Pair
  totalSupply: TokenAmount
  balance: TokenAmount
  APR: number
  poolShare: Percent
  poolShareView: string
}

interface PoolState {
  pairs: Pool[]
  loadingPools: boolean
  userPools: UserPool[]
}

interface PoolActions {
  getAllPairs: (chainId: StarknetChainId) => void
  getUserPairs: (chainId: StarknetChainId, account: string) => void
}

export const usePoolStore = defineStore<'pool', PoolState, {}, PoolActions>('pool', {
  state: () => {
    return {
      pairs: [],
      loadingPools: false,
      userPools: [],
    }
  },
  actions: {
    async getAllPairs(chainId) {
      this.loadingPools = true
      const pairs = await getAllPairs(chainId)
      this.pairs = pairs
      this.loadingPools = false
    },
    async getUserPairs(chainId, account) {
      if (!this.pairs.length) {
        return
      }

      const promises = this.pairs.map(async (item) => {
        const balance = await getBalances(account, item.pairAddress, chainId)
        if (balance) {
          const poolShare = new Percent(balance, item.totalSupply.raw.toString())
          return {
            pair: item.pair,
            totalSupply: item.totalSupply,
            APR: item.APR,
            balance: new TokenAmount(item.pair.liquidityToken, balance),
            poolShare,
            poolShareView: (poolShare?.lessThan(ONE_BIPS) ? '<0.01' : poolShare.toFixed(2)) ?? '0',
          }
        }
        return undefined
      })
      const userPools = await Promise.all(promises)

      this.userPools = userPools.filter((item): item is UserPool => !!(item && item.balance.greaterThan(ZERO)))
    },
  },
})
