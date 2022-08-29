<template>
  <div class="l0k-swap-app-body" :class="{ root: isRoot }">
    <Header />
    <slot></slot>
  </div>
  <Modals />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import Header from '../../components/Header/Header.vue'
import Modals from '../../components/Modals/Modals.vue'

export default defineComponent({
  components: {
    Header,
    Modals,
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
  height: 100vh;
  width: 100vw;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  @include bg-prefix('./bg2');
  overflow: hidden;
  &.root {
    @include bg-prefix('./bg');
  }
}
</style>
