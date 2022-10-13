<template>
  <div class="l0k-swap-add-liquidity">
    <div class="l0k-swap-add-content">
      <CurrencyInputPanel
        :value="formattedAmounts[Field.CURRENCY_A]"
        :token="currencies[Field.CURRENCY_A]"
        :currencyBalance="currencyBalances[Field.CURRENCY_A]"
        :otherToken="currencies[Field.CURRENCY_B]"
        @token-select="handleCurrencyASelect"
        @input="onFieldAInput"
        :onMax="onCurrencyAMax"
      />
      <div class="add-wrap">
        <AddIcon :color="'minor'" :width="'12px'" />
      </div>
      <CurrencyInputPanel
        :value="formattedAmounts[Field.CURRENCY_B]"
        :token="currencies[Field.CURRENCY_B]"
        :otherToken="currencies[Field.CURRENCY_A]"
        :currencyBalance="currencyBalances[Field.CURRENCY_B]"
        @token-select="handleCurrencyBSelect"
        @input="onFieldBInput"
        :onMax="onCurrencyBMax"
      />
      <Text class="liquidity" :color="'description-text'" :size="'mini'">
        {{ t('add_liquidity.liquidity', { value: LPTotalSupply }) }}
      </Text>
      <Text :color="'description-text'" :size="'mini'" v-if="noLiquidity">
        {{ t('add_liquidity.no_liquidity_tips') }}
      </Text>
      <PoolPriceBar
        class="pool-price-bar"
        v-if="tokenA && tokenB"
        :currencies="currencies"
        :noLiquidity="noLiquidity"
        :poolTokenPercentage="poolTokenPercentage"
        :price="price"
      />
      <Button class="deposit" :type="'primary'" :size="'large'" v-if="!account" bold @click="openWalletModal">
        {{ t('connect') }}
      </Button>
      <Button class="deposit" v-else :disabled="!!error" :size="'large'" :type="'primary'" bold @click="onDeposit">
        {{ error ? error : t('add_liquidity.deposit') }}
      </Button>
      <Text class="desc" :size="'mini'" :color="'description-text'">
        {{ t('add_liquidity.desc') }}
      </Text>
    </div>
  </div>
  <ConfirmModal
    :show="showConfirm"
    :price="price"
    :liquidity="liquidityMinted"
    :currencies="currencies"
    :parsedAmounts="parsedAmounts"
    :noLiquidity="noLiquidity"
    @dismiss="showConfirm = false"
    :pool-token-percentage="poolTokenPercentage"
    @mint="onMint"
  />
  <ScuccessModal :show="!!txHash" :tx="txHash" @dismiss="onReset" />
  <WaittingModal :show="attemptingTxn" :desc="summary" @dismiss="onReset" />
  <RejectedModal :show="showRejectedModal" @dismiss="onReset" />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { Token, TokenAmount } from 'l0k_swap-sdk'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'
import { Field } from '../../state/mint/types'
import CurrencyInputPanel from '../CurrencyInputPanel/index.vue'
import Button from '../Button/Button'
import Text from '../Text/Text.vue'
import PoolPriceBar from './PoolPriceBar.vue'
import ConfirmModal from './ConfirmModal.vue'
import WaittingModal from '../transaction/WaittingModal.vue'
import ScuccessModal from '../transaction/ScuccessModal.vue'
import RejectedModal from '../transaction/RejectedModal.vue'
import { AddIcon } from '../Svg'
import { useI18n } from 'vue-i18n'
import { useStarknetExecute } from '../../starknet-vue/hooks/execute'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { DEFAULT_DEADLINE_FROM_NOW } from '../../constants'
import l0k_router_abi from '../../constants/abis/l0k_router_abi.json'
import erc20 from '../../constants/abis/erc20.json'
import { Abi } from 'starknet'
import { bnToUint256 } from 'starknet/dist/utils/uint256'
import { calculateSlippageAmount, getDeadlineFromNow, getDeductGasMaxAmount } from '../../utils'
import { useUserLiquiditySlippageTolerance } from '../../state/slippageToleranceSettings/hooks'
import { ROUTER_ADDRESSES } from '../../constants/address'
import { useMintStore } from '../../state'
import { toBN } from 'starknet/utils/number'
import { useOpenWalletModal } from '../../state/modal/hooks'

export default defineComponent({
  components: {
    CurrencyInputPanel,
    AddIcon,
    Button,
    Text,
    PoolPriceBar,
    ConfirmModal,
    WaittingModal,
    ScuccessModal,
    RejectedModal,
  },
  setup() {
    const mintStore = useMintStore()
    const mintState = useMintState()

    const tokenA = computed(() => mintState.value.tokenA)
    const tokenB = computed(() => mintState.value.tokenB)

    const showConfirm = ref(false)
    const attemptingTxn = ref(false)
    const txHash = ref<string>()
    const openWalletModal = useOpenWalletModal()

    const {
      state: { chainId, account },
    } = useStarknet()
    const { t } = useI18n()
    const {
      noLiquidity,
      dependentField,
      parsedAmounts,
      currencyBalances,
      currencies,
      totalSupply,
      poolTokenPercentage,
      price,
      error,
      pair,
      liquidityMinted,
    } = useDerivedMintInfo(tokenA, tokenB)
    const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)
    const allowedSlippage = useUserLiquiditySlippageTolerance()

    const routerAddress = computed(() => chainId.value && ROUTER_ADDRESSES[chainId.value])
    const executeContractAddresses = computed(() => {
      const { [Field.CURRENCY_A]: tokenA, [Field.CURRENCY_B]: tokenB } = currencies.value
      return tokenA?.address && tokenB?.address && routerAddress.value ? [tokenA?.address, tokenB?.address, routerAddress.value] : undefined
    })

    const {
      state: executeState,
      execute: executeInvoke,
      reset: executeReset,
    } = useStarknetExecute(executeContractAddresses, [erc20 as Abi, erc20 as Abi, l0k_router_abi as Abi], ['approve', 'approve', 'addLiquidity'])

    const showRejectedModal = computed(() => !!executeState.error && executeState.error.includes('User abort'))
    const formattedAmounts = computed(() => {
      const { typedValue, independentField, otherTypedValue } = mintState.value

      return {
        [independentField]: typedValue,
        [dependentField.value]: noLiquidity.value ? otherTypedValue : parsedAmounts.value[dependentField.value]?.toSignificant(6) ?? '',
      }
    })

    const LPTotalSupply = computed(() => {
      if (noLiquidity.value) {
        return t('add_liquidity.no_liquidity')
      }
      if (totalSupply.value === null) {
        return t('loading')
      }
      return totalSupply.value ? totalSupply.value.toSignificant() : '-'
    })

    const summary = computed(() => {
      const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts.value
      return `Supplying ${currencyAAmount?.toSignificant(3)} ${currencyAAmount?.token.symbol} & ${currencyBAmount?.toSignificant(3)} ${
        currencyBAmount?.token.symbol
      } for ${liquidityMinted.value?.toSignificant(3)} LP`
    })
    const onCurrencyAMax = (maxInputAmount: TokenAmount | undefined) => {
      const amount = getDeductGasMaxAmount(maxInputAmount)
      if (amount) {
        onFieldAInput(amount.toExact())
      }
    }
    const onCurrencyBMax = (maxInputAmount: TokenAmount | undefined) => {
      const amount = getDeductGasMaxAmount(maxInputAmount)
      if (amount) {
        onFieldBInput(amount.toExact())
      }
    }
    const handleCurrencyASelect = (token: Token) => {
      mintStore.selectToken({ tokenA: token })
    }
    const handleCurrencyBSelect = (token: Token) => {
      mintStore.selectToken({ tokenB: token })
    }
    const onDeposit = () => {
      showConfirm.value = true
    }
    const onReset = () => {
      if (txHash.value) {
        onFieldAInput('')
        onFieldBInput('')
      }
      showConfirm.value = false
      attemptingTxn.value = false
      txHash.value = undefined
      executeReset()
    }
    const onMint = async () => {
      executeReset()
      showConfirm.value = false
      attemptingTxn.value = true
      const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts.value
      if (!parsedAmountA || !parsedAmountB || !routerAddress.value || !account.value) {
        return
      }
      const AAmount = bnToUint256(parsedAmountA.raw.toString())
      const BAmount = bnToUint256(parsedAmountB.raw.toString())
      const AMin = bnToUint256(toBN(calculateSlippageAmount(parsedAmountA, noLiquidity.value ? 0 : allowedSlippage.value)[0].toString()))
      const BMin = bnToUint256(toBN(calculateSlippageAmount(parsedAmountB, noLiquidity.value ? 0 : allowedSlippage.value)[0].toString()))

      const response = await executeInvoke({
        args: [
          [routerAddress.value, AAmount.low, AAmount.high],
          [routerAddress.value, BAmount.low, BAmount.high],
          [
            parsedAmountA.token.address,
            parsedAmountB.token.address,
            AAmount.low,
            AAmount.high,
            BAmount.low,
            BAmount.high,
            AMin.low,
            AMin.high,
            BMin.low,
            BMin.high,
            account.value,
            getDeadlineFromNow(DEFAULT_DEADLINE_FROM_NOW),
          ],
        ],
        metadata: {
          message: summary.value,
        },
      })
      attemptingTxn.value = false
      if (response) {
        txHash.value = response.transaction_hash
      }
    }

    return {
      tokenA,
      tokenB,
      Field,
      account,
      LPTotalSupply,
      currencies,
      formattedAmounts,
      currencyBalances,
      noLiquidity,
      poolTokenPercentage,
      price,
      error,
      pair,
      liquidityMinted,
      showConfirm,
      parsedAmounts,
      summary,
      attemptingTxn,
      txHash,
      showRejectedModal,

      t,
      onFieldAInput,
      onFieldBInput,
      handleCurrencyASelect,
      handleCurrencyBSelect,
      onDeposit,
      onMint,
      onReset,
      openWalletModal,
      onCurrencyAMax,
      onCurrencyBMax,
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/index.scss';

.l0k-swap-add-liquidity {
  .l0k-swap-add-content {
    .add-wrap {
      display: flex;
      justify-content: center;
    }

    .liquidity {
      margin-top: 8px;
      margin-bottom: 5px;
    }

    .pool-price-bar {
      margin-top: 10px;
    }

    .deposit {
      margin-top: 20px;
    }

    .desc {
      margin-top: 8px;
    }
  }
}
</style>
