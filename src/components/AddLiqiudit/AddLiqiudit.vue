<template>
  <div class="l0k-swap-add-liqiudit">
    <div class="l0k-swap-add-content">
      <CurrencyInputPanel :value="formattedAmounts[Field.CURRENCY_A]" :token="currencies[Field.CURRENCY_A]"
        :selectedCurrencyBalance="currencyBalances[Field.CURRENCY_A]" @token-select="handleCurrencyASelect"
        @input="onFieldAInput" />
      <div class="add-wrap">
        <AddIcon :color="'minor'" :width="'12px'" />
      </div>
      <CurrencyInputPanel :value="formattedAmounts[Field.CURRENCY_B]" :token="currencies[Field.CURRENCY_B]"
        :selectedCurrencyBalance="currencyBalances[Field.CURRENCY_B]" @token-select="handleCurrencyBSelect"
        @input="onFieldBInput" />
      <Text class="liqiudity" :color="'description-text'" :size="'mini'">
        {{ t('add_liqiudit.liqiudity', { value: LPTotalSupply }) }}
      </Text>
      <Text :color="'description-text'" :size="'mini'">
        {{ t('add_liqiudit.no_liqiudity_tips') }}
      </Text>
      <PoolPriceBar class="pool-price-bar" v-if="tokenA && tokenB" :currencies="currencies" :noLiquidity="noLiquidity"
        :poolTokenPercentage="poolTokenPercentage" :price="price" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
import { Token } from '../../sdk'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'
import { Field } from '../../state/mint/types'
import CurrencyInputPanel from '../CurrencyInputPanel/index.vue'
import Button from '../Button/Button'
import Text from '../Text/Text.vue'
import PoolPriceBar from './PoolPriceBar.vue'
import { AddIcon } from '../Svg'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  components: {
    CurrencyInputPanel,
    AddIcon,
    Button,
    Text,
    PoolPriceBar
  },
  props: {
    token0: {
      type: Object as PropType<Token>
    },
    token1: {
      type: Object as PropType<Token>
    }
  },
  setup(props) {
    const { token0, token1, } = toRefs(props)
    const selectdTokens = ref<[Token | undefined, Token | undefined]>([undefined, undefined])

    const tokenA = computed(() => selectdTokens.value[0] ? selectdTokens.value[0] : token0.value)
    const tokenB = computed(() => selectdTokens.value[1] ? selectdTokens.value[1] : token1.value)

    const { t } = useI18n()
    const { noLiquidity, dependentField, parsedAmounts, currencyBalances, currencies, totalSupply, poolTokenPercentage, price } = useDerivedMintInfo(tokenA, tokenB)
    const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

    const mintState = useMintState()

    const formattedAmounts = computed(() => {
      const { typedValue, independentField, otherTypedValue } = mintState.value

      return {
        [independentField]: typedValue,
        [dependentField.value]: noLiquidity.value ? otherTypedValue : parsedAmounts.value[dependentField.value]?.toSignificant(6) ?? '',
      }
    })

    const LPTotalSupply = computed(() => {
      if (noLiquidity.value) {
        return t('add_liqiudit.no_liqiudity')
      }
      if (totalSupply.value === null) {
        return t('loading')
      }
      return totalSupply.value ? totalSupply.value.toSignificant() : '-'
    })

    const handleCurrencyASelect = (token: Token) => {
      if (selectdTokens.value.find(item => item?.address === token.address)) {
        return
      }
      selectdTokens.value[0] = token
    }
    const handleCurrencyBSelect = (token: Token) => {
      if (selectdTokens.value.find(item => item?.address === token.address)) {
        return
      }
      selectdTokens.value[1] = token
    }


    return {
      tokenA,
      tokenB,
      Field,
      LPTotalSupply,
      currencies,
      formattedAmounts,
      currencyBalances,
      noLiquidity,
      poolTokenPercentage,
      price,

      t,
      onFieldAInput,
      onFieldBInput,
      handleCurrencyASelect,
      handleCurrencyBSelect
    }
  }
})
</script>


<style lang="scss">
@import '../../styles/index.scss';

.l0k-swap-add-liqiudit {

  .l0k-swap-add-content {
    .add-wrap {
      display: flex;
      justify-content: center;
    }

    .liqiudity {
      margin-top: 8px;
      margin-bottom: 5px;
    }

    .pool-price-bar {
      margin-top: 10px;
    }
  }
}
</style>