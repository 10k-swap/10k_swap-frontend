import { defineStore } from 'pinia'
import { Field } from './types'

export interface SwapState {
  readonly independentField: Field
  readonly typedValue: string
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined
  }
  // the typed recipient address , or null if swap should go to sender
  readonly recipient: string | null
}

export const useModalStore = defineStore<'swap', SwapState>('swap', {
  state: () => {
    return {
      independentField: Field.INPUT,
      typedValue: '',
      [Field.INPUT]: {
        currencyId: '',
      },
      [Field.OUTPUT]: {
        currencyId: '',
      },
      recipient: null,
    }
  },
  actions: {},
})
