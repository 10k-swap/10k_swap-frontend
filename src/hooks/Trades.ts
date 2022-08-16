import { TokenAmount, Pair, Token, Trade } from '../sdk'
import { flatMap } from 'lodash'

import { BASES_TO_CHECK_TRADES_AGAINST, CUSTOM_BASES } from '../constants'
import { PairState, usePairs } from '../data/Reserves'
import { useStarknet } from '../starknet-vue/providers/starknet'
import { computed, ComputedRef } from 'vue'

function useAllCommonPairs(currencyA: ComputedRef<Token | null | undefined>, currencyB: ComputedRef<Token | null | undefined>): ComputedRef<Pair[]> {
  const {
    state: { chainId },
  } = useStarknet()

  // Base tokens for building intermediary trading routes
  const bases: ComputedRef<Token[]> = computed(() => (chainId.value ? BASES_TO_CHECK_TRADES_AGAINST[chainId.value] : []))

  // All pairs from base tokens
  const basePairs: ComputedRef<[Token, Token][]> = computed(() =>
    flatMap(bases.value, (base): [Token, Token][] => bases.value.map((otherBase) => [base, otherBase])).filter(
      ([t0, t1]) => t0.address !== t1.address
    )
  )

  const tokens = computed(() => (chainId.value ? [currencyA.value, currencyB.value] : [undefined, undefined]))

  const allPairCombinations: ComputedRef<[Token, Token][]> = computed(() => {
    if (!tokens.value[0] || !tokens.value[1]) {
      return []
    }
    return (
      [
        // the direct pair
        [tokens.value[0], tokens.value[1]],
        // token A against all bases
        ...bases.value.map((base): [Token, Token] => [tokens.value[0] as Token, base]),
        // token B against all bases
        ...bases.value.map((base): [Token, Token] => [tokens.value[1] as Token, base]),
        // each base against all bases
        ...basePairs.value,
      ]
        .filter((tokens): tokens is [Token, Token] => Boolean(tokens[0] && tokens[1]))
        .filter(([t0, t1]) => t0.address !== t1.address)
        // This filter will remove all the pairs that are not supported by the CUSTOM_BASES settings
        // This option is currently not used on Pancake swap
        .filter(([t0, t1]) => {
          if (!chainId.value) return true
          const customBases = CUSTOM_BASES[chainId.value]
          if (!customBases) return true

          const customBasesA: Token[] | undefined = customBases[t0.address]
          const customBasesB: Token[] | undefined = customBases[t1.address]

          if (!customBasesA && !customBasesB) return true
          if (customBasesA && !customBasesA.find((base) => t1.equals(base))) return false
          if (customBasesB && !customBasesB.find((base) => t0.equals(base))) return false

          return true
        })
    )
  })

  const allPairs = usePairs(allPairCombinations)

  // only pass along valid pairs, non-duplicated pairs
  return computed(() =>
    Object.values(
      allPairs.value
        // filter out invalid pairs
        .filter((result): result is [PairState.EXISTS, Pair] => Boolean(result[0] === PairState.EXISTS && result[1]))
        // filter out duplicated pairs
        .reduce<{ [pairAddress: string]: Pair }>((memo, [, curr]) => {
          memo[curr.liquidityToken.address] = memo[curr.liquidityToken.address] ?? curr
          return memo
        }, {})
    )
  )
}

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export function useTradeExactIn(
  currencyAmountIn: ComputedRef<TokenAmount | undefined>,
  currencyOut: ComputedRef<Token | null | undefined>
): ComputedRef<Trade | null> {
  const currencyIn = computed(() => currencyAmountIn.value?.currency)
  const allowedPairs = useAllCommonPairs(currencyIn, currencyOut)

  return computed(() => {
    if (currencyAmountIn.value && currencyOut.value && allowedPairs.value.length > 0) {
      return Trade.bestTradeExactIn(allowedPairs.value, currencyAmountIn.value, currencyOut.value, { maxHops: 3, maxNumResults: 1 })[0] ?? null
    }
    return null
  })
}

/**
 * Returns the best trade for the token in to the exact amount of token out
 */
export function useTradeExactOut(
  currencyIn: ComputedRef<Token | null | undefined>,
  currencyAmountOut: ComputedRef<TokenAmount | undefined>
): ComputedRef<Trade | null> {
  const out = computed(() => currencyAmountOut.value?.token)
  const allowedPairs = useAllCommonPairs(currencyIn, out)

  return computed(() => {
    if (currencyIn.value && currencyAmountOut.value && allowedPairs.value.length > 0) {
      return Trade.bestTradeExactOut(allowedPairs.value, currencyIn.value, currencyAmountOut.value, { maxHops: 3, maxNumResults: 1 })[0] ?? null
    }
    return null
  })
}
