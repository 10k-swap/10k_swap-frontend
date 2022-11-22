<template>
  <div class="pools-wrapper">
    <div class="pools-head">
      <Text class="name" :size="'small'">
        {{ t('pool.name') }}
      </Text>
      <!-- <Text class="APR" :size="'small'">
        {{ t('pool.APR') }}
      </Text> -->
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
        <!-- <Text class="APR" :size="isMobile ? 'mini' : 'small'" :color="'secondary-text'"> {{ pair.APR }}% </Text> -->
        <Text class="liquidity" :size="isMobile ? 'mini' : 'small'" :color="'secondary-text'">$ {{ pair.liquidity.toFixed(2) }} </Text>
        <Text class="get" :size="isMobile ? 'mini' : 'small'" :color="'blue'" @click="onGet(pair)">
          {{ t('pool.get', { token: `${pair.token0.symbol}-${pair.token1.symbol}` }) }}
        </Text>
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
import Text from '../../components/Text/Text.vue'
import DoubleLogo from '../../components/DoubleLogo/index.vue'
import { LoadingIcon } from '../../components/Svg'
import useIsMobile from '../../hooks/useIsMobile'
import { Pool, usePoolModalStore } from '../../state'
import { cloneDeep } from 'lodash'

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
  },
  setup(props) {
    const { pairs } = toRefs(props)

    const { t } = useI18n()

    const poolModalStore = usePoolModalStore()
    const isMobile = useIsMobile()

    const sortedPairs = computed(() =>
      cloneDeep(pairs.value ?? []).sort((a, b) => {
        return `${b.token0.symbol}${b.token1.symbol}`.length - `${a.token0.symbol}${a.token1.symbol}`.length
      })
    )

    const onGet = (pool: Pool) => {
      poolModalStore.addLiquidity(pool.pair)
    }

    return {
      t,
      onGet,

      sortedPairs,
      isMobile,
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/index.scss';

.pools-wrapper {
  padding: 0 20px 20px;
  .pools-head {
    display: grid;
    align-items: center;
    grid-template-columns: 170px 260px 170px;
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
      grid-template-columns: 170px 260px 170px;
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
      .get {
        padding-left: 10px;
        cursor: pointer;
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
    width: 351px;
    padding: 0;

    .pools-head {
      grid-template-columns: 108px 143px 100px;
    }
    .pools {
      .pair {
        grid-template-columns: 108px 143px 100px;
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
