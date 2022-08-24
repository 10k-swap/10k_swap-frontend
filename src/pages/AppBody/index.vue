<template>
  <div class="l0k-swap-app-body">
    <Header />
    <slot></slot>
  </div>
  <Modals />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Header from '../../components/Header/Header.vue'
import Modals from '../../components/Modals/Modals.vue'

export default defineComponent({
  components: {
    Header,
    Modals,
  },
})
</script>

<style lang="scss">
@import '../../styles/index.scss';

.l0k-swap-app-body {
  height: 100vh;
  width: 100vw;
  @include bg-prefix('./bg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
}
</style>
