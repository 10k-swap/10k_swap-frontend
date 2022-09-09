import { useDebounce } from '@vueuse/core'
import { computed, ComputedRef, ref, watch } from 'vue'
import { useSwapStore } from '.'
import { useTokenBalances } from '../../hooks/Balances'
import { useToken } from '../../hooks/Tokens'
import { useTradeExactIn, useTradeExactOut } from '../../hooks/Trades'
import { Token, Trade } from '../../sdk'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { isAddress } from '../../utils'
import { computeSlippageAdjustedAmounts } from '../../utils/prices'
import { tryParseAmount } from '../../utils/tryParseAmount'
import { useUserSwapSlippageTolerance } from '../slippageToleranceSettings/hooks'
import { Field } from './types'

/**
 * Returns true if any of the pairs or tokens in a trade have the given checksummed address
 * @param trade to check for the given address
 * @param checksummedAddress address to check in the pairs and tokens
 */
function involvesAddress(trade: Trade, checksummedAddress: string): boolean {
  return (
    trade.route.path.some((token) => token.address === checksummedAddress) ||
    trade.route.pairs.some((pair) => pair.liquidityToken.address === checksummedAddress)
  )
}

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Token) => void
  onSwitchTokens: () => void
  onUserInput: (field: Field, typedValue: string | number) => void
} {
  const store = useSwapStore()

  const onCurrencySelection = (field: Field, currency: Token) => {
    store.selectCurrency({
      field,
      currencyId: currency.address,
    })
  }

  const onSwitchTokens = () => {
    store.switchCurrencies()
  }

  const onUserInput = (field: Field, typedValue: string | number) => {
    store.typeInput(field, typedValue)
  }

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
  }
}

export function useSwapState() {
  const store = useSwapStore()
  return computed(() => store.$state)
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo() {
  const {
    state: { account },
  } = useStarknet()

  const swapState = useSwapState()
  const inputCurrencyId = computed(() => swapState.value.INPUT.currencyId)
  const outputCurrencyId = computed(() => swapState.value.OUTPUT.currencyId)
  const independentField = computed(() => swapState.value.independentField)
  const typedValue = computed(() => swapState.value.typedValue)
  const debouncedTypedValue = useDebounce(typedValue, 150)

  const inputCurrency = useToken(inputCurrencyId)
  const outputCurrency = useToken(outputCurrencyId)
  const to = computed(() => (swapState.value.recipient !== null ? swapState.value.recipient : account.value ?? null))

  const relevantTokenBalances = [useTokenBalances(account, inputCurrency), useTokenBalances(account, outputCurrency)]

  const isExactIn = computed(() => independentField.value === Field.INPUT)
  const token = computed(() => (isExactIn.value ? inputCurrency.value : outputCurrency.value))
  const parsedAmount = computed(() => {
    return tryParseAmount(debouncedTypedValue.value, token.value ?? undefined)
  })

  const currencyAmountIn = computed(() => (isExactIn.value ? parsedAmount.value : undefined))
  const bestTradeExactIn = useTradeExactIn(currencyAmountIn, outputCurrency)
  const currencyAmountOut = computed(() => (!isExactIn.value ? parsedAmount.value : undefined))
  const bestTradeExactOut = useTradeExactOut(inputCurrency, currencyAmountOut)

  const v2Trade = computed(() => {
    return isExactIn.value ? bestTradeExactIn.value : bestTradeExactOut.value
  })

  const currencyBalances = computed(() => ({
    [Field.INPUT]: relevantTokenBalances[0]?.value,
    [Field.OUTPUT]: relevantTokenBalances[1]?.value,
  }))

  const currencies: ComputedRef<{ [field in Field]?: Token }> = computed(() => ({
    [Field.INPUT]: inputCurrency.value ?? undefined,
    [Field.OUTPUT]: outputCurrency.value ?? undefined,
  }))

  const inputError = ref<string | undefined>()

  const allowedSlippage = useUserSwapSlippageTolerance()

  const slippageAdjustedAmounts = computed(() =>
    v2Trade.value && allowedSlippage.value ? computeSlippageAdjustedAmounts(v2Trade.value ?? undefined, allowedSlippage.value) : null
  )

  // compare input balance to max input based on version
  const balanceIn = computed(() => currencyBalances.value[Field.INPUT])
  const amountIn = computed(() => (slippageAdjustedAmounts.value ? slippageAdjustedAmounts.value[Field.INPUT] : null))

  watch([account, parsedAmount, currencies, balanceIn, amountIn, to], () => {
    inputError.value = undefined

    if (!account.value) {
      inputError.value = 'Connect Wallet'
    }
    if (!parsedAmount.value) {
      inputError.value = inputError.value ?? 'Enter an amount'
    }

    if (!currencies.value[Field.INPUT] || !currencies.value[Field.OUTPUT]) {
      inputError.value = inputError.value ?? 'Select a token'
    }

    const formattedTo = isAddress(to.value)
    if (!to.value || !formattedTo) {
      inputError.value = inputError.value ?? 'Enter a recipient'
    } else if (
      (bestTradeExactIn.value && involvesAddress(bestTradeExactIn.value, formattedTo)) ||
      (bestTradeExactOut.value && involvesAddress(bestTradeExactOut.value, formattedTo))
    ) {
      inputError.value = inputError.value ?? 'Invalid recipient'
    }

    if (balanceIn.value && amountIn.value && balanceIn.value.lessThan(amountIn.value)) {
      inputError.value = `Insufficient ${amountIn.value.token.symbol} balance`
    }
  })

  return {
    currencies,
    currencyBalances,
    parsedAmount,
    v2Trade,
    inputError,
  }
}
