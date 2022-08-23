import { defineStore } from 'pinia'
import { Field } from './types'

export interface BurnState {
  independentField: Field
  typedValue: string
}

interface BurnActions {
  typeInput: (payload: { field: Field; typedValue: string }) => void
}

export const useBurnStore = defineStore<'burn', BurnState, {}, BurnActions>('burn', {
  state: () => {
    return {
      independentField: Field.LIQUIDITY,
      typedValue: '',
    }
  },
  actions: {
    typeInput({ field, typedValue }) {
      this.independentField = field
      this.typedValue = typedValue
    },
  },
})
