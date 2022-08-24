<template>
  <Modal v-model="showModal">
    <template v-slot:header>
      <ModalHeader @dismiss="() => (showModal = false)" />
    </template>
    <div class="l0k-swap-connector-not-found-modal">
      <Text class="title" bold :size="'md'">
        {{ t('connector_not_found_modal.title') }}
      </Text>
      <div class="card">
        <Text :size="'small'" :color="'secondary-text'">
          <span v-html="t('connector_not_found_modal.tips')"></span>
        </Text>
        <img class="img" src="./ArgentX.png" />
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from '../Modal/Modal.vue'
import ModalHeader from '../Modal/ModalHeader.vue'
import Text from '../Text/Text.vue'
import { useModalStore } from '../../state'

export default defineComponent({
  components: {
    Modal,
    ModalHeader,
    Text,
  },
  setup() {
    const { t } = useI18n()
    const store = useModalStore()

    const showModal = computed({
      get: () => store.showConnectorNotFoundModal,
      set(newValue) {
        store.toggleConnectorNotFoundModal(newValue)
      },
    })

    return {
      showModal,

      t,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';

.l0k-swap-connector-not-found-modal {
  display: flex;
  align-items: center;
  flex-direction: column;

  .title {
    transform: translateY(-10px);
  }

  .card {
    padding: 16px;
    margin-top: 10px;
    border-radius: 20px;
    background: $color-bg-secondary;

    .img {
      display: block;
      width: 220px;
      height: 58px;
      margin: 0 auto;
      margin-top: 12px;
      cursor: pointer;
    }
  }
}
</style>
