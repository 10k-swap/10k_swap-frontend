<template>
  <div class="my-pools-wrapper">
    <div class="tips-wrap" v-if="!account || !userPairs.length">
      <Text class="tips" v-if="!account" :color="'description-text'">
        {{ t('pool.tips') }}
      </Text>
      <template v-else>
        <Text class="tips" :color="'description-text'">
          {{ t('pool.tips2') }}
        </Text>
        <Button class="deposit" plain bold @click="onDeposit"> {{ t('pool.deposit') }}</Button>
      </template>
    </div>
    <template v-else>
      <div class="my-pools-head">
        <Text class="name" :size="'small'">
          {{ t('pool.name') }}
        </Text>
        <Text class="APR" :size="'small'">
          {{ t('pool.APR') }}
        </Text>
        <Text class="liquidity" :size="'small'">
          {{ t('pool.liquidity') }}
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
          <Text class="liquidity" :size="isMobile ? 'mini' : 'small'" :color="'secondary-text'"> ${{ item.totalSupply.toSignificant() }} </Text>
          <div class="pool-share">
            <Text :size="isMobile ? 'mini' : 'small'" :color="'secondary-text'">
              $ {{ item.balance.toSignificant() }} ({{ item.poolShareView }}%)
            </Text>
            <Button :size="'small'" class="withdraw" @click="onWithdraw(item)">{{ t('pool.withdraw') }} </Button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import Text from '../../components/Text/Text.vue'
import Button from '../../components/Button/Button'
import useIsMobile from '../../hooks/useIsMobile'
import DoubleLogo from '../../components/DoubleLogo/index.vue'
import { useUserPairs } from '../../state/pool/hooks'
import { usePoolModalStore } from '../../state'
import { useStarknet } from '../../starknet-vue/providers/starknet'

export default defineComponent({
  components: {
    Text,
    DoubleLogo,
    Button,
  },
  setup() {
    const { t } = useI18n()
    const {
      state: { account },
    } = useStarknet()

    const isMobile = useIsMobile()
    const userPairs = useUserPairs()
    const poolModalStore = usePoolModalStore()

    const onWithdraw = (pair: any) => {
      poolModalStore.withdraw(pair.pair)
    }
    const onDeposit = () => {
      poolModalStore.newPosition()
    }

    return {
      userPairs,
      isMobile,
      account,

      t,
      onWithdraw,
      onDeposit,
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/index.scss';

.my-pools-wrapper {
  padding: 0 20px 20px;
  overflow-x: auto;

  .my-pools-head {
    display: grid;
    align-items: center;
    grid-template-columns: 100px 80px 170px 245px;
    background: $color-bg-secondary;
    height: 32px;

    .name,
    .APR,
    .liquidity {
      display: flex;
      justify-content: center;
    }
  }
  .tips-wrap {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 80px;
    min-height: 200px;
    .deposit {
      margin-top: 35px;
    }
  }
  .my-pools {
    margin-top: 10px;
    .pair {
      display: grid;
      align-items: center;
      grid-template-columns: 100px 80px 170px 245px;
      padding: 10px 0;
      .tokens {
        display: flex;
        align-items: center;
        flex-direction: column;
        .symbol {
          margin-top: 8px;
        }
      }
      .APR,
      .liquidity {
        display: flex;
        justify-content: center;
      }
      .pool-share {
        display: flex;
        flex-direction: column;
        align-items: center;
        .withdraw {
          margin-top: 2px;
          color: $color-blue;
          border: 1px solid $color-blue;
        }
      }
    }
  }

  @include mobile {
    width: 351px;
    padding: 0;

    .my-pools-head {
      width: 463px;
      grid-template-columns: 76px 44px 143px 200px;
    }

    .my-pools {
      .pair {
        grid-template-columns: 76px 44px 143px 200px;
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
