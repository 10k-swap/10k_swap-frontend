<template>
  <div class="l0k-swap-app-body">
    <Placard />
    <MHeader />
    <Popups />
    <slot></slot>
    <WalletCard />
    <div class="socials" v-if="showSocials"><Socials /></div>
    <div class="l0k-swap-app-body-bg" :class="{ swap: isSwap, pool: isPool }"></div>
  </div>
  <Modals />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import Header from '../../components/Header/Header.vue'
import Modals from '../../components/Modals/Modals.vue'
import Socials from '../../components/Socials/index.vue'
import Placard from '../../components/Placard/index.vue'
import Popups from '../../components/Popups/index.vue'
import WalletCard from '../../components/WalletCard/index.vue'

export default defineComponent({
  components: {
    MHeader: Header,
    Modals,
    Socials,
    Placard,
    Popups,
    WalletCard,
  },
  setup() {
    const route = useRoute()

    const isSwap = computed(() => route.path === '/swap')
    const isPool = computed(() => route.path === '/pool')
    const isWallet = computed(() => route.path === '/wallet')

    const showSocials = computed(() => ['/swap', '/pool'].includes(route.path))

    return {
      isSwap,
      isPool,
      isWallet,

      showSocials,
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/index.scss';

.l0k-swap-app-body {
  position: relative;
  height: 100vh;
  width: 100vw;
  min-width: 375px;
  overflow-y: auto;
  overflow-x: hidden;

  .l0k-swap-app-body-bg {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: -1;
    height: 100vh;
    width: 100vw;
    background-repeat: no-repeat;
    background-size: 100% 100vh;
    background-image: url('./bg0.png');
    &.swap {
      @include bg-prefix('./bg');
    }
    &.pool {
      @include bg-prefix('./bg2');
    }
    @media screen and (min-width: $mobile-size) and (max-width: 1400px) {
      background-size: 1400px 100%;
      background-position: center;
    }
  }
  .socials {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 80px;
  }
}
</style>
