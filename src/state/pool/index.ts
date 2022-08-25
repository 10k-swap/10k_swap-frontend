import { defineStore } from 'pinia'
import { StarknetChainId } from '../../constants'
import { getAllPairs, AllPairItem } from '../../server/pairs'

interface PoolState {
  pairs: AllPairItem[]
}
interface PoolActions {
  getAllPairs: (chainId: StarknetChainId) => void
}

export const usePoolStore = defineStore<'pool', PoolState, {}, PoolActions>('pool', {
  state: () => {
    return {
      pairs: [],
    }
  },
  actions: {
    async getAllPairs(chainId) {
      const pairs = await getAllPairs(chainId)
      this.pairs = pairs
    },
  },
})
