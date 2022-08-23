import { computed, ComputedRef, ref, Ref, watch } from 'vue'
import { useBurnStore } from '.'
import JSBI from 'jsbi'
import useTotalSupply from '../../data/TotalSupply'
import { useTokenBalances } from '../../hooks/Balances'
import { Pair, Percent, TokenAmount } from '../../sdk'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { Field } from './types'
import { tryParseAmount } from '../../utils/tryParseAmount'
import { useDebounce } from '@vueuse/core'

export function useBurnState() {
  const store = useBurnStore()
  return computed(() => store.$state)
}

export function useDerivedBurnInfo(pair: Ref<Pair | undefined | null>): {
  parsedAmounts: ComputedRef<{
    [Field.LIQUIDITY]?: TokenAmount
    [Field.CURRENCY_A]?: TokenAmount
    [Field.CURRENCY_B]?: TokenAmount
  }>
  error: Ref<string | undefined>
  userLiquidity: ComputedRef<TokenAmount | null | undefined>
  poolShare: ComputedRef<Percent | undefined>
  liquidityValueB: ComputedRef<TokenAmount | undefined>
  liquidityValueA: ComputedRef<TokenAmount | undefined>
} {
  const {
    state: { account },
  } = useStarknet()

  const burnState = useBurnState()
  const independentField = computed(() => burnState.value.independentField)
  const typedValue: ComputedRef<string> = computed(() => burnState.value.typedValue)
  const debouncedTypedValue = useDebounce(typedValue, 150)

  // balances
  const liquidityToken = computed(() => pair.value?.liquidityToken)
  const userLiquidity = useTokenBalances(account ?? undefined, liquidityToken)

  const tokens = computed(() => ({
    [Field.CURRENCY_A]: pair.value?.token0,
    [Field.CURRENCY_B]: pair.value?.token1,
    [Field.LIQUIDITY]: liquidityToken.value,
  }))

  // liquidity values
  const totalSupply = useTotalSupply(liquidityToken)
  const liquidityValueA = computed(() => {
    const tokenA = tokens.value[Field.CURRENCY_A]

    return pair.value &&
      totalSupply.value &&
      userLiquidity.value &&
      tokenA &&
      // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
      JSBI.greaterThanOrEqual(totalSupply.value.raw, userLiquidity.value.raw)
      ? new TokenAmount(tokenA, pair.value.getLiquidityValue(tokenA, totalSupply.value, userLiquidity.value, false).raw)
      : undefined
  })
  const liquidityValueB = computed(() => {
    const tokenB = tokens.value[Field.CURRENCY_B]

    return pair.value &&
      totalSupply.value &&
      userLiquidity.value &&
      tokenB &&
      // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
      JSBI.greaterThanOrEqual(totalSupply.value.raw, userLiquidity.value.raw)
      ? new TokenAmount(tokenB, pair.value.getLiquidityValue(tokenB, totalSupply.value, userLiquidity.value, false).raw)
      : undefined
  })

  const liquidityValues: ComputedRef<{ [Field.CURRENCY_A]?: TokenAmount; [Field.CURRENCY_B]?: TokenAmount }> = computed(() => ({
    [Field.CURRENCY_A]: liquidityValueA.value,
    [Field.CURRENCY_B]: liquidityValueB.value,
  }))

  const percentToRemove = computed(() => {
    // user specified a specific amount of liquidity tokens
    if (independentField.value === Field.LIQUIDITY) {
      if (pair.value?.liquidityToken && userLiquidity.value) {
        const independentAmount = tryParseAmount(debouncedTypedValue.value, pair.value.liquidityToken)
        if (independentAmount && userLiquidity.value && !independentAmount.greaterThan(userLiquidity.value)) {
          return new Percent(independentAmount.raw, userLiquidity.value.raw)
        }
      }
    }
    // user specified a specific amount of token a or b
    else if (tokens.value[independentField.value]) {
      const independentAmount = tryParseAmount(debouncedTypedValue.value, tokens.value[independentField.value])
      const liquidityValue = liquidityValues.value[independentField.value]
      if (independentAmount && liquidityValue && !independentAmount.greaterThan(liquidityValue)) {
        return new Percent(independentAmount.raw, liquidityValue.raw)
      }
    }
    return undefined
  })

  const parsedAmounts: ComputedRef<{
    [Field.LIQUIDITY]?: TokenAmount
    [Field.CURRENCY_A]?: TokenAmount
    [Field.CURRENCY_B]?: TokenAmount
  }> = computed(() => {
    const tokenA = tokens.value[Field.CURRENCY_A]
    const tokenB = tokens.value[Field.CURRENCY_B]

    return {
      [Field.LIQUIDITY]:
        userLiquidity.value && percentToRemove.value && percentToRemove.value.greaterThan('0')
          ? new TokenAmount(userLiquidity.value.token, percentToRemove.value.multiply(userLiquidity.value.raw).quotient)
          : undefined,
      [Field.CURRENCY_A]:
        tokenA && percentToRemove.value && percentToRemove.value.greaterThan('0') && liquidityValueA.value
          ? new TokenAmount(tokenA, percentToRemove.value.multiply(liquidityValueA.value.raw).quotient)
          : undefined,
      [Field.CURRENCY_B]:
        tokenB && percentToRemove.value && percentToRemove.value.greaterThan('0') && liquidityValueB.value
          ? new TokenAmount(tokenB, percentToRemove.value.multiply(liquidityValueB.value.raw).quotient)
          : undefined,
    }
  })

  const poolShare = computed(() => {
    if (userLiquidity.value && totalSupply.value) {
      return new Percent(userLiquidity.value.raw, totalSupply.value.raw)
    }
    return undefined
  })

  const error = ref<string | undefined>()
  watch([account, parsedAmounts], () => {
    error.value = undefined

    if (!account.value) {
      error.value = 'Connect Wallet'
    }

    if (!parsedAmounts.value[Field.LIQUIDITY] || !parsedAmounts.value[Field.CURRENCY_A] || !parsedAmounts.value[Field.CURRENCY_B]) {
      error.value = error.value ?? 'Enter an amount'
    }
  })

  return { parsedAmounts, error, userLiquidity, poolShare, liquidityValueA, liquidityValueB }
}

export function useBurnActionHandlers(): {
  onUserInput: (field: Field, typedValue: string) => void
} {
  const store = useBurnStore()
  const onUserInput = (field: Field, typedValue: string) => {
    store.typeInput({ field, typedValue })
  }

  return {
    onUserInput,
  }
}
