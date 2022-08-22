import { defineStore } from 'pinia'
import { StarknetChainId } from 'starknet/constants'
import { Pair, Token, TokenAmount } from '../../sdk'

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
  addLiqiudit: (pair: Pair) => void
  withdraw: (pair: Pair) => void
}

export const usePoolModalStore = defineStore<'poolModal', PoolModalStoreState, {}, PoolStoreAction>('poolModal', {
  state: () => {
    return {
      show: false,
      action: Actions.MINT,
      addLiqiuditPair: undefined,
      removeLiqiuditPair: new Pair(
        new TokenAmount(
          new Token(StarknetChainId.TESTNET, '0x01f16ff16e38786750800d81b89f442e7c88a282b58929516921115e551a14cf', 18, 'TKA', 'TestMainnet Token'),
          '1000'
        ),
        new TokenAmount(
          new Token(StarknetChainId.TESTNET, '0x0107de6ea0ab3ba87b08eff2a8cde01332aec64fb15a7196b837871adbc38699', 18, 'TKC', 'TestMainnet Token'),
          '1000'
        )
      ),
    }
  },
  actions: {
    togglePoolModal(show: boolean) {
      this.show = show
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
  },
})
