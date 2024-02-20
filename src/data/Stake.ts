import { Ref, computed } from 'vue'
import { useStakeContract } from '../hooks/Contract'
import { useStarknetCall } from '../starknet-vue/hooks/call'
import { StakePool } from '../state/stake/types'
import { JSBI, Token, TokenAmount } from 'l0k_swap-sdk'
import { useStarknet } from '../starknet-vue/providers/starknet'
import { STAKE_REWARD_TOKEN } from '../constants/stake'

export interface StakePoolInfo {
  acc_reward_per_share: JSBI
  alloc_points: JSBI
  last_reward_time: string
  lp_token: Token
  lp_tokens: TokenAmount
}

interface ContractPoolInfo {
  acc_reward_per_share: bigint
  alloc_points: bigint
  last_reward_time: bigint
  lp_token: bigint
  lp_tokens: bigint
}

export interface StakeUserInfo {
  stakedAmount: TokenAmount
}

interface ContractUserInfo {
  amount: bigint
  reward_debt: bigint
}

export interface StakeRewardInfo {
  rewardAmount: TokenAmount
}

export function usePoolInfo(p: Ref<StakePool | undefined>): Ref<StakePoolInfo | null | undefined> {
  const contract = useStakeContract()

  const inputs = computed(() => [p.value?.poolId] as any)
  const poolInfo = useStarknetCall(contract, 'pool_info', inputs)

  return computed(() => {
    if (poolInfo.state.loading) {
      return null
    }

    const data: ContractPoolInfo | undefined = poolInfo.state.data
    return data && p.value
      ? {
          acc_reward_per_share: JSBI.BigInt(data.acc_reward_per_share.toString()),
          alloc_points: JSBI.BigInt(data.alloc_points.toString()),
          last_reward_time: data.last_reward_time.toString(),
          lp_token: p.value.lpToken,
          lp_tokens: new TokenAmount(p.value.lpToken, data.lp_tokens.toString()),
        }
      : undefined
  })
}

export function useUserPoolInfo(p: Ref<StakePool | undefined>): Ref<StakeUserInfo | null | undefined> {
  const contract = useStakeContract()

  const {
    state: { account },
  } = useStarknet()

  const inputs = computed(() => {
    return [p.value?.poolId, account.value] as any
  })
  const userInfo = useStarknetCall(contract, 'user_info', inputs)

  return computed(() => {
    if (userInfo.state.loading) {
      return null
    }

    const data: ContractUserInfo | undefined = userInfo.state.data

    return data && p.value ? { stakedAmount: new TokenAmount(p.value.lpToken, data.amount.toString()) } : undefined
  })
}

export function useUserRewardInfo(p: Ref<StakePool | undefined>): Ref<StakeRewardInfo | null | undefined> {
  const contract = useStakeContract()

  const {
    state: { account, chainId },
  } = useStarknet()

  const inputs = computed(() => {
    return [p.value?.poolId, account.value] as any
  })
  const rewardInfo = useStarknetCall(contract, 'pending_rewards', inputs)

  return computed(() => {
    if (rewardInfo.state.loading) {
      return null
    }
    const rewardToken = chainId.value && STAKE_REWARD_TOKEN[chainId.value]

    return rewardInfo.state.data && rewardToken ? { rewardAmount: new TokenAmount(rewardToken, rewardInfo.state.data.toString()) } : undefined
  })
}

export function useTotalAllocPoints(): Ref<number | null | undefined> {
  const contract = useStakeContract()

  const data = useStarknetCall(contract, 'total_alloc_points', [])

  return computed(() => {
    if (data.state.loading) {
      return null
    }

    return data.state.data ? parseInt(data.state.data.toString()) : undefined
  })
}

export function useRewardPerSec(): Ref<string | null | undefined> {
  const contract = useStakeContract()

  const data = useStarknetCall(contract, 'reward_per_sec', [])

  return computed(() => {
    if (data.state.loading) {
      return null
    }

    return data.state.data ? data.state.data.toString() : undefined
  })
}
