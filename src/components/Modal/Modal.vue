<template>
  <vue-final-modal v-model="showModal" classes="modal-container" content-class="modal-content">
    <span># Simple modal</span>
    <p>
      Lorem Ipsum is simply dummy text of the printing and typesetting
      industry.
    </p>
    <button class="modal-close" @click="showModal = false">
      x
    </button>
  </vue-final-modal>
</template>

<script>
import { defineComponent, ref } from '@vue/runtime-core'

export default defineComponent({
  setup() {
    const showModal = ref(true)

    return {
      showModal
    }
  }
})
</script>

<style>
</style>