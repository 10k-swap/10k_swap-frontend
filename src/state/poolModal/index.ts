import { defineStore } from 'pinia'
import { Pair } from 'l0k_swap-sdk'

export enum Actions {
  BURN,
  MINT,
}

export interface PoolModalStoreState {
  removeLiquidityPair: Pair | undefined
  addLiquidityPair: Pair | undefined
  show: boolean
  action: Actions
}

interface PoolStoreAction {
  togglePoolModal: (show: boolean) => void
  newPosition: () => void
  addLiquidity: (pair: Pair) => void
  withdraw: (pair: Pair) => void
  _resetState: () => void
}

export const usePoolModalStore = defineStore<'poolModal', PoolModalStoreState, {}, PoolStoreAction>('poolModal', {
  state: () => {
    return {
      show: false,
      action: Actions.MINT,
      addLiquidityPair: undefined,
      removeLiquidityPair: undefined,
    }
  },
  actions: {
    togglePoolModal(show: boolean) {
      this.show = show
      if (!show) {
        this._resetState()
      }
    },
    newPosition() {
      this._resetState()
      this.show = true
    },
    addLiquidity(pair) {
      this.show = true
      this.addLiquidityPair = pair
      this.action = Actions.MINT
    },
    withdraw(pair) {
      this.show = true
      this.removeLiquidityPair = pair
      this.action = Actions.BURN
    },
    _resetState() {
      this.addLiquidityPair = undefined
      this.removeLiquidityPair = undefined
      this.action = Actions.MINT
    },
  },
})
