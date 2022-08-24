<template>
  <Modal v-model="showModal">
    <template v-slot:header>
      <ModalHeader @dismiss="() => (showModal = false)" />
    </template>
    <div class="l0k-swap-connecting-modal">
      <div class="content">
        <LoadingIcon width="48" :color="'secondary'" />
        <Text bold>
          {{ t('connecting_modal.connecting') }}
        </Text>
      </div>
      <div class="card">
        <Text :size="'mini'" :color="'description-text'">
          <span v-html="t('connecting_modal.tips')"></span>
        </Text>
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
import { LoadingIcon } from '../Svg'
import { useModalStore } from '../../state'

export default defineComponent({
  components: {
    Modal,
    ModalHeader,
    LoadingIcon,
    Text,
  },
  setup() {
    const { t } = useI18n()
    const store = useModalStore()

    const showModal = computed({
      get: () => store.showConnectingModal,
      set(newValue) {
        store.toggleConnectingModal(newValue)
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

.l0k-swap-connecting-modal {
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: translateY(-6px);

    svg {
      margin-bottom: 10px;
    }
  }

  .card {
    padding: 16px;
    margin-top: 15px;
    border-radius: 20px;
    background: $color-bg-secondary;
  }
}
</style>
