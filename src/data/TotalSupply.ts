// returns undefined if input token is undefined, or fails to get token contract,
import { uint256ToBN } from 'starknet/dist/utils/uint256'
import { computed, ComputedRef } from 'vue'
import { useTokenContract } from '../hooks/Contract'
import { Token, TokenAmount } from '../sdk'
import { useStarknetCall } from '../starknet-vue/hooks/call'

// or contract total supply cannot be fetched
export function useTotalSupply(token: ComputedRef<Token | undefined | null>): ComputedRef<TokenAmount | null | undefined> {
  const address = computed(() => token.value?.address)
  const contract = useTokenContract(address)

  const totalSupply = useStarknetCall(contract, 'totalSupply')

  return computed(() => {
    if (totalSupply.state.loading) {
      return null
    }
    return token.value && totalSupply.state.data?.[0] ? new TokenAmount(token.value, uint256ToBN(totalSupply.state.data[0]).toString()) : undefined
  })
}

export default useTotalSupply
