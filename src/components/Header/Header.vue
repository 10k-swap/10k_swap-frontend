<template>
  <div class="l0k-swap-app-header">
    <img class="app-logo" src="./logo.png">
    <Nav />
    <Connector />
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
  setup() {

  },
})
</script>

<style lang="scss" scoped>
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
}
</style>