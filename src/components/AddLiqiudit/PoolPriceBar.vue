<template>
  <div class="pool-price-bar">
    <div class="column">
      <Text :size="'small'">{{ price?.toSignificant(6) ?? '-' }}</Text>
      <Text :size="'small'" :color="'description-text'">{{ `${currencies?.[Field.CURRENCY_B]?.symbol} per
              ${currencies?.[Field.CURRENCY_A]?.symbol}`
      }}</Text>
    </div>
    <div class="column">
      <Text :size="'small'">{{ price?.invert()?.toSignificant(6) ?? '-' }}</Text>
      <Text :size="'small'" :color="'description-text'">{{ `${currencies?.[Field.CURRENCY_A]?.symbol} per
              ${currencies?.[Field.CURRENCY_B]?.symbol}`
      }}</Text>
    </div>
    <div class="column">
      <Text :size="'small'">
        {{ noLiquidity && price
            ? '100'
            : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'
        }}%</Text>
          <Text :size="'small'" :color="'description-text'">
            {{ t('add_liqiudit.share_of_pool') }}
          </Text>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { ONE_BIPS } from '../../constants'
import { Percent, Price, Token } from '../../sdk'
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
    }
  },
  components: {
    Text
  },
  setup() {
    const { t } = useI18n()

    return {
      Field,
      ONE_BIPS,

      t
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