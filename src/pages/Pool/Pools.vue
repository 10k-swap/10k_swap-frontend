<template>
  <div class="pools-wrapper">
    <div class="pools-head">
      <Text class="name" :size="'small'">
        {{ t('pool.name') }}
      </Text>
      <Text class="APR" :size="'small'">
        {{ t('pool.APR') }}
      </Text>
      <Text class="liquidit" :size="'small'">
        {{ t('pool.liquidit') }}
      </Text>
    </div>
    <div class="pools">
      <div class="pair" v-for="pair in pairs" :key="pair.pairAddress">
        <div class="tokens">
          <DoubleLogo :token0="pair.token0" :token1="pair.token1" :size="20" :coverage="isMobile" />
          <Text class="symbol" :size="isMobile ? 'mini' : 'small'" :color="'secondary-text'">
            {{ pair.token0.symbol }} - {{ pair.token1.symbol }}
          </Text>
        </div>
        <Text class="APR" :size="isMobile ? 'mini' : 'small'" :color="'secondary-text'"> {{ pair.APR }}% </Text>
        <Text class="liquidit" :size="isMobile ? 'mini' : 'small'" :color="'secondary-text'"> ${{ pair.totalSupply.toSignificant() }} </Text>
        <Text class="get" :size="isMobile ? 'mini' : 'small'" :color="'blue'" @click="onGet(pair)">
          {{ t('pool.get', { token: `${pair.token0.symbol}-${pair.token1.symbol}` }) }}
        </Text>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import Text from '../../components/Text/Text.vue'
import DoubleLogo from '../../components/DoubleLogo/index.vue'
import { useAllPairs, useIsLoadingAllPairs } from '../../state/pool/hooks'
import useIsMobile from '../../hooks/useIsMobile'
import { usePoolModalStore } from '../../state'

export default defineComponent({
  components: {
    Text,
    DoubleLogo,
  },
  setup() {
    const { t } = useI18n()

    const poolModalStore = usePoolModalStore()
    const pairs = useAllPairs()
    const loading = useIsLoadingAllPairs()
    const isMobile = useIsMobile()

    const onGet = (pool: any) => {
      poolModalStore.addLiqiudit(pool.pair)
    }

    return {
      t,
      onGet,

      pairs,
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
    .liquidit {
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
      .liquidit {
        display: flex;
        justify-content: center;
      }
      .get {
        padding-left: 10px;
        cursor: pointer;
      }
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
        .liquidit {
          @include no-wrap;
        }
      }
    }
  }
}
</style>
