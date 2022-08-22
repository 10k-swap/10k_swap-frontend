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
      <Button class="deposit" :disabled="!!error" :size="'large'" :type="'primary'" @click="onDeposit">
        {{ error ? error : t('add_liqiudit.deposit') }}
      </Button>
      <Text class="desc" :size="'mini'" :color="'description-text'">
        {{ t('add_liqiudit.desc') }}
      </Text>
    </div>
  </div>
  <ConfirmModal :show="showConfirm" :price="price" :liquidity="liquidityMinted" :currencies="currencies"
    :parsedAmounts="parsedAmounts" :noLiquidity="noLiquidity" @dismiss="showConfirm = false" @mint="onMint" />
  <WaittingModal :show="executeState.loading" :desc="summary" @click="onReset"/>
  <RejectedModal :show="showRejectedModal" @dismiss="onReset" />
  <ScuccessModal :show="!!txHash" :tx="txHash" @dismiss="onReset" />
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
import ConfirmModal from './ConfirmModal.vue'
import WaittingModal from '../transaction/WaittingModal.vue'
import ScuccessModal from '../transaction/ScuccessModal.vue'
import RejectedModal from '../transaction/RejectedModal.vue'
import { AddIcon } from '../Svg'
import { useI18n } from 'vue-i18n'
import { useStarknetExecute } from '../../starknet-vue/hooks/execute'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { INITIAL_ALLOWED_SLIPPAGE } from '../../constants'
import l0k_router_abi from '../../constants/abis/l0k_router_abi.json'
import erc20 from '../../constants/abis/erc20.json'
import { Abi } from 'starknet'
import { bnToUint256 } from 'starknet/dist/utils/uint256'
import { calculateSlippageAmount, getDeadlineFromNow } from '../../utils'
import { useUserAddLiqiuditSlippageTolerance } from '../../state/slippageToleranceSettings/hooks'
import { ROUTER_ADDRESSES } from '../../constants/address'

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
    RejectedModal
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

    const showConfirm = ref(false)
    const txHash = ref<string>()

    const { state: { chainId, account } } = useStarknet()
    const { t } = useI18n()
    const { noLiquidity, dependentField, parsedAmounts, currencyBalances, currencies, totalSupply, poolTokenPercentage, price, error, pair, liquidityMinted } = useDerivedMintInfo(tokenA, tokenB)
    const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)
    const mintState = useMintState()
    const allowedSlippage = useUserAddLiqiuditSlippageTolerance()

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
        return t('add_liqiudit.no_liqiudity')
      }
      if (totalSupply.value === null) {
        return t('loading')
      }
      return totalSupply.value ? totalSupply.value.toSignificant() : '-'
    })

    const summary = computed(() => {
      const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts.value
      return `Supplying ${currencyAAmount?.toSignificant(3)} ${currencyAAmount?.token.symbol} & ${currencyBAmount?.toSignificant(3)} ${currencyAAmount?.token.symbol} for ${liquidityMinted.value?.toSignificant(3)} LP`
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
    const onDeposit = () => {
      showConfirm.value = true
    }
    const onReset = () => {
      if (txHash.value) {
        onFieldAInput('')
        onFieldBInput('')
      }
      showConfirm.value = false
      txHash.value = undefined
      executeReset()
    }
    const onMint = async () => {
      executeReset()
      const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts.value
      if (!parsedAmountA || !parsedAmountB || !routerAddress.value || !account.value) {
        return
      }
      const AAmount = bnToUint256(parsedAmountA.raw.toString())
      const BAmount = bnToUint256(parsedAmountB.raw.toString())
      const AMin = bnToUint256(calculateSlippageAmount(parsedAmountA, noLiquidity.value ? 0 : allowedSlippage.value)[0])
      const BMin = bnToUint256(calculateSlippageAmount(parsedAmountB, noLiquidity.value ? 0 : allowedSlippage.value)[0])

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
            getDeadlineFromNow(INITIAL_ALLOWED_SLIPPAGE),
          ]
        ],
        metadata: {
          message: summary.value
        }
      })
      if (response) {
        txHash.value = response.transaction_hash
      }
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
      error,
      pair,
      liquidityMinted,
      showConfirm,
      parsedAmounts,
      summary,
      executeState,
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

    .deposit {
      margin-top: 20px;
    }

    .desc {
      margin-top: 8px;
    }
  }
}
</style>