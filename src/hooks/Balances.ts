import { computed, ComputedRef, Ref } from 'vue'
import { Token, TokenAmount, JSBI } from 'l0k_swap-sdk'
import { useStarknetCalls } from '../starknet-vue/hooks/call'
import { isAddress } from '../utils'
import erc20 from '../constants/abis/erc20.json'
import { Abi, Contract, uint256 } from 'starknet5'
import { useStarknet } from '../starknet-vue/providers/starknet'
import { getRpcProvider } from '../utils/getRpcProvider'
import { defaultChainId } from '../starknet-vue/providers/starknet/const'

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address: Ref<string | undefined> | ComputedRef<string | undefined>,
  tokens: ComputedRef<(Token | undefined)[]>
): [ComputedRef<{ [tokenAddress: string]: TokenAmount | null | undefined }>, ComputedRef<boolean>] {
  const {
    state: { chainId },
  } = useStarknet()
  const validatedTokens: ComputedRef<Token[]> = computed(() => {
    return tokens.value?.filter((t?: Token): t is Token => (isAddress(t?.address) ? true : false)) ?? []
  })
  const validatedTokenAddresses = computed(() => validatedTokens.value.map((vt) => vt.address))

  const contracts = computed(() =>
    validatedTokenAddresses.value.map((item) => new Contract(erc20 as Abi, item, getRpcProvider(chainId.value || defaultChainId)))
  )
  const methods = computed(() => validatedTokenAddresses.value.map(() => 'balanceOf'))
  const args = computed(() => validatedTokenAddresses.value.map(() => [address.value]))
  const balances = useStarknetCalls(contracts, methods, args as any)

  const anyLoading = computed(() => balances.states.loading)

  const data = computed(() => {
    return address && validatedTokens.value.length > 0
      ? validatedTokens.value.reduce<{ [tokenAddress: string]: TokenAmount | null | undefined }>((memo, token, i) => {
          const value = balances.states.data?.[i]?.balance
          const amount = value ? JSBI.BigInt(uint256.uint256ToBN(value).toString()) : undefined

          if (amount) {
            memo[token.address] = new TokenAmount(token, amount)
          }
          if (anyLoading.value) {
            memo[token.address] = null
          }
          return memo
        }, {})
      : {}
  })

  return [data, anyLoading]
}

export function useTokensBalances(address: Ref<string | undefined> | ComputedRef<string | undefined>, tokens: ComputedRef<(Token | undefined)[]>) {
  const [balances] = useTokenBalancesWithLoadingIndicator(address, tokens)
  return computed(() => tokens?.value.map((token) => (token?.address ? balances.value[token.address] : undefined)))
}

export function useTokenBalances(
  address: Ref<string | undefined> | ComputedRef<string | undefined>,
  token: ComputedRef<Token | null | undefined> | Ref<Token | undefined>
) {
  const tokens = computed(() => [token.value ?? undefined])
  const [balances, loading] = useTokenBalancesWithLoadingIndicator(address, tokens)

  return computed(() => (loading.value ? null : token.value ? balances.value[token.value.address] : undefined))
}
