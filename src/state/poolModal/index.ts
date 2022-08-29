import { defineStore } from 'pinia'
import { Pair } from '../../sdk'

export enum Actions {
  BURN,
  MINT,
}

export interface PoolModalStoreState {
  removeLiqiuditPair: Pair | undefined
  addLiqiuditPair: Pair | undefined
  show: boolean
  action: Actions
}

interface PoolStoreAction {
  togglePoolModal: (show: boolean) => void
  newPosition: () => void
  addLiqiudit: (pair: Pair) => void
  withdraw: (pair: Pair) => void
  _resetState: () => void
}

export const usePoolModalStore = defineStore<'poolModal', PoolModalStoreState, {}, PoolStoreAction>('poolModal', {
  state: () => {
    return {
      show: false,
      action: Actions.MINT,
      addLiqiuditPair: undefined,
      removeLiqiuditPair: undefined,
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
    addLiqiudit(pair) {
      this.show = true
      this.addLiqiuditPair = pair
      this.action = Actions.MINT
    },
    withdraw(pair) {
      this.show = true
      this.removeLiqiuditPair = pair
      this.action = Actions.BURN
    },
    _resetState() {
      this.addLiqiuditPair = undefined
      this.removeLiqiuditPair = undefined
      this.action = Actions.MINT
    },
  },
})
