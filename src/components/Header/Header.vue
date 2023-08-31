<template>
  <div class="l0k-swap-haeder">
    <Logo class="app-logo" />
    <Nav class="l0k-swap-app-header-nav" />
    <Connector class="l0k-swap-app-header-connector" :connectText="isMobile ? t('header.connect') : undefined" v-if="showConnector" />
    <WrongNetworkCard class="wrong-network" v-if="!isSupportChain" />
    <TransactionPendingCard class="transaction-pending" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import Logo from '../Logo/index.vue'
import Connector from '../Connector/Connector.vue'
import { useRoute } from 'vue-router'
import useIsMobile from '../../hooks/useIsMobile'

import Nav from '../../components/Nav/Nav.vue'
import WrongNetworkCard from '../../components/WrongNetworkCard/index.vue'
import TransactionPendingCard from '../../components/TransactionPendingCard/index.vue'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { isSupportedChain } from '../../utils'

export default defineComponent({
  components: {
    Logo,
    Connector,
    Nav,
    WrongNetworkCard,
    TransactionPendingCard,
  },
  setup() {
    const { t } = useI18n()
    const {
      state: { chainId },
    } = useStarknet()

    const route = useRoute()
    const isMobile = useIsMobile()

    const showConnector = computed(() => route.path !== '/wallet')

    return {
      showConnector,
      isMobile,
      isSupportChain: computed(() => isSupportedChain(chainId.value)),

      t,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';
.l0k-swap-haeder {
  display: flex;
  align-items: center;
  position: relative;
  height: 60px;
  padding: 0 20px;
  background-color: rgba(0, 0, 0, 0.15);
  .app-logo {
    flex: 0 0 275px;
  }
  .l0k-swap-app-header-nav {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .l0k-swap-app-header-connector {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    @include mobile {
      right: 44px;
    }
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
      position: relative;
      left: 0;
      transform: translateX(0);
      display: flex;
      justify-content: center;
      grid-column: 1/7;
      grid-row: 2/2;
    }

    .l0k-swap-app-header-connector {
      position: relative;
      right: 0;
      top: 0;
      transform: translateY(0);
      display: flex;
      justify-content: flex-end;
      grid-column: 4/7;
      grid-row: 1/1;
    }
  }
}
</style>
