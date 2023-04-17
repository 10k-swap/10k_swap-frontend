<template>
  <div class="l0k-swap-app-swap-header">
    <Nav class="l0k-swap-app-header-nav" />
    <Connector class="l0k-swap-app-header-connector" v-if="!isMobile" />
    <WrongNetworkCard class="wrong-network" v-if="!isSupportChain" />
    <TransactionPendingCard class="transaction-pending" />
  </div>
  <router-view />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { isSupportedChain } from '../../utils'

import Nav from '../../components/Nav/Nav.vue'
import Connector from '../../components/Connector/Connector.vue'
import WrongNetworkCard from '../../components/WrongNetworkCard/index.vue'
import TransactionPendingCard from '../../components/TransactionPendingCard/index.vue'
import useIsMobile from '../../hooks/useIsMobile'

export default defineComponent({
  components: {
    Nav,
    Connector,
    WrongNetworkCard,
    TransactionPendingCard,
  },
  setup() {
    const {
      state: { chainId },
    } = useStarknet()

    const isMobile = useIsMobile()

    return {
      isSupportChain: computed(() => isSupportedChain(chainId.value)),

      isMobile,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';

.l0k-swap-app-swap-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 72px;
  padding: 0 20px;

  .l0k-swap-app-header-nav {
    flex: 1;
  }

  .l0k-swap-app-header-connector {
    position: absolute;
    right: 20px;
  }

  .wrong-network {
    position: absolute;
    right: 20px;
    bottom: 0px;
    transform: translateY(100%);
  }

  @include mobile {
    padding: 0 12px;

    .l0k-swap-app-header-nav {
      display: flex;
    }
  }
}
</style>
