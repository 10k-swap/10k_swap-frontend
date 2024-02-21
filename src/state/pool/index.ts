import { defineStore } from 'pinia'
import { ONE_BIPS } from '../../constants'
import getBalances from '../../data/getBalances'
import { Pair, Percent, Token, TokenAmount, ZERO, StarknetChainId } from 'l0k_swap-sdk'
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
  APR: string
  liquidity: number
}

export interface UserPool {
  pair: Pair
  totalSupply: TokenAmount
  balance: TokenAmount
  APR: string
  poolShare: Percent
  poolShareView: string
}

interface PoolState {
  pairs: Pool[]
  loadingPools: boolean
  userPools: UserPool[]
  loadingUserPools: boolean
  lastUpdateUserPoolAt: number | undefined
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
      loadingUserPools: false,
      lastUpdateUserPoolAt: undefined,
    }
  },
  actions: {
    async getAllPairs(chainId) {
      this.loadingPools = true
      this.pairs = []
      const pairs = await getAllPairs(chainId)
      this.pairs = pairs
      this.loadingPools = false
    },
    async getUserPairs(chainId, account) {
      if (!this.pairs.length) {
        return
      }

      if (this.lastUpdateUserPoolAt && new Date().getTime() - this.lastUpdateUserPoolAt < 1000 * 60) {
        return
      }

      this.loadingUserPools = true

      const userPools: UserPool[] = []
      for (let index = 0; index < this.pairs.length; index++) {
        const item = this.pairs[index]

        const balance = await getBalances(account, item.pairAddress, chainId)
        if (balance) {
          const poolShare = new Percent(balance, item.totalSupply.raw.toString())
          userPools.push({
            pair: new Pair(
              new TokenAmount(item.pair.reserve0.token, item.pair.reserve0.raw.toString()),
              new TokenAmount(item.pair.reserve1.token, item.pair.reserve1.raw.toString())
            ),
            totalSupply: new TokenAmount(item.totalSupply.token, item.totalSupply.raw.toString()),
            APR: item.APR,
            balance: new TokenAmount(item.pair.liquidityToken, balance),
            poolShare,
            poolShareView: (poolShare?.lessThan(ONE_BIPS) ? '<0.01' : poolShare.toFixed(2)) ?? '0',
          })
        }
      }
      this.lastUpdateUserPoolAt = new Date().getTime()
      this.loadingUserPools = false

      this.userPools = userPools.filter((item): item is UserPool => !!(item && item.balance.greaterThan(ZERO)))
    },
  },
})
