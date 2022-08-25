import { toBN } from 'starknet/utils/number'
import { computed, ComputedRef, toRaw } from 'vue'
import { StarknetChainId } from '../constants'
import tokens from '../constants/tokens'
import { Token } from '../sdk'
import { useStarknetCall } from '../starknet-vue/hooks/call'
import { useStarknet } from '../starknet-vue/providers/starknet'
import { BN2String } from '../utils'
import { useTokenContract } from './Contract'

const tokenCaches = tokens

function getCaches(chainId: StarknetChainId, address: string) {
  const a = toBN(address)
  return tokenCaches[chainId].find((item) => a.eq(toBN(item.address)))
}

// null if loading
// otherwise returns the token
export function useToken(tokenAddress: ComputedRef<string | undefined>): ComputedRef<Token | undefined | null> {
  const {
    state: { chainId },
  } = useStarknet()

  const address = computed(() => {
    return tokenAddress?.value ?? undefined
  })

  const tokenContract = useTokenContract(address)
  const token: ComputedRef<Token | undefined> = computed(() => (address.value && chainId.value ? getCaches(chainId.value, address.value) : undefined))

  const contract = computed(() => (token.value ? undefined : tokenContract.value))
  const tokenName = useStarknetCall(contract, 'name')
  const symbol = useStarknetCall(contract, 'symbol')
  const decimals = useStarknetCall(contract, 'decimals')

  return computed(() => {
    if (token.value) return token.value
    if (!chainId.value || !address.value) return undefined
    if (decimals.state.loading || symbol.state.loading || tokenName.state.loading) return null
    if (decimals.state.data) {
      const newToken = new Token(
        chainId.value,
        address.value,
        toRaw(decimals.state.data[0]).toNumber(),
        BN2String(symbol.state.data?.[0]),
        BN2String(tokenName.state.data?.[0])
      )
      tokenCaches[chainId.value].push(newToken)
      return newToken
    }
    return undefined
  })
}
