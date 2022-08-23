<template>
  <div class="l0k-swap-remove-liqiudit">
    <Text class="tips" :color="'description-text'" :size="'small'">
      {{ t('remove_liqiudit.tips') }}
    </Text>
    <CurrencyInputPanel :selector="false" size="small" :token="pair?.liquidityToken"
      :value="formattedAmounts[Field.LIQUIDITY]" :currencyBalance="userLiquidity"
      @input="onUserInput(Field.LIQUIDITY, $event)">
      <template v-slot:token>
        <DoubleLogo :token0="pair?.token0" :token1="pair?.token1" />
        <Text class="symbol" bold> {{ pair?.token0.symbol + '-' + pair?.token1.symbol }} </Text>
      </template>
    </CurrencyInputPanel>
    <div class="icon-wrap">
      <DownIcon :width="'10px'" :color="'minor'" />
    </div>
    <CurrencyInputPanel size="small" :selector="false" :token="pair?.token0" :currencyBalance="token0Balance"
      :value="formattedAmounts[Field.CURRENCY_A]" @input="onUserInput(Field.CURRENCY_A, $event)" />
    <div class="icon-wrap">
      <AddIcon :width="'10px'" :color="'minor'" />
    </div>
    <CurrencyInputPanel size="small" :selector="false" :token="pair?.token1" :currencyBalance="token1Balance"
      :value="formattedAmounts[Field.CURRENCY_B]" @input="onUserInput(Field.CURRENCY_B, $event)" />
    <div class="price-wrap">
      <Text :size="'mini'">{{ t('remove_liqiudit.price') }}</Text>
      <div class="price">
        <Text :size="'mini'" :color="'description-text'">
          {{ prices[0] }}
        </Text>
        <Text :size="'mini'" :color="'description-text'">
          {{ prices[1] }}
        </Text>
      </div>
    </div>
    <div class="position">
      <Text :size="'small'">
        {{ t('remove_liqiudit.your_position') }}
      </Text>
      <div class="cell LP">
        <div class="label">
          <DoubleLogo :token0="pair?.token0" :token1="pair?.token1" />
          <Text class="symbols" bold :size="'md'"> {{ pair?.token0.symbol + '-' + pair?.token1.symbol }} </Text>
        </div>
        <Text class="value" bold :size="'md'">
          {{ userLiquidity?.toSignificant() }}
        </Text>
      </div>
      <div class="cell">
        <Text class="label" :size="'small'">
          {{ t('remove_liqiudit.pool_share') }}
        </Text>
        <Text class="value" :size="'small'" :color="'description-text'">{{ (poolShare?.lessThan(ONE_BIPS) ? '<0.01' :
            poolShare?.toFixed(2)) ?? '0'
        }} % </Text>
      </div>
      <div class="cell">
        <Text class="label" :size="'small'">
          {{ pair?.token0.symbol }}
        </Text>
        <Text class="value" :size="'small'" :color="'description-text'">
          {{ liquidityValueA?.toSignificant() }}
        </Text>
      </div>
      <div class="cell">
        <Text class="label" :size="'small'">
          {{ pair?.token1.symbol }}
        </Text>
        <Text class="value" :size="'small'" :color="'description-text'">
          {{ liquidityValueB?.toSignificant() }}
        </Text>
      </div>
    </div>
    <Button class="approve" :type="'primary'" :size="'large'" v-if="!account" @click="onConnect">
      {{ t('connect') }}
    </Button>
    <Button class="approve" v-else :disabled="!!error" :size="'large'" :type="'primary'" @click="onApprove">
      {{ error ? error : t('remove_liqiudit.approve') }}
    </Button>
  </div>
  <ConfirmModal :show="showConfirm" :parsedAmounts="parsedAmounts" :prices="prices" :pair="pair"
    @dismiss="showConfirm = false" @burn="onBurn" />
  <WaittingModal :show="executeState.loading" :desc="summary" @click="onReset" />
  <RejectedModal :show="showRejectedModal" @dismiss="onReset" />
  <ScuccessModal :show="!!txHash" :tx="txHash" @dismiss="onReset" />
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { Pair } from '../../sdk'
import { useBurnState, useDerivedBurnInfo, useBurnActionHandlers } from '../../state/burn/hooks'
import { Field } from '../../state/burn/types'
import Text from '../Text/Text.vue'
import Button from '../Button/Button'
import DoubleLogo from '../DoubleLogo/index.vue'
import ConfirmModal from './ConfirmModal.vue'
import { DownIcon, AddIcon } from '../Svg'
import CurrencyInputPanel from '../CurrencyInputPanel/index.vue'
import { useTokenBalances } from '../../hooks/Balances'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import useConnector from '../../hooks/useConnector'
import { INITIAL_ALLOWED_SLIPPAGE, ONE_BIPS } from '../../constants'
import { ROUTER_ADDRESSES } from '../../constants/address'
import { useStarknetExecute } from '../../starknet-vue/hooks/execute'
import l0k_router_abi from '../../constants/abis/l0k_router_abi.json'
import erc20 from '../../constants/abis/erc20.json'
import { Abi } from 'starknet'
import { bnToUint256 } from 'starknet/dist/utils/uint256'
import WaittingModal from '../transaction/WaittingModal.vue'
import ScuccessModal from '../transaction/ScuccessModal.vue'
import RejectedModal from '../transaction/RejectedModal.vue'
import { calculateSlippageAmount, getDeadlineFromNow } from '../../utils'
import { useUserLiqiuditSlippageTolerance } from '../../state/slippageToleranceSettings/hooks'

export default defineComponent({
  props: {
    pair: Object as PropType<Pair>
  },
  components: {
    Text,
    CurrencyInputPanel,
    DoubleLogo,
    DownIcon,
    AddIcon,
    Button,
    ConfirmModal,
    WaittingModal,
    ScuccessModal,
    RejectedModal
  },
  setup(props) {
    const { pair } = toRefs(props)
    const { t } = useI18n()
    const { state: { account, chainId } } = useStarknet()
    const { onUserInput } = useBurnActionHandlers()
    const { onConnect } = useConnector()
    const { parsedAmounts, error, userLiquidity, poolShare, liquidityValueB, liquidityValueA } = useDerivedBurnInfo(pair)

    const showConfirm = ref(false)
    const txHash = ref<string>()

    const burnState = useBurnState()
    const independentField = computed(() => burnState.value.independentField)
    const typedValue = computed(() => burnState.value.typedValue)
    const token0 = computed(() => pair.value?.token0)
    const token1 = computed(() => pair.value?.token1)
    const token0Balance = useTokenBalances(account, token0)
    const token1Balance = useTokenBalances(account, token1)
    const allowedSlippage = useUserLiqiuditSlippageTolerance()

    const routerAddress = computed(() => chainId.value && ROUTER_ADDRESSES[chainId.value])
    const executeContractAddresses = computed(() => {
      const liquidityTokenAddress = pair.value?.liquidityToken.address
      return liquidityTokenAddress && routerAddress.value ? [liquidityTokenAddress, routerAddress.value] : undefined
    })
    const {
      state: executeState,
      execute: executeInvoke,
      reset: executeReset,
    } = useStarknetExecute(executeContractAddresses, [erc20 as Abi, erc20 as Abi, l0k_router_abi as Abi], ['approve', 'removeLiquidity'])

    const showRejectedModal = computed(() => !!executeState.error && executeState.error.includes('User abort'))

    const formattedAmounts = computed(() => ({
      [Field.LIQUIDITY]:
        independentField.value === Field.LIQUIDITY ? typedValue.value : parsedAmounts.value[Field.LIQUIDITY]?.toSignificant(6) ?? '',
      [Field.CURRENCY_A]:
        independentField.value === Field.CURRENCY_A ? typedValue.value : parsedAmounts.value[Field.CURRENCY_A]?.toSignificant(6) ?? '',
      [Field.CURRENCY_B]:
        independentField.value === Field.CURRENCY_B ? typedValue.value : parsedAmounts.value[Field.CURRENCY_B]?.toSignificant(6) ?? '',
    }))

    const summary = computed(() => {
      const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts.value
      return `Removing ${currencyAAmount?.toSignificant(3)} ${currencyAAmount?.token.symbol} and ${currencyBAmount?.toSignificant(3)} ${currencyBAmount?.token.symbol} `
    })

    // todo:wait check
    const prices = computed(() => {
      return [`1 ${pair.value?.token0.symbol} = ${pair.value?.token0Price.toSignificant(6)} ${pair.value?.token1?.symbol}`, `1 ${pair.value?.token1.symbol} = ${pair.value?.token1Price.toSignificant(6)} ${pair.value?.token0?.symbol}`]
    })

    const onReset = () => {
      if (txHash.value) {
        onUserInput(Field.LIQUIDITY, '')
      }
      showConfirm.value = false
      txHash.value = undefined
      executeReset()
    }

    const onApprove = () => {
      showConfirm.value = true
    }

    const onBurn = async () => {
      executeReset()
      const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB, [Field.LIQUIDITY]: liquidityAmount } = parsedAmounts.value
      if (!parsedAmountA || !parsedAmountB || !liquidityAmount || !routerAddress.value || !account.value) {
        return
      }
      const LAmount = bnToUint256(liquidityAmount.raw.toString())
      const AMin = bnToUint256(calculateSlippageAmount(parsedAmountA, allowedSlippage.value)[0])
      const BMin = bnToUint256(calculateSlippageAmount(parsedAmountB, allowedSlippage.value)[0])

      const response = await executeInvoke({
        args: [
          [routerAddress.value, LAmount.low, LAmount.high],
          [
            parsedAmountA.token.address,
            parsedAmountB.token.address,
            LAmount.low, LAmount.high,
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
      formattedAmounts,
      userLiquidity,
      pair,
      Field,
      token0Balance,
      token1Balance,
      account,
      error,
      prices,
      poolShare,
      ONE_BIPS,
      liquidityValueA,
      liquidityValueB,
      showConfirm,
      parsedAmounts,
      executeState,
      summary,
      showRejectedModal,
      txHash,

      t,
      onUserInput,
      onConnect,
      onApprove,
      onBurn,
      onReset
    }
  },
})
</script>


<style lang="scss" scoped>
@import '../../styles/index';

.l0k-swap-remove-liqiudit {
  .tips {
    margin-bottom: 8px;
  }

  .icon-wrap {
    display: flex;
    justify-content: center;
  }

  .price-wrap {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
  }

  .position {
    padding: 16px;
    background: $color-bg-secondary;
    border-radius: 20px;
    margin: 12px 0;

    .cell {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .LP {
      margin-top: 8px;
      margin-bottom: 16px;

      .label {
        display: flex;
        align-items: center;

        .symbols {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>