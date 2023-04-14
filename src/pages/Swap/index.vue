<template>
  <div class="l0k-swap-app-swap-header">
    <Logo class="app-logo" v-if="isMobile" />
    <Nav class="l0k-swap-app-header-nav" />
    <Connector class="l0k-swap-app-header-connector" />
    <WrongNetworkCard class="wrong-network" v-if="!isSupportChain" />
    <TransactionPendingCard class="transaction-pending" />
  </div>
  <router-view />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import useIsMobile from '../../hooks/useIsMobile'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { isSupportedChain } from '../../utils'

import Nav from '../../components/Nav/Nav.vue'
import Logo from '../../components/Logo/index.vue'
import Connector from '../../components/Connector/Connector.vue'
import WrongNetworkCard from '../../components/WrongNetworkCard/index.vue'
import TransactionPendingCard from '../../components/TransactionPendingCard/index.vue'

export default defineComponent({
  components: {
    Nav,
    Connector,
    WrongNetworkCard,
    TransactionPendingCard,
    Logo,
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

  .app-logo {
    flex: 1;
  }

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
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    height: 120px;
    padding: 0 12px;

    .app-logo {
      grid-column: 1/4;
      grid-row: 1/1;
    }

    .l0k-swap-app-header-nav {
      display: flex;
      justify-content: center;
      grid-column: 1/7;
      grid-row: 2/2;
    }

    .l0k-swap-app-header-connector {
      display: flex;
      justify-content: flex-end;
      grid-column: 4/7;
      grid-row: 1/1;
    }
  }
}
</style>
