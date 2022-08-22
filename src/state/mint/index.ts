import { defineStore } from 'pinia'
import { Field } from './types'

interface MintState {
  independentField: Field
  typedValue: string | number
  otherTypedValue: string | number // for the case when there's no liquidity
}

interface MintActions {
  resetMintState: () => void
  typeInput: (payload: { noLiquidity: boolean; field: Field; typedValue: string | number }) => void
}

export const useMintStore = defineStore<'mint', MintState, {}, MintActions>('mint', {
  state: () => {
    return {
      independentField: Field.CURRENCY_A,
      typedValue: '',
      otherTypedValue: '',
    }
  },
  actions: {
    resetMintState() {
      this.independentField = Field.CURRENCY_A
      this.typedValue = ''
      this.otherTypedValue = ''
    },
    typeInput({ noLiquidity, field, typedValue }) {
      if (noLiquidity) {
        // they're typing into the field they've last typed in
        if (field === this.independentField) {
          this.independentField = field
          this.typedValue = typedValue
        } else {
          // they're typing into a new field, store the other value
          this.otherTypedValue = this.typedValue
          this.typedValue = typedValue
          this.independentField = field
        }
      } else {
        this.independentField = field
        this.typedValue = typedValue
        this.otherTypedValue = ''
      }
    },
  },
})
