import { defineStore } from 'pinia'
import { StakePool } from './types'

export interface StakeState {
  showAddModal: boolean
  showRemoveModal: boolean
  selectPool: StakePool | undefined
}

export interface StakeActions {
  onAdd: (show: boolean, pool: StakePool) => void
  onRemove: (show: boolean, pool: StakePool) => void
  toggleAddModal: (show: boolean) => void
  toggleRemoveModal: (show: boolean) => void
}

export const useStakeStore = defineStore<'stake', StakeState, {}, StakeActions>('stake', {
  state: () => {
    return {
      showAddModal: false,
      showRemoveModal: false,
      selectPool: undefined,
    }
  },
  actions: {
    onAdd(show: boolean, pool: StakePool) {
      this.showAddModal = show
      this.selectPool = pool
    },
    onRemove(show: boolean, pool: StakePool) {
      this.showRemoveModal = show
      this.selectPool = pool
    },
    toggleAddModal(show: boolean) {
      this.showAddModal = show
    },
    toggleRemoveModal(show: boolean) {
      this.showRemoveModal = show
    },
  },
})
