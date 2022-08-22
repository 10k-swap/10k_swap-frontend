<template>
  <div class="double-logo">
    <TokenLogo :token="token0" />
    <TokenLogo :token="token1" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Token } from '../../sdk';
import TokenLogo from '../TokenLogo/TokenLogo'

export default defineComponent({
  props: {
    token0: {
      type: Object as PropType<Token>
    },
    token1: {
      type: Object as PropType<Token>
    }
  },
  components: {
    TokenLogo
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