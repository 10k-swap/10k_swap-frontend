<template>
  <div class="l0k-swap-app-body" :class="{ root: isRoot }">
    <Header />
    <slot></slot>
    <div class="socials"><Socials /></div>
  </div>
  <Modals />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import Header from '../../components/Header/Header.vue'
import Modals from '../../components/Modals/Modals.vue'
import Socials from '../../components/Socials/index.vue'

export default defineComponent({
  components: {
    Header,
    Modals,
    Socials,
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
  min-height: 700px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  @include bg-prefix('./bg2');
  overflow: hidden;
  &.root {
    @include bg-prefix('./bg');
  }
  @media screen and (min-width: $mobile-size) and (max-width: 1400px) {
    background-size: 1400px 100%;
    background-position: center;
  }
  .socials {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 80px;
  }
}
</style>
