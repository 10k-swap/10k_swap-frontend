<template>
  <div class="l0k-swap-stake-item">
    <div class="name">
      <TokenLogo class="token0" :token="pool.token0" :size="20" />
      <TokenLogo :token="pool.token1" :size="20" />
      <Text class="symbol" :size="'mini'" :color="'secondary-text'">
        {{ `${pool.token0.symbol}-${pool.token1.symbol}` }}
      </Text>
    </div>
    <Text class="total-staked" :size="'mini'" :color="'secondary-text'"> $ {{ stakedUSD?.toFixed(2) ?? '-' }} </Text>
    <div class="APR">
      <Text :size="'mini'" :color="'secondary-text'"> ({{ feesAPY?.toFixed(2) ?? '-' }} %) + {{ stakeAPY?.toFixed(2) ?? '-' }}% </Text>
    </div>
    <Text class="staked" :size="'mini'" :color="'secondary-text'"> $ {{ userStakedUSD ?? '-' }} </Text>
    <div class="unclaimed-reward">
      <Text :size="'mini'" :color="'secondary-text'"> {{ rewardInfo?.rewardAmount.toSignificant() ?? '-' }} {{ rewardToken?.symbol }} </Text>
      <!-- <button class="claim" :disabled="rewardInfo?.rewardAmount.equalTo('0')" @click="onClaim">Claim</button> -->
    </div>
    <div class="pool-share">
      <Text :size="'mini'" :color="'secondary-text'"> {{ poolShare?.toSignificant(2) ?? '-' }} % </Text>
    </div>
    <div class="oparation">
      <Button :size="'mini'" @click="onAdd"> Add </Button>
      <Button :size="'mini'" @click="onRemove"> Remove </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '../../../components/Button/Button'
import Text from '../../../components/Text/Text.vue'
import TokenLogo from '../../../components/TokenLogo/TokenLogo'
import useIsMobile from '../../../hooks/useIsMobile'
import { StakePool } from '../../../state/stake/types'
import { useStakeStore } from '../../../state/stake'
import { usePoolInfo, useRewardPerSec, useTotalAllocPoints, useUserPoolInfo, useUserRewardInfo } from '../../../data/Stake'
import { useAllPairs } from '../../../state/pool/hooks'
import { useUSDPrice } from '../../../state/stake/hooks'
import { Percent, TokenAmount } from 'l0k_swap-sdk'
import { STAKE_REWARD_TOKEN } from '../../../constants/stake'
import { useStarknet } from '../../../starknet-vue/providers/starknet'
import { getFeesAPY, getStakeAPY } from '../../../utils/getAPY'
import { getRewardTokenPrice } from '../../../utils/getRewardTokenPrice'

export default defineComponent({
  components: {
    Text,
    TokenLogo,
    Button,
  },
  props: {
    pool: {
      required: true,
      type: Object as PropType<StakePool>,
    },
  },
  setup(props) {
    const { pool } = toRefs(props)
    const { t } = useI18n()
    const isMobile = useIsMobile()
    const store = useStakeStore()

    const {
      state: { chainId },
    } = useStarknet()

    const [pairs] = useAllPairs()

    const totalAllocPoints = useTotalAllocPoints()
    const poolInfo = usePoolInfo(pool)
    const userInfo = useUserPoolInfo(pool)
    const rewardInfo = useUserRewardInfo(pool)
    const pair = computed(() => pairs.value.find((item) => (poolInfo.value ? item.pair.liquidityToken.equals(poolInfo.value.lp_token) : false)))
    const rewardToken = computed(() => chainId.value && STAKE_REWARD_TOKEN[chainId.value])
    const rewardPerSec = useRewardPerSec()

    const [rates] = useUSDPrice()

    const stakedUSD = computed(() => {
      if (!rates.value || !pair.value || !poolInfo.value) {
        return undefined
      }

      const token0 = pair.value.token0
      const token1 = pair.value.token1
      const token0Amount = new TokenAmount(
        token0,
        pair.value.pair.getLiquidityValue(token0, pair.value.totalSupply, poolInfo.value.lp_tokens, false).raw
      )
      const token1Amount = new TokenAmount(
        token1,
        pair.value.pair.getLiquidityValue(token1, pair.value.totalSupply, poolInfo.value.lp_tokens, false).raw
      )

      const token0Price = token0.symbol ? rates.value[token0.symbol] : undefined
      const token1Price = token1.symbol ? rates.value[token1.symbol] : undefined

      let usdValue = 0

      if (token0Price) {
        usdValue += parseFloat(token0Price) * parseFloat(token0Amount.toExact())
      }

      if (token1Price) {
        usdValue += parseFloat(token1Price) * parseFloat(token1Amount.toExact())
      }

      return usdValue
    })

    const userStakedUSD = computed(() => {
      if (!rates.value || !pair.value || !userInfo.value) {
        return undefined
      }

      const token0 = pair.value.token0
      const token1 = pair.value.token1
      const token0Amount = new TokenAmount(
        token0,
        pair.value.pair.getLiquidityValue(token0, pair.value.totalSupply, userInfo.value.stakedAmount, false).raw
      )
      const token1Amount = new TokenAmount(
        token1,
        pair.value.pair.getLiquidityValue(token1, pair.value.totalSupply, userInfo.value.stakedAmount, false).raw
      )

      const token0Price = token0.symbol ? rates.value[token0.symbol] : undefined
      const token1Price = token1.symbol ? rates.value[token1.symbol] : undefined

      let usdValue = 0

      if (token0Price) {
        usdValue += parseFloat(token0Price) * parseFloat(token0Amount.toExact())
      }

      if (token1Price) {
        usdValue += parseFloat(token1Price) * parseFloat(token1Amount.toExact())
      }

      return usdValue.toFixed(2)
    })

    const feesAPY = computed(() => (pair.value ? getFeesAPY(parseFloat(pair.value.fee24h), pair.value.liquidity) : 0))
    const stakeAPY = computed(() => {
      if (!totalAllocPoints.value || !rewardPerSec.value || !pair.value || !poolInfo.value || !stakedUSD.value || !chainId.value) {
        return 0
      }

      const rewardTokenPrice = getRewardTokenPrice(chainId.value, parseFloat(pair.value.strkPrice))
      const rewardToken = STAKE_REWARD_TOKEN[chainId.value]
      const tokenAmount = new TokenAmount(rewardToken, rewardPerSec.value)

      return getStakeAPY(
        parseFloat(tokenAmount.toExact()) * rewardTokenPrice,
        parseInt(poolInfo.value.alloc_points.toString()),
        totalAllocPoints.value,
        stakedUSD.value
      )
    })

    const poolShare = computed(() => {
      return userInfo.value && poolInfo.value ? new Percent(userInfo.value?.stakedAmount.raw, poolInfo.value?.lp_tokens.raw) : undefined
    })

    const onAdd = () => {
      store.onAdd(true, pool.value)
    }
    const onRemove = () => {
      store.onRemove(true, pool.value)
    }

    // const stakeAddress = computed(() => chainId.value && STAKE_ADDRESSES[chainId.value])
    // const executeContractAddresses = computed(() => {
    //   return stakeAddress.value ? [stakeAddress.value] : undefined
    // })
    // const {
    //   // state: executeState,
    //   execute: executeInvoke,
    //   reset: executeReset,
    // } = useStarknetExecute(executeContractAddresses, [l0k_master_abi as Abi], ['claim_fees_for'])

    // const onClaim = async () => {
    //   executeReset()
    //   if (!pool.value || rewardInfo.value?.rewardAmount.equalTo('0')) {
    //     return
    //   }
    //   const pId = uint256.bnToUint256(pool.value.poolId)

    //   await executeInvoke({
    //     args: [[pId.low, pId.high]],
    //     metadata: {
    //       message: `Claim ${rewardInfo.value?.rewardAmount?.toSignificant(3)} ${rewardInfo.value?.rewardAmount.token.symbol}`,
    //     },
    //   })
    // }

    return {
      isMobile,
      stakedUSD,
      userStakedUSD,
      rewardInfo,
      rewardToken,
      poolShare,
      feesAPY,
      stakeAPY,

      t,

      onAdd,
      onRemove,
      // onClaim,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../../styles/index.scss';

.l0k-swap-stake-item {
  display: flex;
  align-items: center;
  height: 58px;

  .name,
  .oparation {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 160px;
  }

  .name {
    .token0 {
      margin-right: 5px;
    }
    .symbol {
      margin-left: 10px;
    }
  }

  .APR,
  .staked,
  .total-staked {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 120px;
  }

  .unclaimed-reward {
    display: flex;
    justify-content: center;
    width: 175px;
    .claim {
      display: flex;
      align-items: center;
      justify-content: center;
      color: $color-white;
      background-color: $color-primary;
      outline: none;
      border-radius: 20px;
      height: 20px;
      padding: 4px 9px;
      font-size: 12px;
      border: 0;
      margin-left: 15px;
      cursor: pointer;
      :disabled {
        cursor: not-allowed;
        background-color: $color-bg-streak;
      }
    }
  }

  .pool-share {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80px;
  }

  .oparation {
    button {
      color: $color-blue;
      border-color: $color-blue;
    }
  }
}
</style>
