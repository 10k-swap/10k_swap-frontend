<template>
  <Modal v-model="showModal" :top="160" :title="t('add_liquidity.confirm_title')">
    <div class="l0k-swap-confirm-mint-modal">
      <div class="liquidity">
        <Text bold :size="'large'">
          {{ liquidity?.toSignificant() ?? '-' }}
        </Text>
        <DoubleLogo class="logos" :token0="currencies?.[Field.CURRENCY_A]" :token1="currencies?.[Field.CURRENCY_B]" />
      </div>
      <Text :color="'secondary-text'">
        {{
          t('add_liquidity.pool_token', {
            tokens: `${currencies?.[Field.CURRENCY_A]?.symbol}/${currencies?.[Field.CURRENCY_B]?.symbol}`,
          })
        }}
      </Text>
      <Text class="tips" :color="'secondary-text'" :size="'mini'">
        {{ t('add_liquidity.confirm_tips', { slippage: slippage / 100 }) }}
      </Text>
      <div class="card">
        <div class="cell">
          <Text class="label" :size="'small'">
            {{ t('add_liquidity.deposited', { token: currencies?.[Field.CURRENCY_A]?.symbol }) }}
          </Text>
          <div class="value">
            <TokenLogo :token="currencies?.[Field.CURRENCY_A]" :size="20" />
            <Text :size="'small'" :color="'description-text'">
              {{ parsedAmounts?.[Field.CURRENCY_A]?.toSignificant() }}
            </Text>
          </div>
        </div>
        <div class="cell">
          <Text class="label" :size="'small'">
            {{ t('add_liquidity.deposited', { token: currencies?.[Field.CURRENCY_B]?.symbol }) }}
          </Text>
          <div class="value">
            <TokenLogo :token="currencies?.[Field.CURRENCY_B]" :size="20" />
            <Text :size="'small'" :color="'description-text'">
              {{ parsedAmounts?.[Field.CURRENCY_B]?.toSignificant() }}
            </Text>
          </div>
        </div>
        <div class="cell">
          <Text class="label" :size="'small'">
            {{ t('add_liquidity.rates') }}
          </Text>
          <div class="value">
            <div class="rates">
              <Text :size="'small'" :color="'description-text'">
                {{ `1 ${currencies?.[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(6)} ${currencies?.[Field.CURRENCY_B]?.symbol}` }}
              </Text>
              <Text :size="'small'" :color="'description-text'">
                {{ `1 ${currencies?.[Field.CURRENCY_B]?.symbol} = ${price?.invert()?.toSignificant(6)}${currencies?.[Field.CURRENCY_A]?.symbol}` }}
              </Text>
            </div>
          </div>
        </div>
        <div class="cell">
          <Text class="label" :size="'small'">
            {{ t('add_liquidity.share_of_pool') }}
          </Text>
          <div class="value">
            <Text :size="'small'" :color="'description-text'">{{ poolTokenPercentageLabel }}%</Text>
          </div>
        </div>
      </div>
      <div class="confirm">
        <Button :type="'primary'" class="no-wrap" bold @click="onConfirm">
          {{ t('add_liquidity.confirm') }}
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
import { Price, TokenAmount, Token, Percent } from 'l0k_swap-sdk'
import { useUserLiquiditySlippageTolerance } from '../../state/slippageToleranceSettings/hooks'
import { Field } from '../../state/mint/types'
import usePoolTokenPercentageLabel from '../../hooks/usePoolTokenPercentageLabel'

export default defineComponent({
  props: {
    show: {
      default: false,
      type: Boolean,
    },
    price: {
      type: Object as PropType<Price>,
    },
    currencies: {
      type: Object as PropType<{ [field in Field]?: Token }>,
    },
    parsedAmounts: {
      type: Object as PropType<{ [field in Field]?: TokenAmount }>,
    },
    poolTokenPercentage: {
      type: Object as PropType<Percent>,
    },
    liquidity: Object as PropType<TokenAmount>,
    noLiquidity: Boolean,
  },
  components: {
    Modal,
    Text,
    Button,
    TokenLogo,
    DoubleLogo,
  },
  emits: ['dismiss', 'mint'],
  setup(props, { emit }) {
    const { show, currencies, liquidity, parsedAmounts, poolTokenPercentage, price, noLiquidity } = toRefs(props)
    const { t } = useI18n()

    const slippage = useUserLiquiditySlippageTolerance()
    const poolTokenPercentageLabel = usePoolTokenPercentageLabel(poolTokenPercentage, price, noLiquidity)

    const showModal = computed({
      get: () => show.value,
      set(newValue) {
        if (!newValue) {
          emit('dismiss')
        }
      },
    })

    const onConfirm = () => {
      emit('mint')
    }

    return {
      showModal,
      Field,
      liquidity,
      slippage,
      currencies,
      parsedAmounts,
      poolTokenPercentageLabel,

      t,
      onConfirm,
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/index.scss';

.l0k-swap-confirm-mint-modal {
  .liquidity {
    display: flex;
    align-items: center;

    .logos {
      margin-left: 20px;
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

      .value {
        display: flex;
        align-items: center;

        img {
          margin-right: 4px;
        }

        .rates {
          text-align: right;

          div:first-child {
            margin-bottom: 8px;
          }
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
      @include no-wrap;
    }
  }
}
</style>
