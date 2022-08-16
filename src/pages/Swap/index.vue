<template>
  <Page class="l0k-swap-swap-wrapper" :title="t('swap.title')">
    <template v-slot:head-right>
      <SettingIcon class="setting" width="17px" @click="onSetting" />
    </template>
    <div class="l0k-swap-swap-content">
      <CurrencyInputPanel :value="formattedAmounts[Field.INPUT]" :token="currencies[Field.INPUT]"
        :selectedCurrencyBalance="currencyBalances[Field.INPUT]" @token-select="onInputSelect"
        @input="handleTypeInput" />
      <div class="switch-wrap">
        <SwitchIcon class="switch" @click="onSwitch" />
      </div>
      <CurrencyInputPanel :value="formattedAmounts[Field.OUTPUT]" :token="currencies[Field.OUTPUT]"
        :selectedCurrencyBalance="currencyBalances[Field.OUTPUT]" @token-select="onOutputSelect"
        @input="handleTypeOutput" />
      <div class="swap">
        <Button :type="'primary'" :size="'large'" v-if="!account" @click="onConnect">
          {{ t('swap.connect') }}
        </Button>
        <Button :type="'primary'" :size="'large'" disabled v-else-if="userHasSpecifiedInputOutput">
          {{ t('swap.insufficient_liquidity') }}
        </Button>
      </div>
    </div>
  </Page>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import JSBI from 'jsbi'
import Text from '../../components/Text/Text.vue'
import Button from '../../components/Button/Button'
import Page from '../../components/Page/Page.vue'
import CurrencyInputPanel from '../../components/CurrencyInputPanel/index.vue'
import { SettingIcon, SwitchIcon } from '../../components/Svg'
import { Token, Trade } from '../../sdk'
import { useModalStore, useSlippageToleranceSettingsStore } from '../../state'
import { useDerivedSwapInfo, useSwapActionHandlers } from '../../state/swap/hooks'
import { useSwapStore } from '../../state/swap'
import { Field } from '../../state/swap/types'
import useConnector from '../../hooks/useConnector'
import { useStarknet } from '../../starknet-vue/providers/starknet'

export default defineComponent({
  components: {
    Text,
    Button,
    Page,
    SettingIcon,
    CurrencyInputPanel,
    SwitchIcon
  },
  setup() {
    const { t } = useI18n()
    const modalStore = useModalStore()
    const { onConnect } = useConnector()
    const slippageToleranceSettingsStore = useSlippageToleranceSettingsStore()
    const { state: { account } } = useStarknet()

    // swap state
    const swapStore = useSwapStore()
    const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo()
watch(v2Trade,()=>console.log(v2Trade.value))
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
    const userHasSpecifiedInputOutput = computed(() => Boolean(
      currencies.value[Field.INPUT] && currencies.value[Field.OUTPUT] && parsedAmounts.value[independentField.value]?.greaterThan(JSBI.BigInt(0))
    ))

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
      onCurrencySelection(Field.OUTPUT, inputCurrency)
    }
    const onSwitch = () => {
      onSwitchTokens()
    }


    return {
      Field,
      account,
      formattedAmounts,
      currencies,
      currencyBalances,
      userHasSpecifiedInputOutput,

      t,
      onSetting,
      onInputSelect,
      onConnect,
      onSwitch,
      onOutputSelect,
      handleTypeInput,
      handleTypeOutput
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

  .l0k-swap-swap-content {
    padding: 0 20px 20px 20px;

    .switch-wrap {
      position: relative;
      height: 12px;
      cursor: pointer;

      .switch {
        position: absolute;
        z-index: 2;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
      }
    }

    .swap {
      display: flex;
      margin-top: 20px;
    }
  }

  @include mobile {
    margin-top: 5px;
  }
}
</style>
