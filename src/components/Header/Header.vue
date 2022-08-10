<template>
  <div class="l0k-swap-app-header">
    <img class="app-logo" src="./logo.png">
    <Nav class="l0k-swap-app-header-nav" />
    <Connector class="l0k-swap-app-header-connector" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Nav from '../Nav/Nav.vue'
import Connector from './Connector.vue'

export default defineComponent({
  components: {
    Nav,
    Connector
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';

.l0k-swap-app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 0 20px;

  .app-logo {
    width: 105px;
    height: 40px;
  }

  @include mobile {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    height: 120px;
    padding: 0 12px;

    .app-logo {
      grid-column: 1/3;
      grid-row: 1/1;
    }

    .l0k-swap-app-header-nav {
      display: flex;
      justify-content: center;
      grid-column: 1/6;
      grid-row: 2/2;
    }

    .l0k-swap-app-header-connector {
      display: flex;
      justify-content: flex-end;
      grid-column: 3/6;
      grid-row: 1/1;
    }
  }
}
</style>