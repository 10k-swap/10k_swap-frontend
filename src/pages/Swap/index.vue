<template>
  <Page class="l0k-swap-swap-wrapper" :title="t('pool.title')">
    <template v-slot:head-right>
      <SettingIcon class="setting" width="17px" @click="onSetting" />
    </template>
    <CurrencyInputPanel :value="formattedAmounts[Field.INPUT]" :token="currencies[Field.INPUT]"
      :selectedCurrencyBalance="currencyBalances[Field.INPUT]" @token-select="onInputSelect" @input="handleTypeInput" />
  </Page>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import Text from '../../components/Text/Text.vue'
import Button from '../../components/Button/Button'
import Page from '../../components/Page/Page.vue'
import CurrencyInputPanel from '../../components/CurrencyInputPanel/index.vue'
import { SettingIcon } from '../../components/Svg'
import { Token, Trade } from '../../sdk'
import { useModalStore, useSlippageToleranceSettingsStore } from '../../state'
import { useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from '../../state/swap/hooks'
import { useSwapStore } from '../../state/swap'
import { Field } from '../../state/swap/types'

export default defineComponent({
  components: {
    Text,
    Button,
    Page,
    SettingIcon,
    CurrencyInputPanel
  },
  setup() {
    const { t } = useI18n()
    const modalStore = useModalStore()
    const slippageToleranceSettingsStore = useSlippageToleranceSettingsStore()

    // swap state
    const swapStore = useSwapStore()
    const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo()

    const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers()
    const independentField = computed(() => swapStore.independentField)
    const isValid = computed(() => !swapInputError.value)
    const dependentField = computed(() => independentField.value === Field.INPUT ? Field.OUTPUT : Field.INPUT)

    const parsedAmounts = computed(() => ({
      [Field.INPUT]: independentField.value === Field.INPUT ? parsedAmount.value : v2Trade.value?.inputAmount,
      [Field.OUTPUT]: independentField.value === Field.OUTPUT ? parsedAmount.value : v2Trade.value?.outputAmount,
    }
    ))
    const formattedAmounts = computed(() => ({
      [independentField.value]: swapStore.typedValue,
      [dependentField.value]: parsedAmounts.value[dependentField.value]?.toSignificant(6) ?? '',
    }))

    const swapState = reactive<{
      showConfirm: boolean
      tradeToConfirm: Trade | undefined
      attemptingTxn: boolean
      swapErrorMessage: string | undefined
      txHash: string | undefined
    }>({
      showConfirm: false,
      tradeToConfirm: undefined,
      attemptingTxn: false,
      swapErrorMessage: undefined,
      txHash: undefined,
    })

    const handleTypeInput = (value: string | number) => {
      onUserInput(Field.INPUT, value)
    }
    const handleTypeOutput = (value: string | number) => {
      onUserInput(Field.OUTPUT, value)
    }
    const onSetting = () => {
      modalStore.toggleSlippageToleranceSettingsModal(true)
      slippageToleranceSettingsStore.updateCurrentSet('swap')
    }
    const onInputSelect = (inputCurrency: Token) => {
      onCurrencySelection(Field.INPUT, inputCurrency)
    }
    const onOutputSelect = (inputCurrency: Token) => {
      onCurrencySelection(Field.INPUT, inputCurrency)
    }


    return {
      Field,
      formattedAmounts,
      currencies,
      currencyBalances,

      t,
      onSetting,
      onInputSelect,
      onOutputSelect,
      handleTypeInput
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';

.l0k-swap-swap-wrapper {
  margin-top: 28px;

  .setting {
    cursor: pointer;
  }

  @include mobile {
    margin-top: 5px;
  }
}
</style>
