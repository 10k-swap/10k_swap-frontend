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
          :disabled="!isValid || loadingTrade || !v2Trade || (tradeToConfirm && !!swapCallbackError)">
          {{ !isValid ? swapInputError : t('swap.swap') }}
        </Button>
      </div>
    </div>
  </Page>
  <ConfirmModal :show="swapState.showConfirm" :trade="tradeToConfirm" @swap="handleSwap" @dismiss="onReset" />
  <WaittingModal :show="swapState.attemptingTxn" :desc="summary" @dismiss="onReset" />
  <RejectedModal :show="showRejectedModal" @dismiss="onReset" />
  <ScuccessModal :show="!!swapState.txHash" :tx="swapState.txHash" @dismiss="onReset" />
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import JSBI from 'jsbi'
import Text from '../../components/Text/Text.vue'
import Button from '../../components/Button/Button'
import Page from '../../components/Page/Page.vue'
import CurrencyInputPanel from '../../components/CurrencyInputPanel/index.vue'
import TradePrice from '../../components/swap/TradePrice.vue'
import AdvancedSwapDetails from '../../components/swap/AdvancedSwapDetails.vue'
import ConfirmModal from '../../components/swap/ConfirmModal.vue'
import WaittingModal from '../../components/transaction/WaittingModal.vue'
import RejectedModal from '../../components/transaction/RejectedModal.vue'
import ScuccessModal from '../../components/transaction/ScuccessModal.vue'
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
import useSwapSummary from '../../hooks/useSwapSummary'

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
    ConfirmModal,
    WaittingModal,
    RejectedModal,
    ScuccessModal
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
    const showRejectedModal = computed(() => !!swapState.swapErrorMessage && swapState.swapErrorMessage.includes('User abort'))

    const tradeToConfirm = ref<Trade>()
    const swapState = reactive<{
      showConfirm: boolean
      attemptingTxn: boolean
      swapErrorMessage: string | undefined
      txHash: string | undefined
    }>({
      showConfirm: false,
      attemptingTxn: false,
      swapErrorMessage: undefined,
      txHash: undefined,
    })

    const summary = useSwapSummary(tradeToConfirm, userSwapSlippageTolerance)
    const swapCallbacks = useSwapCallback(tradeToConfirm, userSwapSlippageTolerance)
    const swapCallbackError = computed(() => swapCallbacks.value.error)

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
      tradeToConfirm.value = v2Trade.value
    }

    const handleSwap = () => {
      if (!swapCallbacks.value.callback) {
        return
      }
      swapState.showConfirm = false
      swapState.attemptingTxn = true

      swapCallbacks.value.callback()
        .then((hash) => {
          swapState.attemptingTxn = false
          swapState.txHash = hash
        })
        .catch((error) => {
          swapState.attemptingTxn = false
          swapState.txHash = undefined
          swapState.swapErrorMessage = error.message
        })
    }


    const onReset = () => {
      if (swapState.txHash) {
        onUserInput(Field.INPUT, '')
      }
      swapState.showConfirm = false
      tradeToConfirm.value = undefined
      swapState.attemptingTxn = false
      swapState.swapErrorMessage = undefined
      swapState.txHash = undefined
    }

    return {
      swapState,
      Field,
      isValid,
      v2Trade,
      summary,
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
      showRejectedModal,
      tradeToConfirm,

      t,
      onSetting,
      onInputSelect,
      onConnect,
      onSwitch,
      onOutputSelect,
      onSwapClick,
      onReset,
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
