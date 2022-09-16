<template>
  <div class="l0k-swap-pool-wrapper">
    <template v-if="isMainnet">
      <Text class="coming-soon" bold>
        {{ t('comingSoon') }}
      </Text>
    </template>
    <template v-else>
      <div class="head">
        <Text bold>
          {{ t('pool.title') }}
        </Text>
        <div class="tabs">
          <Button class="pools" :size="'small'" :type="'secondary'" :disabled="currentNav === 'pools'" @click="currentNav = 'pools'">
            {{ t('pool.pools') }}
          </Button>
          <Button class="my-pools" :size="'small'" :type="'secondary'" :disabled="currentNav === 'my-pools'" @click="currentNav = 'my-pools'">
            {{ t('pool.my_pools') }}
          </Button>
        </div>
        <Button :size="'small'" :type="'primary'" @click="onNewPosition">
          {{ isMobile ? '+' : t('pool.new_position') }}
        </Button>
      </div>
      <Pools v-if="currentNav === 'pools'" />
      <MyPools v-else />
    </template>
  </div>
  <PoolModal />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '../../components/Button/Button'
import Text from '../../components/Text/Text.vue'
import PoolModal from '../../components/PoolModal/PoolModal.vue'
import MyPools from './MyPools.vue'
import Pools from './Pools.vue'
import { usePoolModalStore, usePoolStore } from '../../state'
import useIsMobile from '../../hooks/useIsMobile'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { useAllPairs } from '../../state/pool/hooks'
import { ChainId } from 'l0k_swap-sdk'

export default defineComponent({
  components: {
    Text,
    Button,
    PoolModal,
    Pools,
    MyPools,
  },
  setup() {
    const { t } = useI18n()
    const {
      state: { chainId, account },
    } = useStarknet()
    const isMobile = useIsMobile()
    const poolStore = usePoolStore()
    const poolModalStore = usePoolModalStore()
    const pairs = useAllPairs()

    const currentNav = ref<'pools' | 'my-pools'>('pools')

    const isMainnet = computed(() => ChainId.MAINNET === chainId.value)

    const onNewPosition = () => {
      poolModalStore.newPosition()
    }

    onMounted(() => {
      if (chainId.value) {
        poolStore.getAllPairs(chainId.value)
      }
    })
    watch([chainId], () => {
      if (chainId.value) {
        poolStore.getAllPairs(chainId.value)
      }
    })

    watch([pairs, account, chainId], () => {
      if (pairs.value.length && account.value && chainId.value) {
        poolStore.getUserPairs(chainId.value, account.value)
      }
    })

    return {
      isMobile,
      isMainnet,
      currentNav,

      onNewPosition,
      t,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';

.l0k-swap-pool-wrapper {
  width: 640px;
  margin: 28px auto 0 auto;
  background: $color-white;
  border-radius: 20px;
  overflow: hidden;

  .coming-soon {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
  }

  @include mobile {
    width: 351px;
    margin-top: 5px;
  }

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 20px;

    .tabs {
      button:disabled {
        cursor: default;
      }

      .my-pools {
        margin-left: 8px;
      }
    }
  }
}
</style>
