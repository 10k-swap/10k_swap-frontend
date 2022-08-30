<template>
  <div class="l0k-swap-page">
    <div class="l0k-swap-page-head">
      <Text class="l0k-swap-page-head-title" bold>
        {{ title }}
      </Text>
      <div class="l0k-swap-page-head-right">
        <slot name="head-right"></slot>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import Text from '../Text/Text.vue'

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  components: {
    Text,
  },
  setup(props, { slots }) {
    const { title } = toRefs(props)

    return {
      title,
      slots,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';

.l0k-swap-page {
  width: 480px;
  margin-right: auto;
  margin-left: auto;
  background: $color-white;
  border-radius: 20px;

  .l0k-swap-page-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 20px;
  }

  @include mobile {
    width: 351px;
  }
}
</style>
