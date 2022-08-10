<template>
  <div class="l0k-swap-modal-header">
    <slot name="left"></slot>
    <div class="l0k-swap-modal-header-title" v-if="!slots.default">
      <Text bold>
        {{ title }}
      </Text>
    </div>
    <template v-else>
      <slot></slot>
    </template>
    <slot name="right" v-if="slots.right"></slot>
    <ColseIcon class="l0k-swap-modal-header-close" v-else @click="onClose" />
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import { ColseIcon } from '../Svg'
import Text from '../Text/Text.vue'

export default defineComponent({
  props: {
    title: String
  },
  components: {
    ColseIcon,
    Text
  },
  emits: ['dismiss'],
  setup(props, { slots, emit }) {
    const { title } = toRefs(props)

    const onClose = () => {
      emit('dismiss')
    }

    return {
      slots,
      title,

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