<template>
  <div class="double-logo">
    <TokenLogo :token="token0" :size="size" />
    <TokenLogo :token="token1" :size="size" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Token } from '../../sdk'
import TokenLogo from '../TokenLogo/TokenLogo'

export default defineComponent({
  props: {
    token0: {
      type: Object as PropType<Token>,
    },
    token1: {
      type: Object as PropType<Token>,
    },
    size: {
      type: Number,
      default: 24,
    },
  },
  components: {
    TokenLogo,
  },
})
</script>

<style lang="scss">
.double-logo {
  img {
    &:first-child {
      margin-right: 4px;
    }
  }
}
</style>
