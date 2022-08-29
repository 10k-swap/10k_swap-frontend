<template>
  <Modal v-model="showModal" :top="160">
    <template v-slot:header>
      <ModalHeader @dismiss="() => (showModal = false)" :title="t('swap.confirm_swap')" />
    </template>
    <div class="l0k-swap-confirm-swap-modal">
      <div class="card">
        <Text :size="'large'" bold>
          {{ trade?.inputAmount.toSignificant() }}
        </Text>
        <div class="token">
          <Text bold> {{ trade?.inputAmount.token.symbol }} </Text>
          <TokenLogo :token="trade?.inputAmount.token" />
        </div>
      </div>
      <div class="down">
        <DownIcon :width="'10px'" :color="'minor'" />
      </div>
      <div class="card">
        <Text :size="'large'" bold>
          {{ trade?.outputAmount.toSignificant() }}
        </Text>
        <div class="token">
          <Text bold> {{ trade?.outputAmount.token.symbol }} </Text>
          <TokenLogo :token="trade?.outputAmount.token" />
        </div>
      </div>
      <TradePrice class="trade-price" :price="trade?.executionPrice" />
      <AdvancedSwapDetails :trade="trade" />
      <div class="confirm">
        <Button :type="'primary'" bold @click="onConfirm">
          {{ t('swap.confirm') }}
        </Button>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from '../Modal/Modal.vue'
import ModalHeader from '../Modal/ModalHeader.vue'
import TradePrice from './TradePrice.vue'
import TokenLogo from '../TokenLogo/TokenLogo'
import AdvancedSwapDetails from './AdvancedSwapDetails.vue'
import { DownIcon } from '../Svg/index'
import Text from '../Text/Text.vue'
import Button from '../Button/Button'
import { Trade } from '../../sdk'

export default defineComponent({
  props: {
    show: {
      default: false,
      type: Boolean,
    },
    trade: {
      type: Object as PropType<Trade>,
    },
  },
  components: {
    Modal,
    ModalHeader,
    Text,
    Button,
    TradePrice,
    AdvancedSwapDetails,
    TokenLogo,
    DownIcon,
  },
  emits: ['dismiss', 'swap'],
  setup(props, { emit }) {
    const { show, trade } = toRefs(props)
    const { t } = useI18n()

    const showModal = computed({
      get: () => show.value,
      set(newValue) {
        if (!newValue) {
          emit('dismiss')
        }
      },
    })

    const onConfirm = () => {
      emit('swap')
    }

    return {
      showModal,
      trade,

      t,
      onConfirm,
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/index.scss';

.l0k-swap-confirm-swap-modal {
  .card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    padding: 0 20px;
    background: $color-bg-secondary;
    border-radius: 20px;

    .token {
      display: flex;
      align-items: center;

      img {
        margin-left: 8px;
      }
    }
  }

  .down {
    display: flex;
    justify-content: center;
  }

  .trade-price {
    margin-top: 13px;
  }

  .confirm {
    display: flex;
    justify-content: center;
    margin-top: 20px;

    button {
      width: 140px;
    }
  }
}
</style>
