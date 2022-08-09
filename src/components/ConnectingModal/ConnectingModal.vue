<template>
  <Modal v-model="showModal">
    <template v-slot:header>
      <ModalHeader @dismiss="() => showModal = false" />
    </template>
    <div class="l0k-swap-connecting-modal">
      153253
    </div>
  </Modal>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from '../Modal/Modal.vue'
import ModalHeader from '../Modal/ModalHeader.vue'
import { useModalStore } from '../../state'

export default defineComponent({
  components: {
    Modal,
    ModalHeader,
  },
  setup() {
    const { t } = useI18n()
    const store = useModalStore()

    const showModal = computed({
      get: () => store.showConnectingModal,
      set(newValue) {
        store.toggleConnectingModal(newValue)
      }
    })


    return {
      showModal,

      t,
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';

.l0k-swap-account-modal-card {
  padding: 16px;
  border-radius: 20px;
  background: $color-bg-secondary;

  .l0k-swap-account-modal-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .l0k-swap-account-modal-card-account {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;

    .account {
      display: flex;
      align-items: center;

      svg {
        margin-right: 8px;
      }
    }

    .copy {
      display: flex;
      align-items: center;
      cursor: pointer;

      svg {
        margin-right: 6px;
      }
    }
  }
}
</style>