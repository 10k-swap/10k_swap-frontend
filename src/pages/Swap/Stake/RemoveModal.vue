<template>
  <Modal v-model="showModal" :title="'Remove'" :top="160">
    <div class="l0k-swap-stake-remove-modal">
      <div class="staked-card">
        <Text :size="'small'">Staked</Text>
        <div class="info">
          <div class="tokens">
            <TokenLogo class="token0" :token="pool?.token0" :size="24" />
            <TokenLogo class="token1" :token="pool?.token1" :size="24" />
            <Text size="md" bold> {{ `${pool?.token0.symbol}/${pool?.token1.symbol}` }} </Text>
          </div>
          <Text class="balance" size="md" bold> {{ userInfo?.stakedAmount.toSignificant() ?? '-' }}</Text>
        </div>
        <div class="unclaimed-reward">
          <Text :color="'secondary-text'" :size="'small'"> Unclaimed Reward: </Text>
          <div>
            <Text :size="'small'"> {{ rewardInfo?.rewardAmount.toSignificant() ?? '-' }} {{ rewardToken?.symbol }} </Text>
          </div>
        </div>
      </div>
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
      <div class="btns-wrapper">
        <div class="btns">
          <Button class="approve" :type="'primary'" :size="'large'" bold v-if="!account" @click="openWalletModal">
            {{ t('connect') }}
          </Button>
          <Button class="approve" v-else :disabled="!!error" :size="'large'" bold :type="'primary'" @click="onRemove">
            {{ error ? error : 'Remove' }}
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
import { useStarknet } from '../../../starknet-vue/providers/starknet'
import { useStakeStore } from '../../../state/stake'
import { useOpenWalletModal } from '../../../state/modal/hooks'
import { tryParseAmount } from '../../../utils/tryParseAmount'
import { useI18n } from 'vue-i18n'
import { Percent, TokenAmount } from 'l0k_swap-sdk'
import { STAKE_REWARD_TOKEN } from '../../../constants/stake'
import { useUserPoolInfo, useUserRewardInfo } from '../../../data/Stake'
import WaittingModal from '../../../components/transaction/WaittingModal.vue'
import RejectedModal from '../../../components/transaction/RejectedModal.vue'
import ScuccessModal from '../../../components/transaction/ScuccessModal.vue'
import { STAKE_ADDRESSES } from '../../../constants/address'
import { useStarknetExecute } from '../../../starknet-vue/hooks/execute'
import { Abi, uint256 } from 'starknet5'
import l0k_master_abi from '../../../constants/abis/l0k_master_abi.json'

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
      get: () => store.showRemoveModal,
      set(newValue) {
        store.toggleRemoveModal(newValue)
      },
    })

    const LP = computed(() => pool.value?.lpToken)
    const typedValue = ref('')
    const parsedAmount = computed(() => tryParseAmount(typedValue.value, LP.value ?? undefined))
    const openWalletModal = useOpenWalletModal()

    const userInfo = useUserPoolInfo(pool)
    const rewardInfo = useUserRewardInfo(pool)

    const rewardToken = computed(() => chainId.value && STAKE_REWARD_TOKEN[chainId.value])

    const error = ref<string | undefined>()
    const checkError = () => {
      error.value = undefined

      if (!account.value) {
        error.value = 'Connect Wallet'
      }

      if (!parsedAmount.value) {
        error.value = error.value ?? 'Enter an amount'
      }

      if (userInfo.value && parsedAmount.value && userInfo.value.stakedAmount.lessThan(parsedAmount.value)) {
        error.value = error.value ?? `Insufficient balance`
      }
    }

    watch([account, parsedAmount], checkError)
    onMounted(checkError)

    const showConfirm = ref(false)
    const txHash = ref<string>()

    const stakeAddress = computed(() => chainId.value && STAKE_ADDRESSES[chainId.value])
    const executeContractAddresses = computed(() => {
      return stakeAddress.value ? [stakeAddress.value] : undefined
    })
    const showRejectedModal = computed(() => !!executeState.error && executeState.error.includes('User abort'))

    const {
      state: executeState,
      execute: executeInvoke,
      reset: executeReset,
    } = useStarknetExecute(executeContractAddresses, [l0k_master_abi as Abi], ['withdraw'])

    const summary = computed(() => {
      return `Unstaked ${parsedAmount.value?.toSignificant(3)} ${parsedAmount.value?.token.symbol}`
    })

    const onInput = (e: InputEvent) => {
      const nextUserInput = (e.target as HTMLInputElement).value.replace(/,/g, '.') ?? ''

      if (!new RegExp(/^[0-9]*[.,]?[0-9]*$/).test(nextUserInput) && nextUserInput !== '') {
        ;(e.target as HTMLInputElement).value = ''
        typedValue.value = ''
        return
      }

      typedValue.value = nextUserInput
    }

    const onMax = () => {
      typedValue.value = userInfo.value?.stakedAmount?.toExact() ?? ''
    }
    const onRangeClick = (range: number) => {
      const percent = new Percent(range.toString(), '100')

      if (userInfo.value) {
        const amount = new TokenAmount(userInfo.value?.stakedAmount.token, percent.multiply(userInfo.value?.stakedAmount.raw).quotient)
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

    const onRemove = async () => {
      showConfirm.value = false
      executeReset()
      if (!pool.value || !parsedAmount.value || !stakeAddress.value || !account.value) {
        return
      }

      const RAmount = uint256.bnToUint256(parsedAmount.value.raw.toString())
      const pId = uint256.bnToUint256(pool.value.poolId)

      const response = await executeInvoke({
        args: [[pId.low, pId.high, RAmount.low, RAmount.high]],
        metadata: {
          message: `Unstaked ${parsedAmount.value?.toSignificant(3)} ${parsedAmount.value.token.symbol}`,
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
      userInfo,
      typedValue,
      rewardToken,
      rewardInfo,

      executeState,
      txHash,
      summary,
      showRejectedModal,

      onInput,
      openWalletModal,
      onRemove,
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

.l0k-swap-stake-remove-modal {
  position: relative;
  padding-bottom: 70px;
  .staked-card {
    background: $color-bg-streak;
    border-radius: 20px;
    padding: 15px;
    .info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;
      .tokens {
        display: flex;
        margin-top: 5px;
        .token0 {
          margin-right: 5px;
        }
        .token1 {
          margin-right: 5px;
        }
      }
    }
    .unclaimed-reward {
      display: flex;
      align-items: center;
      justify-content: space-between;
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
