<template>
  <div class="l0k-swap-stake-wrapper">
    <div class="head">
      <Text bold>
        {{ t('stake.title') }}
      </Text>
    </div>
    <div class="stake-head">
      <Text class="name" :size="'small'">
        {{ t('stake.name') }}
      </Text>
      <Text class="total-staked" :size="'small'">
        {{ t('stake.total_staked') }}
      </Text>
      <div class="APR">
        <Text :size="'small'">
          {{ t('stake.APY') }}
        </Text>
        <Text :size="'mini'" :color="'description-text'">
          {{ t('stake.fees_stake') }}
        </Text>
      </div>
      <Text class="staked" :size="'small'">
        {{ t('stake.staked') }}
      </Text>
      <div class="unclaimed-reward">
        <Text :size="'small'">
          {{ t('stake.unclaimed') }}
        </Text>
        <Text :size="'small'">
          {{ t('stake.reward') }}
        </Text>
      </div>
      <div class="pool-share">
        <Text :size="'small'">
          {{ t('stake.pool') }}
        </Text>
        <Text :size="'small'">
          {{ t('stake.share') }}
        </Text>
      </div>
      <Text class="oparation" :size="'small'">
        {{ t('stake.oparation') }}
      </Text>
    </div>
    <template v-for="pool in pools" :key="pool.poolId">
      <Item :pool="pool" />
    </template>
  </div>
  <AddModal />
  <RemoveModal />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import Text from '../../../components/Text/Text.vue'
import Item from './Item.vue'
import useIsMobile from '../../../hooks/useIsMobile'
import { useStarknet } from '../../../starknet-vue/providers/starknet'
import AddModal from './AddModal.vue'
import RemoveModal from './RemoveModal.vue'
import { STAKE_POOLS } from '../../../constants/stake'

export default defineComponent({
  components: {
    Text,
    Item,
    AddModal,
    RemoveModal,
  },
  setup() {
    const { t } = useI18n()
    const {
      state: { chainId },
    } = useStarknet()
    const isMobile = useIsMobile()

    const pools = computed(() => {
      return (chainId.value && STAKE_POOLS[chainId.value]) ?? []
    })

    return {
      pools,

      isMobile,

      t,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../../styles/index.scss';

.l0k-swap-stake-wrapper {
  width: 944px;
  margin: 28px auto 0 auto;
  background: $color-white;
  border-radius: 20px;
  overflow: hidden;
  padding: 20px;

  @include mobile {
    width: 351px;
    margin-top: 5px;
  }

  .head {
    display: flex;
    align-items: center;
    height: 60px;
    padding: 0 20px;
  }

  .stake-head {
    display: flex;
    align-items: center;
    background: $color-bg-secondary;
    height: 48px;

    .name,
    .oparation {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 160px;
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
      flex-direction: column;
      align-items: center;
      width: 175px;
    }

    .pool-share {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 80px;
    }
  }
}
</style>
