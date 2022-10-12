<template>
  <div class="detailed-remove">
    <div class="remove-amount">
      <Text :size="'small'">
        {{ t('remove_liquidity.remove_amount') }}
      </Text>
      <Text bold :size="'large'">{{ formattedAmounts[Field.LIQUIDITY_PERCENT] ?? '-' }}%</Text>
      <Text class="simple" :color="'blue'" :size="'small'" @click="onSimpleClick">
        {{ t('remove_liquidity.simple') }}
      </Text>
    </div>
    <CurrencyInputPanel
      :selector="false"
      size="small"
      :token="pair?.liquidityToken"
      :value="formattedAmounts[Field.LIQUIDITY]"
      :currencyBalance="userLiquidity"
      @input="onUserInput(Field.LIQUIDITY, $event)"
      :onMax="onMax"
    >
      <template v-slot:token>
        <DoubleLogo :token0="pair?.token0" :token1="pair?.token1" />
        <Text class="symbol" bold> {{ pair?.token0.symbol + '-' + pair?.token1.symbol }} </Text>
      </template>
    </CurrencyInputPanel>
    <div class="icon-wrap">
      <DownIcon :width="'10px'" :color="'minor'" />
    </div>
    <CurrencyInputPanel
      size="small"
      :selector="false"
      :token="pair?.token0"
      :currencyBalance="token0Balance"
      :value="formattedAmounts[Field.CURRENCY_A]"
      @input="onUserInput(Field.CURRENCY_A, $event)"
    />
    <div class="icon-wrap">
      <AddIcon :width="'10px'" :color="'minor'" />
    </div>
    <CurrencyInputPanel
      size="small"
      :selector="false"
      :token="pair?.token1"
      :currencyBalance="token1Balance"
      :value="formattedAmounts[Field.CURRENCY_B]"
      @input="onUserInput(Field.CURRENCY_B, $event)"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue'
import DoubleLogo from '../DoubleLogo/index.vue'
import Text from '../Text/Text.vue'
import { DownIcon, AddIcon } from '../Svg'
import CurrencyInputPanel from '../CurrencyInputPanel/index.vue'
import { useBurnActionHandlers, useBurnState, useDerivedBurnInfo } from '../../state/burn/hooks'
import { Field } from '../../state/burn/types'
import { Pair, TokenAmount, ZERO } from 'l0k_swap-sdk'
import { useTokenBalances } from '../../hooks/Balances'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  props: {
    pair: {
      type: Object as PropType<Pair | null | undefined>,
    },
  },
  components: {
    CurrencyInputPanel,
    DoubleLogo,
    DownIcon,
    AddIcon,
    Text,
  },
  emits: ['simple'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const { pair } = toRefs(props)
    const burnState = useBurnState()
    const independentField = computed(() => burnState.value.independentField)
    const typedValue = computed(() => burnState.value.typedValue)

    const {
      state: { account },
    } = useStarknet()

    const token0 = computed(() => pair.value?.token0)
    const token1 = computed(() => pair.value?.token1)
    const token0Balance = useTokenBalances(account, token0)
    const token1Balance = useTokenBalances(account, token1)

    const { parsedAmounts, userLiquidity } = useDerivedBurnInfo(pair)

    const formattedAmounts = computed(() => ({
      [Field.LIQUIDITY_PERCENT]:
        independentField.value === Field.LIQUIDITY_PERCENT ? typedValue.value : parsedAmounts.value[Field.LIQUIDITY_PERCENT]?.toSignificant(6) ?? '',
      [Field.LIQUIDITY]: independentField.value === Field.LIQUIDITY ? typedValue.value : parsedAmounts.value[Field.LIQUIDITY]?.toSignificant(6) ?? '',
      [Field.CURRENCY_A]:
        independentField.value === Field.CURRENCY_A ? typedValue.value : parsedAmounts.value[Field.CURRENCY_A]?.toSignificant(6) ?? '',
      [Field.CURRENCY_B]:
        independentField.value === Field.CURRENCY_B ? typedValue.value : parsedAmounts.value[Field.CURRENCY_B]?.toSignificant(6) ?? '',
    }))
    const { onUserInput } = useBurnActionHandlers()

    const onMax = (maxInputAmount: TokenAmount | undefined) => {
      if (maxInputAmount && !maxInputAmount.equalTo(ZERO)) {
        onUserInput(Field.LIQUIDITY, maxInputAmount.toExact())
      }
    }
    const onSimpleClick = () => {
      emit('simple')
    }

    return {
      Field,
      formattedAmounts,
      userLiquidity,
      token0Balance,
      token1Balance,

      onUserInput,
      onMax,
      onSimpleClick,
      t,
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/index';
.detailed-remove {
  .icon-wrap {
    display: flex;
    justify-content: center;
  }
  .remove-amount {
    position: relative;
    margin-bottom: 12px;
    padding: 16px;
    border-radius: 20px;
    background: $color-bg-secondary;
    .simple {
      position: absolute;
      right: 16px;
      top: 16px;
      cursor: pointer;
    }
  }
}
</style>
