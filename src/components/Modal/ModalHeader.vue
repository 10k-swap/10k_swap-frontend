<template>
  <div class="l0k-swap-modal-header">
    <slot name="left"></slot>
    <div class="l0k-swap-modal-header-title">
      <Text bold>
        <slot></slot>
      </Text>
    </div>
    <slot name="right" v-if="slots.right"></slot>
    <ColseIcon class="l0k-swap-modal-header-close" v-else @click="onClose" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ColseIcon } from '../Svg'
import Text from '../Text/Text.vue'

export default defineComponent({
  components: {
    ColseIcon,
    Text
  },
  emits: ['dismiss'],
  setup(_, { slots, emit }) {

    const onClose = () => {
      emit('dismiss')
    }

    return {
      slots,

      onClose
    }
  },
})
</script>

<style lang="scss" scoped>
.l0k-swap-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;

  .l0k-swap-modal-header-close {
    width: 14px;
    cursor: pointer;
  }
}
</style>