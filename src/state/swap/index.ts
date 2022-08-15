import { defineStore } from 'pinia'
import { Field } from './types'

export interface SwapState {
  independentField: Field
  typedValue: string | number
  [Field.INPUT]: {
    currencyId: string | undefined
  }
  [Field.OUTPUT]: {
    currencyId: string | undefined
  }
  // the typed recipient address , or null if swap should go to sender
  recipient: string | null
}

export interface SwapActions {
  replaceSwapState: ({
    typedValue,
    recipient,
    field,
    inputCurrencyId,
    outputCurrencyId,
  }: {
    field: Field
    typedValue: string | number
    recipient: string | null
    inputCurrencyId: string | undefined
    outputCurrencyId: string | undefined
  }) => void
  selectCurrency: ({ currencyId, field }: { currencyId: string; field: Field }) => void
  switchCurrencies: () => void
  typeInput: (field: Field, typedValue: string | number) => void
}

export const useSwapStore = defineStore<'swap', SwapState, {}, SwapActions>('swap', {
  state: () => {
    return {
      independentField: Field.INPUT,
      typedValue: '',
      [Field.INPUT]: {
        currencyId: '0x01f16ff16e38786750800d81b89f442e7c88a282b58929516921115e551a14cf',
      },
      [Field.OUTPUT]: {
        currencyId: '',
      },
      recipient: null,
    }
  },
  actions: {
    replaceSwapState({ field, typedValue, inputCurrencyId, outputCurrencyId, recipient }) {
      this.independentField = field
      this.typedValue = typedValue
      this[Field.INPUT] = {
        currencyId: inputCurrencyId,
      }
      this[Field.OUTPUT] = {
        currencyId: outputCurrencyId,
      }
      this.recipient = recipient
    },
    selectCurrency({ currencyId, field }) {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT
      if (currencyId === this[otherField].currencyId) {
        // the case where we have to swap the order
        this.independentField = this.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
        this[otherField] = { currencyId: this[field].currencyId }
        this[field] = { currencyId }
        return
      }
      this[field] = { currencyId }
      // the normal case
    },
    switchCurrencies() {
      const input = this[Field.INPUT].currencyId
      const output = this[Field.OUTPUT].currencyId
      this.independentField = this.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
      this[Field.INPUT] = { currencyId: output }
      this[Field.OUTPUT] = { currencyId: input }
    },
    typeInput(field: Field, typedValue: string | number) {
      this.typedValue = typedValue
      this.independentField = field
    },
  },
})
