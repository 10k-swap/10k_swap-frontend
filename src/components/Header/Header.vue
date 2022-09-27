<template>
  <div class="l0k-swap-app-header">
    <div class="app-logo">
      <img class="logo" src="./logo.png" />
      <img class="alpha" src="./alpha.png" />
    </div>
    <Nav class="l0k-swap-app-header-nav" />
    <Connector class="l0k-swap-app-header-connector" />
    <WrongNetworkCard class="wrong-network" v-if="!isSupportChain" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import Nav from '../Nav/Nav.vue'
import Connector from './Connector.vue'
import WrongNetworkCard from '../WrongNetworkCard/index.vue'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { isSupportedChain } from '../../utils'

export default defineComponent({
  components: {
    Nav,
    Connector,
    WrongNetworkCard,
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

.l0k-swap-app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  height: 72px;
  padding: 0 20px;

  .app-logo {
    flex: 1;

    .logo {
      display: inline-block;
      width: 105px;
      height: 40px;
    }
    .alpha {
      display: inline-block;
      width: 45px;
      height: 16px;
      margin-left: 6px;
    }
  }

  .l0k-swap-app-header-nav {
    flex: 1;
  }

  .l0k-swap-app-header-connector {
    display: flex;
    justify-content: flex-end;
    flex: 1;
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
