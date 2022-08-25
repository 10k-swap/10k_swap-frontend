<template>
  <div class="double-logo" :class="{ coverage: coverage }" :style="{ height: size + 'px' }">
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
    coverage: {
      type: Boolean,
      default: false,
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
  &.coverage {
    position: relative;
    width: 32px;
    img {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      &:first-child {
        margin-right: 0;
      }
      &:last-child {
        transform: translateY(-50%) translateX(12px);
        z-index: 1;
      }
    }
  }
}
</style>
