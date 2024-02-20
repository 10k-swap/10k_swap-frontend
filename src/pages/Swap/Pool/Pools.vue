<template>
  <div class="pools-wrapper">
    <div class="pools-head">
      <Text class="name" :size="'small'">
        {{ t('pool.name') }}
      </Text>
      <Text class="APR" :size="'small'">
        {{ t('pool.APR') }}
      </Text>
      <Text class="liquidity" :size="'small'">
        {{ t('pool.liquidity') }}
      </Text>
      <Text class="add" :size="'small'">
        {{ t('pool.add') }}
      </Text>
    </div>
    <div class="pools">
      <div class="pair" v-for="pair in sortedPairs" :key="pair.pairAddress">
        <div class="tokens">
          <DoubleLogo :token0="pair.token0" :token1="pair.token1" :size="20" :coverage="isMobile" />
          <Text class="symbol" :size="isMobile ? 'mini' : 'small'" :color="'secondary-text'">
            {{ pair.token0.symbol }} - {{ pair.token1.symbol }}
          </Text>
        </div>
        <template v-if="hasStake(pair)">
          <APRPopper :pool="pair" />
        </template>
        <template v-else>
          <Text class="APR" :size="isMobile ? 'mini' : 'small'" :color="'secondary-text'"> {{ getAPY(pair) }} % </Text>
        </template>
        <Text class="liquidity" :size="isMobile ? 'mini' : 'small'" :color="'secondary-text'">$ {{ pair.liquidity.toFixed(2) }} </Text>
        <div class="oparation">
          <Text class="get" :size="isMobile ? 'mini' : 'small'" :color="'blue'" @click="onGet(pair)">
            {{ t('pool.get') }}
          </Text>
          <Button v-if="hasStake(pair)" class="add" :size="'small'" @click="onStake"> Stake </Button>
        </div>
      </div>
      <div class="loading" v-if="loading && !sortedPairs.length">
        <LoadingIcon />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import Text from '../../../components/Text/Text.vue'
import DoubleLogo from '../../../components/DoubleLogo/index.vue'
import { LoadingIcon } from '../../../components/Svg'
import useIsMobile from '../../../hooks/useIsMobile'
import { Pool, usePoolModalStore } from '../../../state'
import { cloneDeep } from 'lodash'
import Button from '../../../components/Button/Button'
import APRPopper from '../../../components/APRPopper/index.vue'
import { useRouter } from 'vue-router'
import { isEqualAddress } from 'l0k_swap-sdk'
import { useStarknet } from '../../../starknet-vue/providers/starknet'
import { STAKE_POOLS } from '../../../constants/stake'
import { getFeesAPY } from '../../../utils/getAPY'

export default defineComponent({
  props: {
    pairs: {
      type: Array as PropType<Pool[]>,
    },
    loading: {
      type: Boolean,
    },
  },
  components: {
    Text,
    DoubleLogo,
    LoadingIcon,
    Button,
    APRPopper,
  },
  setup(props) {
    const { pairs } = toRefs(props)

    const { t } = useI18n()

    const {
      state: { chainId },
    } = useStarknet()
    const poolModalStore = usePoolModalStore()
    const isMobile = useIsMobile()
    const router = useRouter()

    const sortedPairs = computed(() => cloneDeep(pairs.value ?? []).sort((a, b) => b.liquidity - a.liquidity))

    const onGet = (pool: Pool) => {
      poolModalStore.addLiquidity(pool.pair)
    }
    const onStake = () => {
      router.push({ path: '/stake' })
    }

    const hasStake = (pool: Pool) => {
      return chainId.value ? STAKE_POOLS[chainId.value].some((item) => isEqualAddress(pool.pairAddress, item.lpToken.address)) : false
    }
    const getAPY = (pool: Pool) => {
      return getFeesAPY(parseFloat(pool.fee24h), pool.liquidity).toFixed(2)
    }

    return {
      t,
      onGet,
      onStake,
      hasStake,
      getAPY,

      sortedPairs,
      isMobile,
    }
  },
})
</script>

<style lang="scss">
@import '../../../styles/index.scss';

.pools-wrapper {
  padding: 0 20px 20px;
  .pools-head {
    display: grid;
    align-items: center;
    grid-template-columns: 170px 100px 260px 170px;
    background: $color-bg-secondary;
    height: 32px;

    .name,
    .APR,
    .liquidity,
    .add {
      display: flex;
      justify-content: center;
    }
  }
  .pools {
    margin-top: 10px;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 52vh;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-corner {
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: $color-bg-transparent;
      border-radius: 4px;
    }
    .pair {
      display: grid;
      align-items: center;
      grid-template-columns: 170px 100px 260px 170px;
      padding: 10px 0;
      .tokens {
        display: flex;
        align-items: center;
        .symbol {
          margin-left: 8px;
        }
      }
      .APR,
      .liquidity {
        display: flex;
        justify-content: center;
      }
      .oparation {
        display: flex;
        align-items: center;
        .get {
          padding-left: 5px;
          cursor: pointer;
          text-align: center;
        }
        .add {
          color: $color-blue;
          border-color: $color-blue;
          margin-left: 20px;
        }
      }
    }
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
    }
  }
  @include mobile {
    width: 431px;
    padding: 0;

    .pools-head {
      grid-template-columns: 108px 80px 143px 100px;
    }
    .pools {
      .pair {
        grid-template-columns: 108px 80px 143px 100px;
        .tokens {
          .symbol {
            margin-left: 4px;
          }
        }
        .liquidity {
          @include no-wrap;
        }
      }
    }
  }
}
</style>
