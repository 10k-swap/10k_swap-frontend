import { defineStore } from 'pinia'
import { Pair } from '../../sdk'

interface PoolStoreState {
  pair: Pair | undefined
  show: boolean
  fromWithdraw: boolean
}

interface PoolStoreAction {
  togglePoolModal: (show: boolean) => void
  addLiqiudit: (pair: Pair) => void
  withdraw: (pair: Pair) => void
}

export const usePoolModalStore = defineStore<'poolModal', PoolStoreState, {}, PoolStoreAction>('poolModal', {
  state: () => {
    return {
      show: false,
      fromWithdraw: false,
      pair: undefined,
    }
  },
  actions: {
    togglePoolModal(show: boolean) {
      this.show = show
    },
    addLiqiudit(pair) {
      this.show = true
      this.pair = pair
    },
    withdraw(pair) {
      this.show = true
      this.pair = pair
      this.fromWithdraw = true
    },
  },
})
