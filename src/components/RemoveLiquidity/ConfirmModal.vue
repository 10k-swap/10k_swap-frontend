<template>
  <Modal v-model="showModal" :top="160" :title="t('remove_liquidity.confirm_title')">
    <div class="l0k-swap-confirm-burn-modal">
      <div class="output">
        <Text bold :size="'large'">
          {{ parsedAmounts?.[Field.CURRENCY_A]?.toSignificant() ?? '-' }}
        </Text>
        <div class="token">
          <TokenLogo :token="pair?.token0" />
          <Text bold>
            {{ pair?.token0.symbol }}
          </Text>
        </div>
      </div>
      <AddIcon :width="'10px'" :color="'minor'" />
      <div class="output">
        <Text bold :size="'large'">
          {{ parsedAmounts?.[Field.CURRENCY_B]?.toSignificant() ?? '-' }}
        </Text>
        <div class="token">
          <TokenLogo :token="pair?.token1" /><Text bold>
            {{ pair?.token1.symbol }}
          </Text>
        </div>
      </div>
      <Text class="tips" :color="'secondary-text'" :size="'mini'">
        {{ t('remove_liquidity.confirm_tips', { slippage: slippage / 100 }) }}
      </Text>
      <div class="card">
        <div class="cell">
          <Text class="label" :size="'small'">
            {{ t('remove_liquidity.burned', { token: `${pair?.token0.symbol}/${pair?.token1.symbol}` }) }}
          </Text>
          <div class="value">
            <DoubleLogo :token0="pair?.token0" :token1="pair?.token1" :size="20" />
            <Text class="liquidity" :size="'small'" :color="'description-text'">
              {{ parsedAmounts?.[Field.CURRENCY_A]?.toSignificant() }}
            </Text>
          </div>
        </div>
        <div class="cell">
          <Text class="label" :size="'small'">
            {{ t('remove_liquidity.price') }}
          </Text>
          <div class="price">
            <Text :size="'mini'" :color="'description-text'">
              {{ prices?.[0] }}
            </Text>
            <Text :size="'mini'" :color="'description-text'">
              {{ prices?.[1] }}
            </Text>
          </div>
        </div>
      </div>
      <div class="confirm">
        <Button :type="'primary'" bold @click="onConfirm">
          {{ t('remove_liquidity.confirm') }}
        </Button>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from '../Modal/Modal.vue'
import TokenLogo from '../TokenLogo/TokenLogo'
import DoubleLogo from '../DoubleLogo/index.vue'
import Text from '../Text/Text.vue'
import Button from '../Button/Button'
import { TokenAmount, Pair } from 'l0k_swap-sdk'
import { useUserLiquiditySlippageTolerance } from '../../state/slippageToleranceSettings/hooks'
import { Field } from '../../state/burn/types'
import { AddIcon } from '../Svg'

export default defineComponent({
  props: {
    show: {
      default: false,
      type: Boolean,
    },
    parsedAmounts: {
      type: Object as PropType<{ [field in Field]?: TokenAmount }>,
    },
    prices: {
      type: Array as PropType<string[]>,
    },
    pair: {
      type: Object as PropType<Pair | null | undefined>,
    },
  },
  components: {
    Modal,
    Text,
    Button,
    TokenLogo,
    DoubleLogo,
    AddIcon,
  },
  emits: ['dismiss', 'burn'],
  setup(props, { emit }) {
    const { show, parsedAmounts } = toRefs(props)
    const { t } = useI18n()

    const slippage = useUserLiquiditySlippageTolerance()

    const showModal = computed({
      get: () => show.value,
      set(newValue) {
        if (!newValue) {
          emit('dismiss')
        }
      },
    })

    const onConfirm = () => {
      emit('burn')
    }

    return {
      showModal,
      Field,
      slippage,
      parsedAmounts,

      t,
      onConfirm,
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/index.scss';

.l0k-swap-confirm-burn-modal {
  .output {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .token {
      display: flex;
      align-items: center;

      img {
        margin-right: 8px;
      }
    }
  }

  .tips {
    margin-top: 12px;
  }

  .card {
    padding: 16px;
    background: $color-bg-secondary;
    border-radius: 20px;
    margin-top: 12px;

    .cell {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      .liquidity {
        margin-left: 8px;
      }

      .value {
        display: flex;
        align-items: center;
      }

      .price {
        :first-child {
          margin-bottom: 8px;
        }
      }
    }
  }

  .confirm {
    display: flex;
    justify-content: center;
    margin-top: 20px;

    button {
      width: 160px;
    }
  }
}
</style>
