<template>
  <vue-final-modal
    v-model="showModal"
    classes="l0k-swap-modal-container"
    overlay-class="l0k-swap-modal-overlay"
    content-class="l0k-swap-modal-content"
    :content-style="{ marginTop: isNumber(top) ? `${top}px` : top }"
  >
    <slot name="header" v-if="slots.header"></slot>
    <ModalHeader v-else :title="title" @dismiss="() => (showModal = false)" />
    <div class="l0k-swap-modal-wrap">
      <slot />
    </div>
  </vue-final-modal>
</template>

<script lang="ts">
import { isNumber } from 'lodash'
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
    top: {
      type: [Number, String],
      default: 200,
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

      isNumber,
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/index.scss';

.l0k-swap-modal-container {
  display: flex;
  justify-content: center;
  overflow-y: auto;
}

.l0k-swap-modal-overlay {
  background-color: $color-overlay !important;
}

.l0k-swap-modal-content {
  width: 480px;
  height: fit-content;
  background: $color-white;
  border-radius: 20px;
  margin-bottom: 50px;
  overflow-y: scroll;
  @include no-scrollbar;

  @include mobile {
    width: 335px;
  }

  .l0k-swap-modal-wrap {
    padding: 0 20px 20px 20px;
  }
}
</style>
