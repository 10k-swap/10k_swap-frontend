<template>
  <Popper :interactive="false" hover>
    <div class="l0k-swap-apr--button" role="button">
      <Text class="symbol" :size="isMobile ? 'mini' : 'small'">{{ APY }} %</Text>
    </div>
    <template #content>
      <div class="l0k-swap-apr--content">
        <div class="cell combined">
          <Text :size="'small'">Combined</Text>
          <Text class="combined-apy" :size="'small'">{{ APY }}%</Text>
        </div>
        <div class="cell fees-apy">
          <div class="tokens">
            <DoubleLogo class="logo" :token0="pool?.token0" :token1="pool?.token1" :size="16" coverage />
            <Text :size="'mini'" :color="'secondary-text'">Fees</Text>
          </div>
          <Text :size="'mini'">{{ feesAPY?.toFixed(2) }}%</Text>
        </div>
        <div class="cell staking-reward">
          <div class="tokens">
            <TokenLogo class="logo" :token="pool?.token0" :size="16" />
            <Text :size="'mini'" :color="'secondary-text'">Staking reward</Text>
          </div>
          <Text :size="'mini'">{{ stakeAPY?.toFixed(2) }}%</Text>
        </div>
        <div class="line" />
        <Text :size="'mini'" bold> Transaction Fee Income </Text>
        <Text :size="'mini'" :color="'secondary-text'"> Earn transaction fees by adding funds to the liquidity pool. </Text>
        <Text class="LP-token-staking-rewards" :size="'mini'" bold> LP Token Staking Rewards </Text>
        <Text :size="'mini'" :color="'secondary-text'"> Stake received LP tokens to earn additional rewards. </Text>
      </div>
    </template>
  </Popper>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue'
import Popper from 'vue3-popper'
import useIsMobile from '../../hooks/useIsMobile'
import { Pool } from '../../state'
import Text from '../Text/Text.vue'
import DoubleLogo from '../../components/DoubleLogo/index.vue'
import TokenLogo from '../../components/TokenLogo/TokenLogo'
import { usePoolInfo, useRewardPerSec, useTotalAllocPoints } from '../../data/Stake'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { STAKE_POOLS, STAKE_REWARD_TOKEN } from '../../constants/stake'
import { isEqualAddress, Pair, TokenAmount } from 'l0k_swap-sdk'
import { getFeesAPY, getStakeAPY } from '../../utils/getAPY'
import { getRewardTokenPrice } from '../../utils/getRewardTokenPrice'
import { useUSDPrice } from '../../state/stake/hooks'

export default defineComponent({
  props: {
    pool: {
      type: Object as PropType<Pool>,
    },
  },
  components: {
    Popper,
    Text,
    DoubleLogo,
    TokenLogo,
  },
  setup(props) {
    const { pool: pair } = toRefs(props)
    const isMobile = useIsMobile()
    const {
      state: { chainId },
    } = useStarknet()

    const stakePool = computed(() => {
      if (!chainId.value) return undefined
      return STAKE_POOLS[chainId.value].find((item) => (pair.value ? isEqualAddress(item.lpToken.address, pair.value?.pairAddress) : false))
    })

    const totalAllocPoints = useTotalAllocPoints()
    const poolInfo = usePoolInfo(stakePool)
    const [rates] = useUSDPrice()
    const rewardPerSec = useRewardPerSec()

    const stakedUSD = computed(() => {
      if (!rates.value || !pair.value || !poolInfo.value) {
        return undefined
      }
      const token0 = pair.value.pair.token0
      const token1 = pair.value.pair.token1

      const _pair = new Pair(
        new TokenAmount(pair.value.pair.reserve0.token, pair.value.pair.reserve0.raw.toString()),
        new TokenAmount(pair.value.pair.reserve1.token, pair.value.pair.reserve1.raw.toString())
      )

      const token0Amount = new TokenAmount(
        token0,

        _pair.getLiquidityValue(
          token0,
          new TokenAmount(_pair.liquidityToken, pair.value.totalSupply.raw.toString()),
          new TokenAmount(_pair.liquidityToken, poolInfo.value.lp_tokens.raw.toString()),
          false
        ).raw
      )
      const token1Amount = new TokenAmount(
        token1,
        _pair.getLiquidityValue(
          token1,
          new TokenAmount(_pair.liquidityToken, pair.value.totalSupply.raw.toString()),
          new TokenAmount(_pair.liquidityToken, poolInfo.value.lp_tokens.raw.toString()),
          false
        ).raw
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

    const APY = computed(() => (feesAPY.value + stakeAPY.value).toFixed(2))

    return {
      isMobile,
      APY,
      feesAPY,
      stakeAPY,
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/index.scss';

.l0k-swap-apr--button {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: $color-white;
  cursor: pointer;
  box-sizing: border-box;
  div {
    color: #3bc6a5;
    font-weight: bold;
    text-decoration: underline;
  }
}

.l0k-swap-apr--content {
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.43);
  padding: 15px;
  width: 210px;
  .cell {
    display: flex;
    justify-content: space-between;
  }
  .combined {
    margin-bottom: 10px;
    .combined-apy {
      color: #3bc6a5;
      font-weight: bold;
    }
  }
  .fees-apy {
    margin-bottom: 8px;
  }
  .staking-reward {
    .tokens {
      .logo {
        margin-right: 5px;
      }
    }
  }
  .tokens {
    display: flex;
    align-items: center;
  }
  .line {
    margin: 10px 0;
    border-bottom: 1px dashed #d9d9d9;
  }
  .LP-token-staking-rewards {
    margin-top: 8px;
  }
}
</style>
