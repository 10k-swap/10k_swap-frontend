<template>
  <vue-final-modal
    v-model="showModal"
    classes="l0k-swap-modal-container"
    overlay-class="l0k-swap-modal-overlay"
    content-class="l0k-swap-modal-content"
  >
    <slot name="header" v-if="slots.header"></slot>
    <ModalHeader v-else :title="title" />
    <div class="l0k-swap-modal-wrap">
      <slot />
    </div>
  </vue-final-modal>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue'
import ModalHeader from './ModalHeader.vue'

export default defineComponent({
  components: {
    ModalHeader,
  },
  props: {
    title: {
      type: String,
    },
    modelValue: {
      type: Boolean,
      require: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    const { modelValue, title } = toRefs(props)

    const showModal = computed({
      get: () => modelValue.value,
      set(newValue) {
        context.emit('update:modelValue', newValue)
      },
    })

    return {
      showModal,
      title,
      slots: context.slots,
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/index.scss';

.l0k-swap-modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.l0k-swap-modal-overlay {
  background-color: $color-overlay !important;
}

.l0k-swap-modal-content {
  width: 480px;
  background: $color-white;
  border-radius: 20px;
  overflow-y: scroll;
  @include no-scrollbar;
  max-height: 90vh;

  @include mobile {
    width: 335px;
  }

  .l0k-swap-modal-wrap {
    padding: 0 20px 20px 20px;
  }
}
</style>
