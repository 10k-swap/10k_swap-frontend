// returns undefined if input token is undefined, or fails to get token contract,
import { computed, ComputedRef } from 'vue'
import { useTokenContract } from '../hooks/Contract'
import { Token, TokenAmount } from 'l0k_swap-sdk'
import { useStarknetCall } from '../starknet-vue/hooks/call'
import { uint256 } from 'starknet5'

// or contract total supply cannot be fetched
export function useTotalSupply(token: ComputedRef<Token | undefined | null>): ComputedRef<TokenAmount | null | undefined> {
  const address = computed(() => token.value?.address)
  const contract = useTokenContract(address)

  const totalSupply = useStarknetCall(contract, 'totalSupply')

  return computed(() => {
    if (totalSupply.state.loading) {
      return null
    }

    return token.value && totalSupply.state.data?.totalSupply
      ? new TokenAmount(token.value, uint256.uint256ToBN(totalSupply.state.data.totalSupply).toString())
      : undefined
  })
}

export default useTotalSupply
