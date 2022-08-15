import { computed, ComputedRef, toRaw } from 'vue'
import tokens from '../constants/tokens'
import { Token } from '../sdk'
import { useStarknetCall } from '../starknet-vue/hooks/call'
import { useStarknet } from '../starknet-vue/providers/starknet'
import { isAddress, BN2String } from '../utils'
import { StarknetChainId } from '../constants/index'
import { useTokenContract } from './Contract'

const tokenCaches = (Object.keys(tokens) as StarknetChainId[]).reduce((memo, key) => {
  memo[key] = tokens[key].reduce((memo, item) => {
    memo[item.address] = item
    return memo
  }, {} as { [address: string]: Token })
  return memo
}, {} as { [chainId in StarknetChainId]: { [address: string]: Token } })

// null if loading
// otherwise returns the token
export function useToken(tokenAddress: ComputedRef<string | undefined>): ComputedRef<Token | undefined | null> {
  const {
    state: { chainId },
  } = useStarknet()

  const address = computed(() => (isAddress(tokenAddress?.value) ? tokenAddress?.value : undefined))

  const tokenContract = useTokenContract(address)
  const token: ComputedRef<Token | undefined> = computed(() =>
    address.value && chainId.value ? tokenCaches[chainId.value][address.value] : undefined
  )

  const contract = computed(() => (token.value ? undefined : tokenContract.value))
  const tokenName = useStarknetCall(contract, 'name')
  const symbol = useStarknetCall(contract, 'symbol')
  const decimals = useStarknetCall(contract, 'decimals')

  return computed(() => {
    if (token.value) return token.value
    if (!chainId.value || !address.value) return undefined
    if (decimals.state.loading || symbol.state.loading || tokenName.state.loading) return null
    if (decimals.state.data) {
      return new Token(
        chainId.value,
        address.value,
        toRaw(decimals.state.data[0]).toNumber(),
        BN2String(symbol.state.data?.[0]),
        BN2String(tokenName.state.data?.[0])
      )
    }
    return undefined
  })
}
