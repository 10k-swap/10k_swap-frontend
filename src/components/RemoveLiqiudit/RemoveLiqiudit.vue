<template>
  <div class="l0k-swap-remove-liqiudit">

  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Pair } from '../../sdk'

export default defineComponent({
  props: {
    pair: Object as PropType<Pair>
  },
  setup() {

  },
})
</script>


<style lang="scss" scoped>
.l0k-swap-remove-liqiudit {}
</style>