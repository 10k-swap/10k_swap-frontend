<template>
  <div class="l0k-swap-pool-wrapper">
    <template v-if="!isSupportChain">
      <Text class="wrong-network" bold> Wrong Network </Text>
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
      <Pools v-if="currentNav === 'pools'" :pairs="pairs" :loading="loadingPairs" />
      <MyPools v-else :userPairs="userPairs" :loading="loadingUserPairs" />
    </template>
  </div>
  <PoolModal />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '../../components/Button/Button'
import Text from '../../components/Text/Text.vue'
import PoolModal from '../../components/PoolModal/PoolModal.vue'
import MyPools from './MyPools.vue'
import Pools from './Pools.vue'
import { useUserPairs, useAllPairs } from '../../state/pool/hooks'
import { usePoolModalStore } from '../../state'
import useIsMobile from '../../hooks/useIsMobile'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { isSupportedChain } from '../../utils'

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
      state: { chainId },
    } = useStarknet()
    const isMobile = useIsMobile()
    const poolModalStore = usePoolModalStore()

    const [pairs, loadingPairs] = useAllPairs()
    const [userPairs, loadingUserPairs] = useUserPairs(pairs)

    const currentNav = ref<'pools' | 'my-pools'>('pools')

    const isSupportChain = computed(() => isSupportedChain(chainId.value))

    const onNewPosition = () => {
      poolModalStore.newPosition()
    }

    return {
      isMobile,
      isSupportChain,
      currentNav,
      pairs,
      userPairs,
      loadingUserPairs,
      loadingPairs,

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

  .wrong-network,
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
