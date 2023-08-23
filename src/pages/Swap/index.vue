<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  setup() {},
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
