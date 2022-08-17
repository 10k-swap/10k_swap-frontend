<template>
  <div class="advanced-swap-details">
    <div class="cell">
      <Text class="label" :size="'mini'">
        {{ isExactIn ? t('swap.expected_output') : t('swap.expected_input') }}
      </Text>
      <Text class="value" :size="'mini'" :color="'description-text'">
        {{
            isExactIn ? `${trade?.outputAmount.toSignificant()} ${trade?.outputAmount.token.symbol}` :
              `${trade?.inputAmount.toSignificant()} ${trade?.inputAmount.token.symbol}`
        }}
      </Text>
    </div>
    <div class="cell">
      <Text class="label" :size="'mini'">
        {{ t('swap.price_impact') }}
      </Text>
      <Text class="value" :size="'mini'" :color="'description-text'">
        {{ trade ? (trade?.priceImpact.lessThan(ONE_BIPS) ? '<0.01' : `${trade?.priceImpact.toFixed(2)}`) : '-' }}%
          </Text>
    </div>
    <div class="cell">
      <Text class="label" :size="'mini'">
        {{ isExactIn ? t('swap.minimun_received', { slippage: allowedSlippage / 100 }) :
            t('swap.maximum_received', { slippage: allowedSlippage / 100 })
        }}
      </Text>
      <Text class="value" :size="'mini'" :color="'description-text'">
        {{
            isExactIn
              ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade?.outputAmount.currency.symbol}` ??
              '-'
              : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade?.inputAmount.currency.symbol}` ??
              '-'
        }}
      </Text>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { Trade, TradeType } from '../../sdk'
import { ONE_BIPS } from '../../constants/index'
import { useUserSwapSlippageTolerance } from '../../state/slippageToleranceSettings/hooks'
import { Field } from '../../state/swap/types'
import { computeSlippageAdjustedAmounts } from '../../utils/prices'
import Text from '../Text/Text.vue'

export default defineComponent({
  props: {
    trade: {
      type: Object as PropType<Trade>,
    }
  },
  components: { Text },
  setup(props) {
    const { trade } = toRefs(props)

    const { t } = useI18n()

    const allowedSlippage = useUserSwapSlippageTolerance()
    const showRoute = computed(() => Boolean(trade.value && trade.value.route.path.length > 2))
    const isExactIn = computed(() => trade.value?.tradeType == TradeType.EXACT_INPUT)
    const slippageAdjustedAmounts = computed(() => computeSlippageAdjustedAmounts(trade.value, allowedSlippage.value))

    return {
      trade,
      showRoute,
      isExactIn,
      allowedSlippage,
      slippageAdjustedAmounts,
      Field,
      ONE_BIPS,

      t
    };
  }
})
</script>


<style lang="scss">
.advanced-swap-details {
  margin-top: 10px;

  .cell {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>