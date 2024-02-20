<template>
  <Modal v-model="showModal" :title="'Add'" :top="160">
    <div class="l0k-swap-stake-add-modal">
      <div class="info">
        <Text class="balance" size="large" bold> {{ LPBalances?.toSignificant() ?? '-' }}</Text>
        <TokenLogo class="token0" :token="pool?.token0" :size="24" />
        <TokenLogo class="token1" :token="pool?.token1" :size="24" />
      </div>
      <Text :color="'secondary-text'"> {{ `${pool?.token0.symbol}/${pool?.token1.symbol}` }} Pool Tokens </Text>
      <div class="head">
        <Text :size="'small'">Amount</Text>
        <div class="ranges">
          <span v-for="item in [25, 50, 75, 100]" :key="item" @click="onRangeClick(item)">{{ item }}% </span>
        </div>
      </div>
      <div class="input">
        <input type="text" :value="typedValue" @input="onInput" placeholder="0.0" pattern="^[0-9]*[.,]?[0-9]*$" />
        <span class="max" @click="onMax">Max</span>
      </div>
      <div class="estimate-pool-share">
        <Text :size="'small'">Estimate Pool Share</Text>
        <Text :size="'small'">{{ estimatePoolShare?.toSignificant(2) ?? '-' }} %</Text>
      </div>
      <div class="btns-wrapper">
        <div class="btns">
          <Button class="approve" :type="'primary'" :size="'large'" bold v-if="!account" @click="openWalletModal">
            {{ t('connect') }}
          </Button>
          <Button class="approve" v-else :disabled="!!error" :size="'large'" bold :type="'primary'" @click="onAdd">
            {{ error ? error : 'Add' }}
          </Button>
        </div>
      </div>
    </div>
  </Modal>
  <WaittingModal :show="executeState.loading" :desc="summary" @dismiss="onReset" />
  <RejectedModal :show="showRejectedModal" @dismiss="onReset" />
  <ScuccessModal :show="!!txHash" :tx="txHash" @dismiss="onReset" />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import Modal from '../../../components/Modal/Modal.vue'
import Text from '../../../components/Text/Text.vue'
import Button from '../../../components/Button/Button'
import TokenLogo from '../../../components/TokenLogo/TokenLogo'
import { useTokenBalances } from '../../../hooks/Balances'
import { useStarknet } from '../../../starknet-vue/providers/starknet'
import { useStakeStore } from '../../../state/stake'
import { useOpenWalletModal } from '../../../state/modal/hooks'
import { tryParseAmount } from '../../../utils/tryParseAmount'
import { useI18n } from 'vue-i18n'
import { JSBI, Percent, TokenAmount } from 'l0k_swap-sdk'
import { usePoolInfo, useUserPoolInfo } from '../../../data/Stake'
import WaittingModal from '../../../components/transaction/WaittingModal.vue'
import RejectedModal from '../../../components/transaction/RejectedModal.vue'
import ScuccessModal from '../../../components/transaction/ScuccessModal.vue'
import { STAKE_ADDRESSES } from '../../../constants/address'
import { useStarknetExecute } from '../../../starknet-vue/hooks/execute'
import l0k_master_abi from '../../../constants/abis/l0k_master_abi.json'
import erc20 from '../../../constants/abis/erc20.json'
import { Abi, uint256 } from 'starknet5'

export default defineComponent({
  components: {
    Modal,
    Text,
    TokenLogo,
    Button,
    WaittingModal,
    RejectedModal,
    ScuccessModal,
  },
  setup() {
    const {
      state: { account, chainId },
    } = useStarknet()
    const { t } = useI18n()

    const store = useStakeStore()
    const pool = computed(() => store.selectPool)
    const showModal = computed({
      get: () => store.showAddModal,
      set(newValue) {
        store.toggleAddModal(newValue)
      },
    })

    const LP = computed(() => pool.value?.lpToken)
    const typedValue = ref('')
    const parsedAmount = computed(() => tryParseAmount(typedValue.value, LP.value ?? undefined))
    const LPBalances = useTokenBalances(account, LP)
    const openWalletModal = useOpenWalletModal()

    const poolInfo = usePoolInfo(pool)
    const userInfo = useUserPoolInfo(pool)

    const showConfirm = ref(false)
    const txHash = ref<string>()

    const stakeAddress = computed(() => chainId.value && STAKE_ADDRESSES[chainId.value])
    const executeContractAddresses = computed(() => {
      const liquidityTokenAddress = pool.value?.lpToken.address
      return liquidityTokenAddress && stakeAddress.value ? [liquidityTokenAddress, stakeAddress.value] : undefined
    })
    const showRejectedModal = computed(() => !!executeState.error && executeState.error.includes('User abort'))

    const {
      state: executeState,
      execute: executeInvoke,
      reset: executeReset,
    } = useStarknetExecute(executeContractAddresses, [erc20 as Abi, l0k_master_abi as Abi], ['approve', 'deposit'])

    const summary = computed(() => {
      return `Staked ${parsedAmount.value?.toSignificant(3)} ${parsedAmount.value?.token.symbol}`
    })

    const estimatePoolShare = computed(() => {
      return userInfo.value && parsedAmount.value && poolInfo.value
        ? new Percent(
            JSBI.add(parsedAmount.value.raw, userInfo.value.stakedAmount.raw),
            JSBI.add(poolInfo.value?.lp_tokens.raw, parsedAmount.value.raw)
          )
        : undefined
    })

    const error = ref<string | undefined>()
    const checkError = () => {
      error.value = undefined

      if (!account.value) {
        error.value = 'Connect Wallet'
      }

      if (!parsedAmount.value) {
        error.value = error.value ?? 'Enter an amount'
      }

      if (LPBalances.value && parsedAmount.value && LPBalances.value.lessThan(parsedAmount.value)) {
        error.value = error.value ?? `Insufficient LP balance`
      }
    }

    watch([account, parsedAmount], checkError)
    onMounted(checkError)

    const onInput = (e: any) => {
      const nextUserInput = (e.target as HTMLInputElement).value.replace(/,/g, '.') ?? ''

      if (!new RegExp(/^[0-9]*[.,]?[0-9]*$/).test(nextUserInput) && nextUserInput !== '') {
        ;(e.target as HTMLInputElement).value = ''
        typedValue.value = ''
        return
      }

      typedValue.value = nextUserInput
    }

    const onMax = () => {
      typedValue.value = LPBalances.value?.toExact() ?? ''
    }
    const onRangeClick = (range: number) => {
      const percent = new Percent(range.toString(), '100')

      if (LPBalances.value) {
        const amount = new TokenAmount(LPBalances.value.token, percent.multiply(LPBalances.value.raw).quotient)
        typedValue.value = amount.toExact()
      }
    }

    const onReset = () => {
      if (txHash.value) {
        typedValue.value = ''
      }
      showConfirm.value = false
      txHash.value = undefined
      executeReset()
    }

    const onAdd = async () => {
      showConfirm.value = false
      executeReset()
      if (!pool.value || !parsedAmount.value || !stakeAddress.value || !account.value) {
        return
      }
      const LAmount = uint256.bnToUint256(parsedAmount.value.raw.toString())
      const pId = uint256.bnToUint256(pool.value.poolId)

      const response = await executeInvoke({
        args: [
          [stakeAddress.value, LAmount.low, LAmount.high],
          [pId.low, pId.high, LAmount.low, LAmount.high],
        ],
        metadata: {
          message: `Staked ${parsedAmount.value?.toSignificant(3)} ${parsedAmount.value.token.symbol}`,
        },
      })
      if (response) {
        txHash.value = response.transaction_hash
      }
    }

    return {
      account,
      pool,
      error,
      showModal,
      LPBalances,
      typedValue,
      estimatePoolShare,
      executeState,
      txHash,
      summary,
      showRejectedModal,

      onInput,
      openWalletModal,
      onAdd,
      onMax,
      onRangeClick,
      t,
      onReset,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../../styles/index.scss';

.l0k-swap-stake-add-modal {
  position: relative;
  padding-bottom: 60px;
  .info {
    display: flex;
    align-items: center;
    .balance {
      margin-right: 14px;
    }
    .token0 {
      margin-right: 5px;
    }
  }
  .head {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    margin-bottom: 10px;
    .ranges {
      display: flex;
      justify-content: space-between;
      span {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 33px;
        height: 18px;
        background: $color-primary;
        border-radius: 50px;
        font-size: $font-size-mini;
        color: $color-white;
        cursor: pointer;
        margin-left: 5px;
      }
    }
  }
  .input {
    background: $color-bg-secondary;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    padding: 0 15px;
    border-radius: 8px;

    input {
      width: 100%;
      background: transparent;
      border: 0;
      font-weight: 700;
      font-size: 28px;
      margin-right: 10px;
      outline: none;

      &::placeholder {
        color: rgba($color: $color-transparent-text, $alpha: 1);
      }

      &:hover {
        border: 0;
      }
    }
    .max {
      color: $color-blue;
      cursor: pointer;
    }
  }
  .estimate-pool-share {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }

  .btns-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    .btns {
      position: relative;
      padding-top: 10px;
    }
  }
}
</style>
