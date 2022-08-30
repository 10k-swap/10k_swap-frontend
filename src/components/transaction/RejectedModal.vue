<template>
  <Modal v-model="showModal">
    <template v-slot:header>
      <ModalHeader @dismiss="() => (showModal = false)" />
    </template>
    <div class="l0k-swap-transaction-rejected-modal">
      <ErrorIcon width="64px" :color="'red'" />
      <Text class="label" bold :color="'red'">
        {{ t('transaction.transaction_rejected') }}
      </Text>
      <Button class="dismiss" @click="showModal = false" plain bold>
        {{ t('transaction.dismiss') }}
      </Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from '../Modal/Modal.vue'
import ModalHeader from '../Modal/ModalHeader.vue'
import { ErrorIcon } from '../Svg/index'
import Text from '../Text/Text.vue'
import Button from '../Button/Button'

export default defineComponent({
  props: {
    show: {
      default: false,
      type: Boolean,
    },
  },
  components: {
    Modal,
    ModalHeader,
    Text,
    ErrorIcon,
    Button,
  },
  emits: ['dismiss'],
  setup(props, { emit }) {
    const { show } = toRefs(props)
    const { t } = useI18n()

    const showModal = computed({
      get: () => show.value,
      set(newValue) {
        if (!newValue) {
          emit('dismiss')
        }
      },
    })

    return {
      showModal,

      t,
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/index.scss';

.l0k-swap-transaction-rejected-modal {
  display: flex;
  flex-direction: column;
  align-items: center;

  .label {
    margin-top: 16px;
    margin-bottom: 18px;
  }

  .dismiss {
    width: 140px;
  }
}
</style>
