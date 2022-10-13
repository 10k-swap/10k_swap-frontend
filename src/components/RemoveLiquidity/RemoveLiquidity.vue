<template>
  <div class="l0k-swap-remove-liquidity">
    <div class="content">
      <Text class="tips" :color="'description-text'" :size="'small'">
        {{ t('remove_liquidity.tips') }}
      </Text>
      <DetailedRemove :pair="pair" v-if="model === 'detailed'" @simple="model = 'simple'" />
      <SimpleRemove :pair="pair" v-if="model === 'simple'" @detailed="model = 'detailed'" />
      <div class="price-wrap">
        <Text :size="'mini'">{{ t('remove_liquidity.price') }}</Text>
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
          {{ t('remove_liquidity.your_position') }}
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
            {{ t('remove_liquidity.pool_share') }}
          </Text>
          <Text class="value" :size="'small'" :color="'description-text'"
            >{{ (poolShare?.lessThan(ONE_BIPS) ? '<0.01' : poolShare?.toFixed(2)) ?? '0' }} %
          </Text>
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
    </div>
    <div class="btns-wrapper">
      <div class="btns">
        <Button class="approve" :type="'primary'" :size="'large'" bold v-if="!account" @click="openWalletModal">
          {{ t('connect') }}
        </Button>
        <Button class="approve" v-else :disabled="!!error" :size="'large'" bold :type="'primary'" @click="onApprove">
          {{ error ? error : t('remove_liquidity.approve') }}
        </Button>
      </div>
    </div>
  </div>
  <ConfirmModal :show="showConfirm" :parsedAmounts="parsedAmounts" :prices="prices" :pair="pair" @dismiss="showConfirm = false" @burn="onBurn" />
  <WaittingModal :show="executeState.loading" :desc="summary" @dismiss="onReset" />
  <RejectedModal :show="showRejectedModal" @dismiss="onReset" />
  <ScuccessModal :show="!!txHash" :tx="txHash" @dismiss="onReset" />
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { Pair } from 'l0k_swap-sdk'
import { useDerivedBurnInfo, useBurnActionHandlers } from '../../state/burn/hooks'
import { Field } from '../../state/burn/types'
import Text from '../Text/Text.vue'
import Button from '../Button/Button'
import ConfirmModal from './ConfirmModal.vue'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { ONE_BIPS, DEFAULT_DEADLINE_FROM_NOW } from '../../constants'
import { ROUTER_ADDRESSES } from '../../constants/address'
import { useStarknetExecute } from '../../starknet-vue/hooks/execute'
import l0k_router_abi from '../../constants/abis/l0k_router_abi.json'
import erc20 from '../../constants/abis/erc20.json'
import { Abi } from 'starknet'
import { bnToUint256 } from 'starknet/dist/utils/uint256'
import WaittingModal from '../transaction/WaittingModal.vue'
import ScuccessModal from '../transaction/ScuccessModal.vue'
import RejectedModal from '../transaction/RejectedModal.vue'
import DoubleLogo from '../DoubleLogo/index.vue'
import DetailedRemove from './DetailedRemove.vue'
import SimpleRemove from './SimpleRemove.vue'
import { calculateSlippageAmount, getDeadlineFromNow } from '../../utils'
import { useUserLiquiditySlippageTolerance } from '../../state/slippageToleranceSettings/hooks'
import { toBN } from 'starknet/utils/number'
import { useOpenWalletModal } from '../../state/modal/hooks'

export default defineComponent({
  props: {
    pair: {
      type: Object as PropType<Pair | null | undefined>,
    },
  },
  components: {
    Text,
    Button,
    ConfirmModal,
    WaittingModal,
    ScuccessModal,
    RejectedModal,
    DetailedRemove,
    SimpleRemove,
    DoubleLogo,
  },
  setup(props) {
    const { pair } = toRefs(props)
    const { t } = useI18n()
    const {
      state: { account, chainId },
    } = useStarknet()
    const { onUserInput } = useBurnActionHandlers()
    const openWalletModal = useOpenWalletModal()

    const model = ref<'simple' | 'detailed'>('simple')

    const showConfirm = ref(false)
    const txHash = ref<string>()

    const allowedSlippage = useUserLiquiditySlippageTolerance()
    const { parsedAmounts, userLiquidity, error, poolShare, liquidityValueA, liquidityValueB } = useDerivedBurnInfo(pair)

    const routerAddress = computed(() => chainId.value && ROUTER_ADDRESSES[chainId.value])
    const executeContractAddresses = computed(() => {
      const liquidityTokenAddress = pair.value?.liquidityToken.address
      return liquidityTokenAddress && routerAddress.value ? [liquidityTokenAddress, routerAddress.value] : undefined
    })
    const {
      state: executeState,
      execute: executeInvoke,
      reset: executeReset,
    } = useStarknetExecute(executeContractAddresses, [erc20 as Abi, l0k_router_abi as Abi], ['approve', 'removeLiquidity'])

    const showRejectedModal = computed(() => !!executeState.error && executeState.error.includes('User abort'))

    const summary = computed(() => {
      const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts.value
      return `Removing ${currencyAAmount?.toSignificant(3)} ${currencyAAmount?.token.symbol} and ${currencyBAmount?.toSignificant(3)} ${
        currencyBAmount?.token.symbol
      } `
    })
    const prices = computed(() => {
      return [
        `1 ${pair.value?.token0.symbol} = ${pair.value?.token0Price.toSignificant(6)} ${pair.value?.token1?.symbol}`,
        `1 ${pair.value?.token1.symbol} = ${pair.value?.token1Price.toSignificant(6)} ${pair.value?.token0?.symbol}`,
      ]
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
      showConfirm.value = false
      executeReset()
      const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB, [Field.LIQUIDITY]: liquidityAmount } = parsedAmounts.value
      if (!parsedAmountA || !parsedAmountB || !liquidityAmount || !routerAddress.value || !account.value) {
        return
      }
      const LAmount = bnToUint256(liquidityAmount.raw.toString())
      const AMin = bnToUint256(toBN(calculateSlippageAmount(parsedAmountA, allowedSlippage.value)[0].toString()))
      const BMin = bnToUint256(toBN(calculateSlippageAmount(parsedAmountB, allowedSlippage.value)[0].toString()))

      const response = await executeInvoke({
        args: [
          [routerAddress.value, LAmount.low, LAmount.high],
          [
            parsedAmountA.token.address,
            parsedAmountB.token.address,
            LAmount.low,
            LAmount.high,
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
      if (response) {
        txHash.value = response.transaction_hash
      }
    }

    return {
      pair,
      Field,
      account,
      error,
      userLiquidity,
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
      model,

      t,
      onUserInput,
      openWalletModal,
      onApprove,
      onBurn,
      onReset,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index';

.l0k-swap-remove-liquidity {
  position: relative;
  padding-bottom: 60px;
  .content {
    max-height: 60vh;
    overflow-y: auto;
    &::-webkit-scrollbar {
      height: 80px;
      width: 4px;
    }
    &::-webkit-scrollbar-corner {
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: $color-bg-transparent;
      border-radius: 4px;
    }
  }
  .tips {
    margin-bottom: 8px;
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
    overflow: hidden;

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

  .btns-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    .btns {
      position: relative;
      padding-top: 10px;
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: -20px;
        right: -20px;
        border-top: 1px solid #eaeaea;
      }
    }
  }
}
</style>
