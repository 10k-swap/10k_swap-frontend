<template>
  <Modal v-model="showModal">
    <template v-slot:header>
      <ModalHeader :title="t('slippage_tolerance_settings_modal.title')" @dismiss="() => showModal = false" />
    </template>
    <div class="l0k-swap-slippage-tolerance-settings-modal">
      <div class="l0k-swap-slippage-tolerance-settings-tips">
        <Text :size="'small'">
          {{ t('slippage_tolerance_settings_modal.slippage_tolerance') }}：
        </Text>
        <Text :size="'small'" :color="'secondary-text'"> {{
            t('slippage_tolerance_settings_modal.slippage_tolerance_desc')
        }}</Text>
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
import { useModalStore } from '../../state'

export default defineComponent({
  components: {
    Modal,
    ModalHeader,
    Text,
    Button
  },
  setup() {
    const { t } = useI18n()
    const store = useModalStore()

    const showModal = computed({
      get: () => store.showSlippageToleranceSettingsModal,
      set(newValue) {
        store.toggleSlippageToleranceSettingsModal(newValue)
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

.l0k-swap-slippage-tolerance-settings-modal {
  display: flex;
  align-items: center;
  flex-direction: column;

  .l0k-swap-slippage-tolerance-settings-tips {
    div{
      display: inline;
    }
  }
}
</style>