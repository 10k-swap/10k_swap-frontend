<template>
  <div class="my-pools-wrapper">
    <div class="my-pools-head">
      <Text class="name" :size="'small'">
        {{ t('pool.name') }}
      </Text>
      <Text class="APR" :size="'small'">
        {{ t('pool.APR') }}
      </Text>
      <Text class="liquidit" :size="'small'">
        {{ t('pool.liquidit') }}
      </Text>
      <Text class="pool-share" :size="'small'">
        {{ t('pool.pool_share') }}
      </Text>
    </div>
    <div class="my-pools">
      <div class="pair" v-for="item in userPairs" :key="item.pair.liquidityToken.address">
        <div class="tokens">
          <DoubleLogo :token0="item.pair.token0" :token1="item.pair.token1" :size="20" :coverage="isMobile" />
          <Text class="symbol" :size="isMobile ? 'mini' : 'small'" :color="'secondary-text'">
            {{ item.pair.token0.symbol }} - {{ item.pair.token1.symbol }}
          </Text>
        </div>
        <Text class="APR" :size="isMobile ? 'mini' : 'small'" :color="'secondary-text'"> {{ item.APR }}% </Text>
        <Text class="liquidit" :size="isMobile ? 'mini' : 'small'" :color="'secondary-text'"> ${{ item.totalSupply.toSignificant() }} </Text>
        <div class="pool-share">
          <Text class="symbol" :size="isMobile ? 'mini' : 'small'" :color="'secondary-text'">
            $ {{ item.balance.toSignificant() }} ({{ item.poolShareView }}%)
          </Text>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import Text from '../../components/Text/Text.vue'
import useIsMobile from '../../hooks/useIsMobile'
import DoubleLogo from '../../components/DoubleLogo/index.vue'
import { useUserPairs } from '../../state/pool/hooks'

export default defineComponent({
  components: {
    Text,
    DoubleLogo,
  },
  setup() {
    const { t } = useI18n()

    const isMobile = useIsMobile()
    const userPairs = useUserPairs()

    return {
      userPairs,
      isMobile,

      t,
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/index.scss';

.my-pools-wrapper {
  padding: 0 20px 20px;

  .my-pools-head {
    display: grid;
    align-items: center;
    grid-template-columns: 155px 90px 155px 200px;
    background: $color-bg-secondary;
    height: 32px;

    .name,
    .APR,
    .liquidit {
      display: flex;
      justify-content: center;
    }
  }
  .my-pools {
    margin-top: 10px;
    .pair {
      display: grid;
      align-items: center;
      grid-template-columns: 155px 90px 155px 200px;
      padding: 10px 0;
      .tokens {
        display: flex;
        align-items: center;
        flex-direction: column;
        .symbol {
          margin-left: 8px;
        }
      }
      .APR,
      .liquidit {
        display: flex;
        justify-content: center;
      }
      .APR,
      .liquidit {
        display: flex;
        justify-content: center;
      }
    }
  }

  @include mobile {
    width: 351px;
    padding: 0;

    .my-pools-head {
      grid-template-columns: 76px 44px 103px 128px;
    }

    .my-pools {
      .pair {
        grid-template-columns: 76px 44px 103px 128px;
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
