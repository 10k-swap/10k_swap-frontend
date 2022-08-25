<template>
  <Modal v-model="showModal">
    <template v-slot:header>
      <ModalHeader :title="t('slippage_tolerance_settings_modal.title')" @dismiss="() => (showModal = false)" />
    </template>
    <div class="l0k-swap-slippage-tolerance-settings-modal">
      <div class="l0k-swap-slippage-tolerance-settings-tips">
        <Text :size="'small'"> {{ t('slippage_tolerance_settings_modal.slippage_tolerance') }}: </Text>
        <Text :size="'small'" :color="'secondary-text'">
          {{ t('slippage_tolerance_settings_modal.slippage_tolerance_desc') }}
        </Text>
      </div>
      <div class="l0k-swap-slippage-tolerance-settings-set">
        <Button class="btn" @click="onAuto">
          {{ t('slippage_tolerance_settings_modal.auto') }}
        </Button>
        <div class="input-wrap">
          <input class="input" type="text" v-model="typedValue" :placeholder="placeholder" />
        </div>
      </div>
      <div class="l0k-swap-slippage-tolerance-settings-confirm">
        <Button @click="onConfirm" :type="'primary'" bold :disabled="isDisabled">
          {{ t('slippage_tolerance_settings_modal.confirm') }}
        </Button>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from '../Modal/Modal.vue'
import ModalHeader from '../Modal/ModalHeader.vue'
import Text from '../Text/Text.vue'
import Button from '../Button/Button'
import { INITIAL_ALLOWED_SLIPPAGE } from '../../constants/index'
import { useModalStore, useSlippageToleranceSettingsStore, RISKY_SLIPPAGE_LOW, MAX_SLIPPAGE } from '../../state'

export default defineComponent({
  components: {
    Modal,
    ModalHeader,
    Text,
    Button,
  },
  setup() {
    const { t } = useI18n()
    const modalStore = useModalStore()
    const slippageToleranceSettingsStore = useSlippageToleranceSettingsStore()

    const currentSet = computed(() => slippageToleranceSettingsStore.currentSet)
    const slippageTolerances = computed(() => slippageToleranceSettingsStore.slippageTolerances)

    const typedValue = ref<number | string>('')
    const parsedTypedValue = computed(() => {
      const typed = typedValue.value
      return Math.trunc((typeof typed === 'string' ? parseFloat(typed) : typed) * 100)
    })

    const placeholder = computed(() => {
      if (!currentSet.value) {
        return ''
      }
      return (slippageTolerances.value[currentSet.value] / 100).toString()
    })

    const showModal = computed({
      get: () => modalStore.showSlippageToleranceSettingsModal,
      set(newValue) {
        if (!newValue) {
          typedValue.value = ''
        }
        modalStore.toggleSlippageToleranceSettingsModal(newValue)
      },
    })

    const isDisabled = computed(() => {
      const value = parsedTypedValue.value
      if (Number.isNaN(value)) {
        return true
      }
      if (value > MAX_SLIPPAGE || value < RISKY_SLIPPAGE_LOW) {
        return true
      }
      return false
    })

    const onAuto = () => {
      typedValue.value = INITIAL_ALLOWED_SLIPPAGE / 100
    }
    const onConfirm = () => {
      slippageToleranceSettingsStore.updateSlippageTolerance(parsedTypedValue.value)
      showModal.value = false
    }

    return {
      showModal,
      typedValue,
      isDisabled,
      placeholder,

      t,
      onAuto,
      onConfirm,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';

.l0k-swap-slippage-tolerance-settings-modal {
  display: flex;
  align-items: center;
  flex-direction: column;

  .l0k-swap-slippage-tolerance-settings-tips {
    div {
      display: inline;
    }
  }

  .l0k-swap-slippage-tolerance-settings-set {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 20px;

    .btn {
      width: 170px;
      margin-right: 10px;
    }

    .input-wrap {
      position: relative;
      width: 248px;
      height: 40px;
      background: $color-bg-secondary;
      border-radius: 20px;
      overflow: hidden;
      padding-right: 30px;

      &::after {
        content: '%';
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        font-size: $font-size-sm;
      }

      .input {
        width: 100%;
        background: $color-bg-secondary;
        font-size: $font-size-sm;
        height: 40px;
        border: 0;
        padding: 10px 0 10px 16px;
        box-sizing: border-box;
        text-align: right;
        outline: none;

        &:focus {
          border: 0;
        }
      }
    }

    @include mobile {
      .btn {
        width: 50%;
      }

      .input-wrap {
        width: 50%;
      }
    }
  }

  .l0k-swap-slippage-tolerance-settings-confirm {
    margin-top: 20px;

    button {
      width: 160px;
    }
  }
}
</style>
