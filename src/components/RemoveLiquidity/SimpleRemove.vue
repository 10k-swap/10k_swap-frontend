<template>
  <div class="simple-remove">
    <div class="remove-amount">
      <Text :size="'small'">
        {{ t('remove_liquidity.remove_amount') }}
      </Text>
      <Text bold :size="'large'">{{ formattedAmounts[Field.LIQUIDITY_PERCENT] ?? '-' }}%</Text>
      <input class="range" :value="formattedAmounts[Field.LIQUIDITY_PERCENT]" type="range" min="0" max="100" step="1" @change="onRange" />
      <div class="ranges">
        <span v-for="item in [25, 50, 75, 100]" :key="item" @click="onRangeClick(item)">{{ item }}% </span>
      </div>
      <Text class="detailed" :color="'blue'" :size="'small'" @click="onDetailedClick">
        {{ t('remove_liquidity.detailed') }}
      </Text>
    </div>
    <div class="icon-wrap">
      <DownIcon :width="'10px'" :color="'minor'" />
    </div>
    <div class="amounts">
      <div class="amount">
        <Text bold :size="'large'">{{ formattedAmounts[Field.CURRENCY_A] }}</Text>
        <div class="token">
          <TokenLogo class="logo" :token="tokens?.[Field.CURRENCY_A]" />
          <Text bold>{{ tokens[Field.CURRENCY_A]?.symbol }} </Text>
        </div>
      </div>
      <div class="amount">
        <Text bold :size="'large'">{{ formattedAmounts[Field.CURRENCY_B] ?? '-' }}</Text>
        <div class="token">
          <TokenLogo class="logo" :token="tokens?.[Field.CURRENCY_B]" />
          <Text bold>{{ tokens?.[Field.CURRENCY_B]?.symbol }} </Text>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Pair } from 'l0k_swap-sdk'
import { computed, defineComponent, PropType, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import Text from '../Text/Text.vue'
import TokenLogo from '../TokenLogo/TokenLogo'
import { DownIcon } from '../Svg'
import { useBurnActionHandlers, useBurnState, useDerivedBurnInfo } from '../../state/burn/hooks'
import { Field } from '../../state/burn/types'

export default defineComponent({
  props: {
    pair: {
      type: Object as PropType<Pair | null | undefined>,
    },
  },
  components: {
    Text,
    DownIcon,
    TokenLogo,
  },
  emits: ['detailed'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const { pair } = toRefs(props)
    const burnState = useBurnState()
    const independentField = computed(() => burnState.value.independentField)
    const typedValue = computed(() => burnState.value.typedValue)

    const { parsedAmounts, tokens } = useDerivedBurnInfo(pair)
    const { onUserInput } = useBurnActionHandlers()

    const formattedAmounts = computed(() => ({
      [Field.LIQUIDITY_PERCENT]:
        independentField.value === Field.LIQUIDITY_PERCENT ? typedValue.value : parsedAmounts.value[Field.LIQUIDITY_PERCENT]?.toSignificant(6) ?? '',
      [Field.LIQUIDITY]: independentField.value === Field.LIQUIDITY ? typedValue.value : parsedAmounts.value[Field.LIQUIDITY]?.toSignificant(6) ?? '',
      [Field.CURRENCY_A]:
        independentField.value === Field.CURRENCY_A ? typedValue.value : parsedAmounts.value[Field.CURRENCY_A]?.toSignificant(6) ?? '-',
      [Field.CURRENCY_B]:
        independentField.value === Field.CURRENCY_B ? typedValue.value : parsedAmounts.value[Field.CURRENCY_B]?.toSignificant(6) ?? '-',
    }))

    const onDetailedClick = () => {
      emit('detailed')
    }

    const onRange = (e: Event) => {
      const target = e.target as HTMLInputElement
      onUserInput(Field.LIQUIDITY_PERCENT, target.value)
    }

    const onRangeClick = (value: number) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value.toString())
    }

    return {
      pair,
      formattedAmounts,
      Field,
      tokens,

      t,
      onDetailedClick,
      onRange,
      onRangeClick,
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/index';
.simple-remove {
  .icon-wrap {
    display: flex;
    justify-content: center;
  }
  .remove-amount {
    position: relative;
    padding: 16px;
    border-radius: 20px;
    background: $color-bg-secondary;
    .range {
      width: 100%;
      appearance: none;
      cursor: pointer;
      &::-webkit-slider-runnable-track {
        height: 4px;
        border-radius: 4px;
        background: $color-bg-transparent;
      }
      &::-moz-range-track {
        height: 4px;
        border-radius: 4px;
        background: $color-bg-transparent;
      }
      &::-webkit-slider-thumb {
        appearance: none;
        width: 20px;
        height: 20px;
        background-color: $color-white;
        box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.4);
        border-radius: 20px;
        cursor: pointer;
        transform: translateY(-8px);
      }
      &::-moz-range-thumb {
        appearance: none;
        width: 20px;
        height: 20px;
        background-color: $color-white;
        box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.4);
        border-radius: 20px;
        cursor: pointer;
        transform: translateY(-8px);
      }
    }
    .ranges {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      span {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 33px;
        height: 18px;
        background: $color-primary;
        border-radius: 50px;
        font-size: $font-size-mini;
        color: $color-white;
        cursor: pointer;
      }
    }
    .detailed {
      position: absolute;
      right: 16px;
      top: 16px;
      cursor: pointer;
    }
  }
  .amounts {
    padding: 8px 16px;
    border-radius: 20px;
    background: $color-bg-secondary;
    .amount {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .token {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .logo {
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
