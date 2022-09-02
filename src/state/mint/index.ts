import { defineStore } from 'pinia'
import { Token } from '../../sdk'
import { scientificNotationToString } from '../../utils/scientificNotationToString'
import { Field } from './types'

interface MintState {
  independentField: Field
  typedValue: string | number
  otherTypedValue: string | number // for the case when there's no liquidity
  tokenA: Token | undefined
  tokenB: Token | undefined
}

interface MintActions {
  resetMintState: () => void
  selectToken: ({ tokenA, tokenB }: { tokenA?: Token; tokenB?: Token }) => void
  typeInput: (payload: { noLiquidity: boolean; field: Field; typedValue: string | number }) => void
}

export const useMintStore = defineStore<'mint', MintState, {}, MintActions>('mint', {
  state: () => {
    return {
      independentField: Field.CURRENCY_A,
      typedValue: '',
      otherTypedValue: '',
      tokenA: undefined,
      tokenB: undefined,
    }
  },
  actions: {
    selectToken({ tokenA, tokenB }) {
      this.tokenA = tokenA ? tokenA : this.tokenA
      this.tokenB = tokenB ? tokenB : this.tokenB
    },
    resetMintState() {
      this.independentField = Field.CURRENCY_A
      this.typedValue = ''
      this.otherTypedValue = ''
    },
    typeInput({ noLiquidity, field, typedValue }) {
      typedValue = scientificNotationToString(typedValue.toString())

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
