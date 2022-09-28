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
    </div>
    <div class="pools">
      <div class="pair" v-for="pair in sortedPairs" :key="pair.pairAddress">
        <div class="tokens">
          <DoubleLogo :token0="pair.token0" :token1="pair.token1" :size="20" :coverage="isMobile" />
          <Text class="symbol" :size="isMobile ? 'mini' : 'small'" :color="'secondary-text'">
            {{ pair.token0.symbol }} - {{ pair.token1.symbol }}
          </Text>
        </div>
        <Text class="APR" :size="isMobile ? 'mini' : 'small'" :color="'secondary-text'"> {{ pair.APR }}% </Text>
        <Text class="liquidity" :size="isMobile ? 'mini' : 'small'" :color="'secondary-text'"> {{ pair.totalSupply.toSignificant() }} </Text>
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
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import Text from '../../components/Text/Text.vue'
import DoubleLogo from '../../components/DoubleLogo/index.vue'
import { LoadingIcon } from '../../components/Svg'
import { useAllPairs, useIsLoadingAllPairs } from '../../state/pool/hooks'
import useIsMobile from '../../hooks/useIsMobile'
import { usePoolModalStore } from '../../state'
import { cloneDeep } from 'lodash'

export default defineComponent({
  components: {
    Text,
    DoubleLogo,
    LoadingIcon,
  },
  setup() {
    const { t } = useI18n()

    const poolModalStore = usePoolModalStore()
    const pairs = useAllPairs()
    const loading = useIsLoadingAllPairs()
    const isMobile = useIsMobile()

    const sortedPairs = computed(() =>
      cloneDeep(pairs.value).sort((a, b) => {
        return `${b.token0.symbol}${b.token1.symbol}`.length - `${a.token0.symbol}${a.token1.symbol}`.length
      })
    )

    const onGet = (pool: any) => {
      poolModalStore.addLiquidity(pool.pair)
    }

    return {
      t,
      onGet,

      sortedPairs,
      loading,
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
    grid-template-columns: 170px 90px 170px 170px;
    background: $color-bg-secondary;
    height: 32px;

    .name,
    .APR,
    .liquidity {
      display: flex;
      justify-content: center;
    }
  }
  .pools {
    margin-top: 10px;
    .pair {
      display: grid;
      align-items: center;
      grid-template-columns: 170px 90px 170px 170px;
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
      grid-template-columns: 108px 40px 103px 100px;
    }
    .pools {
      .pair {
        grid-template-columns: 108px 40px 103px 100px;
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
