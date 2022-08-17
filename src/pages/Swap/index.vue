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
      <div class="swap-info">
        <div class="loading" v-if="loadingTrade">
          <LoadingIcon class="icon" :color="'minor'" width="12px" />
          <Text :color="'description-text'" :size="'mini'">
            {{ t('swap.fetching') }}
          </Text>
        </div>
        <div class="info" v-else-if="v2Trade">
          <TradePrice :price="v2Trade.executionPrice" />
          <AdvancedSwapDetails :trade="v2Trade" />
        </div>
      </div>
      <div class="swap">
        <Button :type="'primary'" :size="'large'" v-if="!account" @click="onConnect">
          {{ t('swap.connect') }}
        </Button>
        <Button :type="'primary'" :size="'large'" disabled v-else-if="noTrade && userHasSpecifiedInputOutput">
          {{ t('swap.insufficient_liquidity') }}
        </Button>
        <Button :type="'primary'" :size="'large'" v-else @click="onSwapClick"
          :disabled="!isValid || loadingTrade || !v2Trade || !!swapCallbackError">
          {{ !isValid ? swapInputError : t('swap.swap') }}
        </Button>
      </div>
    </div>
  </Page>
  <ConfirmModal :trade="swapState.tradeToConfirm" :show="swapState.showConfirm"
    @update:show="() => swapState.showConfirm = false" @swap="handleSwap"/>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import JSBI from 'jsbi'
import Text from '../../components/Text/Text.vue'
import Button from '../../components/Button/Button'
import Page from '../../components/Page/Page.vue'
import CurrencyInputPanel from '../../components/CurrencyInputPanel/index.vue'
import TradePrice from '../../components/swap/TradePrice.vue'
import AdvancedSwapDetails from '../../components/swap/AdvancedSwapDetails.vue'
import ConfirmModal from '../../components/swap/ConfirmModal.vue'
import { SettingIcon, SwitchIcon, LoadingIcon } from '../../components/Svg'
import { Token, Trade } from '../../sdk'
import { useModalStore, useSlippageToleranceSettingsStore } from '../../state'
import { useDerivedSwapInfo, useSwapActionHandlers } from '../../state/swap/hooks'
import { useSwapStore } from '../../state/swap'
import { Field } from '../../state/swap/types'
import useConnector from '../../hooks/useConnector'
import useSwapCallback from '../../hooks/useSwapCallback'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { useUserSwapSlippageTolerance } from '../../state/slippageToleranceSettings/hooks'

export default defineComponent({
  components: {
    Text,
    Button,
    Page,
    SettingIcon,
    CurrencyInputPanel,
    SwitchIcon,
    LoadingIcon,
    TradePrice,
    AdvancedSwapDetails,
    ConfirmModal
  },
  setup() {
    const { t } = useI18n()
    const modalStore = useModalStore()
    const { onConnect } = useConnector()
    const slippageToleranceSettingsStore = useSlippageToleranceSettingsStore()
    const userSwapSlippageTolerance = useUserSwapSlippageTolerance()
    const { state: { account } } = useStarknet()

    // swap state
    const swapStore = useSwapStore()
    const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo()
    const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers()
    const independentField = computed(() => swapStore.independentField)
    const isValid = computed(() => !swapInputError.value)
    const dependentField = computed(() => independentField.value === Field.INPUT ? Field.OUTPUT : Field.INPUT)

    const swapCallbacks = useSwapCallback(v2Trade, userSwapSlippageTolerance)
    const swapCallbackError = computed(() => swapCallbacks.value.error)

    const parsedAmounts = computed(() => ({
      [Field.INPUT]: independentField.value === Field.INPUT ? parsedAmount.value : v2Trade.value?.inputAmount,
      [Field.OUTPUT]: independentField.value === Field.OUTPUT ? parsedAmount.value : v2Trade.value?.outputAmount,
    }))
    const formattedAmounts = computed(() => ({
      [independentField.value]: swapStore.typedValue,
      [dependentField.value]: parsedAmounts.value[dependentField.value]?.toSignificant(6) ?? '',
    }))
    const userHasSpecifiedInputOutput = computed(() => Boolean(
      currencies.value[Field.INPUT] && currencies.value[Field.OUTPUT] && parsedAmounts.value[independentField.value]?.greaterThan(JSBI.BigInt(0))
    ))
    const noRoute = computed(() => !(v2Trade.value?.route))
    const noTrade = computed(() => v2Trade.value === undefined)
    const loadingTrade = computed(() => v2Trade.value === null)

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
    const onSwapClick = () => {
      if (!v2Trade.value) {
        return
      }
      swapState.showConfirm = true
      swapState.tradeToConfirm = v2Trade.value
    }

    const handleSwap = () => {
      if (!swapCallbacks.value.callback) {
        return
      }
      swapState.attemptingTxn = true

      swapCallbacks.value.callback()
        .then((hash) => {
          swapState.attemptingTxn = true
          swapState.txHash = hash
        })
        .catch((error) => {
          swapState.attemptingTxn = false
          swapState.txHash = undefined
          swapState.swapErrorMessage = error.message
        })
    }

    return {
      swapState,
      Field,
      isValid,
      v2Trade,
      account,
      noRoute,
      noTrade,
      loadingTrade,
      formattedAmounts,
      currencies,
      currencyBalances,
      userHasSpecifiedInputOutput,
      swapInputError,
      swapCallbackError,

      t,
      onSetting,
      onInputSelect,
      onConnect,
      onSwitch,
      onOutputSelect,
      onSwapClick,
      handleTypeInput,
      handleTypeOutput,
      handleSwap
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

    .swap-info {
      margin-top: 13px;

      .loading {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 6px;
        }
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
