<template>
  <Modal v-model="showModal">
    <template v-slot:header>
      <ModalHeader @dismiss="() => (showModal = false)" />
    </template>
    <div class="l0k-swap-connect-reject-modal">
      <Text class="title" bold :size="'md'" :color="'red'">
        {{ t('connect_reject_modal.title') }}
      </Text>
      <div class="card">
        <Text :size="'small'" :color="'secondary-text'">
          {{ t('connect_reject_modal.tips') }}
        </Text>
        <Button class="retry" :type="'primary'" bold @click="onRetry">
          {{ t('connect_reject_modal.retry') }}
        </Button>
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
import Button from '../Button/Button'
import useConnector from '../../hooks/useConnector'
import { useModalStore } from '../../state'

export default defineComponent({
  components: {
    Modal,
    ModalHeader,
    Text,
    Button,
  },
  setup() {
    const { t } = useI18n()
    const store = useModalStore()

    const showModal = computed({
      get: () => store.showConnectRejectModal,
      set(newValue) {
        store.toggleConnectRejectModal(newValue)
      },
    })

    const { onConnect } = useConnector()

    const onRetry = () => {
      showModal.value = false
      onConnect(true)
    }

    return {
      showModal,

      t,
      onRetry,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';

.l0k-swap-connect-reject-modal {
  display: flex;
  align-items: center;
  flex-direction: column;

  .title {
    transform: translateY(-10px);
  }

  .card {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 16px;
    margin-top: 10px;
    border-radius: 20px;
    background: $color-bg-secondary;

    .retry {
      margin: 20px auto 0 auto;
    }
  }
}
</style>
