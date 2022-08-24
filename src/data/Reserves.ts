import { TokenAmount, Pair, Token } from '../sdk/index'
import I10kSwapPairABI from '../constants/abis/l0k_pair_abi.json'

import { useStarknetCalls } from '../starknet-vue/hooks/call'
import { computed, ComputedRef, Ref, toRaw } from 'vue'
import { useStarknet } from '../starknet-vue/providers/starknet'
import { Abi, Contract } from 'starknet'

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

// null if loading
export function usePairs(tokens: ComputedRef<[Token | undefined, Token | undefined][]>): ComputedRef<Array<[PairState, Pair | undefined | null]>> {
  const {
    state: { library },
  } = useStarknet()

  const pairAddresses = computed(() => {
    return tokens.value.map(([tokenA, tokenB]) => {
      return tokenA && tokenB && !tokenA.equals(tokenB) ? Pair.getAddress(tokenA, tokenB) : undefined
    })
  })

  const contracts = computed(() => {
    if (!pairAddresses.value) {
      return undefined
    }
    const pairContracts = pairAddresses.value.map((address) =>
      address ? new Contract(I10kSwapPairABI as Abi, address, toRaw(library.value)) : undefined
    )
    if (pairContracts.some((item) => item === undefined)) {
      return undefined
    }
    return pairContracts as Contract[]
  })
  const methods = computed(() => contracts.value?.map(() => 'getReserves'))
  const { states } = useStarknetCalls(contracts, methods)

  return computed(() => {
    if (!states.data) {
      return []
    }
    // one loading,all loading
    if (states.loading) {
      return [[PairState.LOADING, null]]
    }
    return states.data?.map((reserves, i) => {
      const tokenA = tokens.value[i]?.[0]
      const tokenB = tokens.value[i]?.[1]

      if (states.loading) return [PairState.LOADING, null]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, undefined]
      if (!reserves) return [PairState.NOT_EXISTS, undefined]
      const { reserve0, reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [PairState.EXISTS, new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString()))]
    })
  })
}

export function usePair(
  tokenA: Ref<Token | undefined> | ComputedRef<Token | undefined>,
  tokenB?: ComputedRef<Token | undefined> | Ref<Token | undefined>
): ComputedRef<[PairState, Pair | undefined | null]> {
  const tokens = computed<[Token | undefined, Token | undefined][]>(() => [[tokenA?.value, tokenB?.value]])
  const pairs = usePairs(tokens)

  return computed(() => {
    return pairs.value?.[0]
  })
}
