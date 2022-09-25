<template>
  <div class="pool-price-bar">
    <div class="column">
      <Text :size="'small'">{{ price?.toSignificant(6) ?? '-' }}</Text>
      <Text :size="'small'" :color="'description-text'">{{ labels[0] }}</Text>
    </div>
    <div class="column">
      <Text :size="'small'">{{ price?.invert()?.toSignificant(6) ?? '-' }}</Text>
      <Text :size="'small'" :color="'description-text'">{{ labels[1] }}</Text>
    </div>
    <div class="column">
      <Text :size="'small'"> {{ poolTokenPercentageLabel }}%</Text>
      <Text :size="'small'" :color="'description-text'">
        {{ t('add_liquidity.share_of_pool') }}
      </Text>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import usePoolTokenPercentageLabel from '../../hooks/usePoolTokenPercentageLabel'
import { Percent, Price, Token } from 'l0k_swap-sdk'
import { Field } from '../../state/mint/types'
import Text from '../Text/Text.vue'

export default defineComponent({
  props: {
    noLiquidity: Boolean,
    currencies: {
      type: Object as PropType<{ [field in Field]?: Token }>,
    },
    poolTokenPercentage: {
      type: Object as PropType<Percent>,
    },
    price: {
      type: Object as PropType<Price>,
    },
  },
  components: {
    Text,
  },
  setup(props) {
    const { t } = useI18n()
    const { currencies, noLiquidity, price, poolTokenPercentage } = toRefs(props)

    const labels = computed(() => {
      return [
        `${currencies.value?.[Field.CURRENCY_B]?.symbol} per ${currencies.value?.[Field.CURRENCY_A]?.symbol}`,
        `${currencies.value?.[Field.CURRENCY_A]?.symbol} per ${currencies.value?.[Field.CURRENCY_B]?.symbol}`,
      ]
    })

    const poolTokenPercentageLabel = usePoolTokenPercentageLabel(poolTokenPercentage, price, noLiquidity)

    return {
      Field,
      labels,
      poolTokenPercentageLabel,

      t,
    }
  },
})
</script>

<style lang="scss">
.pool-price-bar {
  display: flex;

  .column {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }
}
</style>
