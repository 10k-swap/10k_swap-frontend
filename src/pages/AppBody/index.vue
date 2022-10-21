<template>
  <div class="l0k-swap-app-body">
    <Placard />
    <MHeader />
    <Popups />
    <slot></slot>
    <div class="socials"><Socials /></div>
    <div class="l0k-swap-app-body-bg" :class="{ root: isRoot }"></div>
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

export default defineComponent({
  components: {
    MHeader: Header,
    Modals,
    Socials,
    Placard,
    Popups,
  },
  setup() {
    const route = useRoute()

    const isRoot = computed(() => route.path === '/')

    return {
      isRoot,
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
    @include bg-prefix('./bg2');
    &.root {
      @include bg-prefix('./bg');
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
