<template>
  <div class="l0k-swap-app-swap-header">
    <Nav class="l0k-swap-app-header-nav" />
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
import WrongNetworkCard from '../../components/WrongNetworkCard/index.vue'
import TransactionPendingCard from '../../components/TransactionPendingCard/index.vue'

export default defineComponent({
  components: {
    Nav,
    WrongNetworkCard,
    TransactionPendingCard,
  },
  setup() {
    const {
      state: { chainId },
    } = useStarknet()

    return {
      isSupportChain: computed(() => isSupportedChain(chainId.value)),
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
