import { defineStore } from 'pinia'
import { Pair } from 'l0k_swap-sdk'
import i18n from '../../i18n/index'

export enum Actions {
  BURN,
  MINT,
}

export interface PoolModalStoreState {
  removeLiquidityPair: Pair | undefined
  addLiquidityPair: Pair | undefined
  show: boolean
  currentNav: Actions
  tabs: {
    label: string
    value: Actions
  }[]
}

interface PoolStoreAction {
  togglePoolModal: (show: boolean) => void
  newPosition: () => void
  addLiquidity: (pair: Pair) => void
  addLiquidityFromMyPool: (pair: Pair) => void
  withdraw: (pair: Pair) => void
  updateNav: (nav: Actions) => void
  _resetState: () => void
}

const withdraw = { label: i18n.global.t('pool_modal.withdraw'), value: Actions.BURN }
const addLiquidity = { label: i18n.global.t('pool_modal.add_liquidity'), value: Actions.MINT }

export const usePoolModalStore = defineStore<'poolModal', PoolModalStoreState, {}, PoolStoreAction>('poolModal', {
  state: () => {
    return {
      show: false,
      addLiquidityPair: undefined,
      removeLiquidityPair: undefined,
      currentNav: Actions.MINT,
      tabs: [addLiquidity],
    }
  },
  actions: {
    togglePoolModal(show: boolean) {
      this.show = show
    },
    newPosition() {
      this._resetState()
      this.show = true
    },
    addLiquidity(pair) {
      this.show = true
      this.addLiquidityPair = pair
      this.tabs = [addLiquidity]
      this.currentNav = Actions.MINT
    },
    addLiquidityFromMyPool(pair) {
      this.show = true
      this.addLiquidityPair = pair
      this.removeLiquidityPair = pair
      this.tabs = [addLiquidity, withdraw]
      this.currentNav = Actions.MINT
    },
    withdraw(pair) {
      this.show = true
      this.removeLiquidityPair = pair
      this.addLiquidityPair = pair
      this.tabs = [addLiquidity, withdraw]
      this.currentNav = Actions.BURN
    },
    updateNav(nav: Actions) {
      this.currentNav = nav
    },
    _resetState() {
      this.addLiquidityPair = undefined
      this.removeLiquidityPair = undefined
      this.currentNav = Actions.MINT
      this.tabs = [addLiquidity]
    },
  },
})
