<template>
  <div class="l0k-swap-placards">
    <template v-for="(placard, i) in placards" :key="i">
      <Item :placard="placard" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { placards } from './data'
import Item from './item.vue'

export default defineComponent({
  components: {
    Item,
  },
  setup() {
    return {
      placards,
    }
  },
})
</script>

<style lang="scss" scoped>
.l0k-swap-placards {
  width: 100vw;
  overflow: hidden;
}
</style>
