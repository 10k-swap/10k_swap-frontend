import { Token, JSBI, Pair, Percent, Price, TokenAmount } from '../../sdk'
import { PairState, usePair } from '../../data/Reserves'
import { useTotalSupply } from '../../data/TotalSupply'
import { computed, ComputedRef, ref, Ref, watch } from 'vue'

import { useMintStore } from '../index'
import { tryParseAmount } from '../../utils/tryParseAmount'
import { Field } from './types'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { ZERO } from '../../sdk/constants'
import { useTokenBalances } from '../../hooks/Balances'
import { useDebounce } from '@vueuse/core'

export function useMintState() {
  const store = useMintStore()
  return computed(() => store.$state)
}

export function useDerivedMintInfo(
  currencyA: ComputedRef<Token | undefined> | Ref<Token | undefined>,
  currencyB: ComputedRef<Token | undefined> | Ref<Token | undefined>
): {
  dependentField: ComputedRef<Field>
  currencies: ComputedRef<{ [field in Field]?: Token }>
  pair: ComputedRef<Pair | null | undefined>
  pairState: ComputedRef<PairState>
  currencyBalances: ComputedRef<{ [field in Field]?: TokenAmount | null }>
  parsedAmounts: ComputedRef<{ [field in Field]?: TokenAmount }>
  price: ComputedRef<Price | undefined>
  noLiquidity: ComputedRef<boolean | undefined>
  liquidityMinted: ComputedRef<TokenAmount | undefined>
  poolTokenPercentage: ComputedRef<Percent | undefined>
  error: Ref<string | undefined>
  totalSupply: ComputedRef<TokenAmount | null | undefined>
} {
  const {
    state: { account },
  } = useStarknet()

  const mintState = useMintState()

  const independentField = computed(() => mintState.value.independentField)
  const typedValue = computed(() => mintState.value.typedValue)
  const otherTypedValue = computed(() => mintState.value.otherTypedValue)

  const debouncedTypedValue = useDebounce(typedValue, 150)
  const debouncedOtherTypedValue = useDebounce(otherTypedValue, 150)

  const dependentField = computed(() => (independentField.value === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A))

  // tokens
  const currencies: ComputedRef<{ [field in Field]?: Token }> = computed(() => ({
    [Field.CURRENCY_A]: currencyA.value ?? undefined,
    [Field.CURRENCY_B]: currencyB.value ?? undefined,
  }))

  // pair
  const pairInfo = usePair(currencyA, currencyB)
  const pairState = computed(() => pairInfo.value?.[0])
  const pair = computed(() => pairInfo.value?.[1])

  const liquidityToken = computed(() => pair.value?.liquidityToken)
  const totalSupply = useTotalSupply(liquidityToken)

  const noLiquidity: ComputedRef<boolean> = computed(
    () => pairState.value === PairState.NOT_EXISTS || Boolean(totalSupply.value && JSBI.equal(totalSupply.value.raw, ZERO))
  )

  // balances
  const balances = [useTokenBalances(account, currencyA), useTokenBalances(account, currencyB)]
  const currencyBalances = computed(() => ({
    [Field.CURRENCY_A]: balances[0].value,
    [Field.CURRENCY_B]: balances[1].value,
  }))

  // amounts
  const independentAmount: ComputedRef<TokenAmount | undefined> = computed(() =>
    tryParseAmount(debouncedTypedValue.value, currencies.value[independentField.value])
  )
  const dependentAmount: ComputedRef<TokenAmount | undefined> = computed(() => {
    if (noLiquidity.value) {
      if (debouncedOtherTypedValue.value && currencies.value[dependentField.value]) {
        return tryParseAmount(debouncedOtherTypedValue.value, currencies.value[dependentField.value])
      }
      return undefined
    }
    if (independentAmount.value) {
      const [tokenA, tokenB] = [currencyA.value, currencyB.value]

      if (tokenA && tokenB && independentAmount.value && pair.value) {
        const dependentTokenAmount =
          dependentField.value === Field.CURRENCY_B
            ? pair.value.priceOf(tokenA).quote(independentAmount.value)
            : pair.value.priceOf(tokenB).quote(independentAmount.value)
        return dependentTokenAmount
      }
      return undefined
    }
    return undefined
  })
  const parsedAmounts: ComputedRef<{ [field in Field]: TokenAmount | undefined }> = computed(() => ({
    [Field.CURRENCY_A]: independentField.value === Field.CURRENCY_A ? independentAmount.value : dependentAmount.value,
    [Field.CURRENCY_B]: independentField.value === Field.CURRENCY_A ? dependentAmount.value : independentAmount.value,
  }))

  const price = computed(() => {
    if (noLiquidity.value) {
      const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts.value
      if (currencyAAmount && currencyBAmount) {
        return new Price(currencyAAmount.currency, currencyBAmount.currency, currencyAAmount.raw, currencyBAmount.raw)
      }
      return undefined
    }
    return pair.value && currencyA.value ? pair.value.priceOf(currencyA.value) : undefined
  })

  // liquidity minted
  const liquidityMinted = computed(() => {
    const { [Field.CURRENCY_A]: tokenAmountA, [Field.CURRENCY_B]: tokenAmountB } = parsedAmounts.value
    if (pair.value && totalSupply.value && tokenAmountA && tokenAmountB) {
      return pair.value.getLiquidityMinted(totalSupply.value, tokenAmountA, tokenAmountB)
    }
    // first mint
    if (noLiquidity.value && tokenAmountA && tokenAmountB) {
      const pair = new Pair(new TokenAmount(tokenAmountA.token, '0'), new TokenAmount(tokenAmountB.token, '0'))
      try {
        return pair.getLiquidityMinted(new TokenAmount(pair.liquidityToken, '0'), tokenAmountA, tokenAmountB)
      } catch (error) {
        return undefined
      }
    }
    return undefined
  })

  const poolTokenPercentage = computed(() => {
    if (liquidityMinted.value && totalSupply.value) {
      return new Percent(liquidityMinted.value.raw, totalSupply.value.add(liquidityMinted.value).raw)
    }
    return undefined
  })

  const error = ref<string | undefined>()
  watch([account, pairState, currencies, parsedAmounts, liquidityMinted], () => {
    error.value = undefined

    if (!account.value) {
      error.value = 'Connect Wallet'
    }

    if (pairState.value === PairState.INVALID) {
      error.value = error.value ?? 'Invalid pair'
    }

    if (!currencies.value[Field.CURRENCY_A] || !currencies.value[Field.CURRENCY_B]) {
      error.value = error.value ?? 'Select a token'
    }

    if (!parsedAmounts.value[Field.CURRENCY_A] || !parsedAmounts.value[Field.CURRENCY_B]) {
      error.value = error.value ?? 'Enter an amount'
    }

    const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts.value

    if (currencyAAmount && currencyBalances.value?.[Field.CURRENCY_A]?.lessThan(currencyAAmount)) {
      error.value = `Insufficient ${currencies.value[Field.CURRENCY_A]?.symbol} balance`
    }

    if (currencyBAmount && currencyBalances.value?.[Field.CURRENCY_B]?.lessThan(currencyBAmount)) {
      error.value = `Insufficient ${currencies.value[Field.CURRENCY_B]?.symbol} balance`
    }

    if (!liquidityMinted.value) {
      error.value = error.value ?? 'Insufficient input amount'
    }
  })

  return {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
    totalSupply,
  }
}

export function useMintActionHandlers(noLiquidity: ComputedRef<boolean | undefined>): {
  onFieldAInput: (typedValue: string | number) => void
  onFieldBInput: (typedValue: string | number) => void
} {
  const store = useMintStore()

  const onFieldAInput = (typedValue: string | number) => {
    store.typeInput({
      field: Field.CURRENCY_A,
      typedValue,
      noLiquidity: noLiquidity.value === true,
    })
  }

  const onFieldBInput = (typedValue: string | number) => {
    store.typeInput({
      field: Field.CURRENCY_B,
      typedValue,
      noLiquidity: noLiquidity.value === true,
    })
  }

  return {
    onFieldAInput,
    onFieldBInput,
  }
}
