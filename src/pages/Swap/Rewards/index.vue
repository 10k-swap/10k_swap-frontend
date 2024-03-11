<template>
  <div class="l0k-swap-rewards">
    <div class="rewards-title">
      <h1>Starknet DeFi Spring 🌱</h1>
      <div class="rewards-title_40m">🎉 40M&nbsp;<StarknetIcon width="36" heigth="36" />&nbsp;STRK</div>
      <span class="l0k-swap-text--secondary-text">
        10KSwap Protocol users will receive STRK incentives as part of the Starknet DeFi Spring Program.
      </span>
    </div>

    <div class="pairs-title">
      <h2>Participate</h2>
      <span class="l0k-swap-text--secondary-text"
        >These are the pools that participate in the Incentive.
        <a class="l0k-swap-text--g-blue" target="_blank" href="https://10kx-docs.gitbook.io/10kswap/activities/starknet-defi-spring"
          >Read more</a
        ></span
      >
    </div>
    <div class="pairs">
      <div class="pairs-item" v-for="pair in filterPairs" :key="pair.pairAddress" @click="onClickPair()">
        <div class="pairs-item_title">
          <DoubleLogo :token0="pair.token0" :token1="pair.token1" :size="20" :coverage="isMobile" />
          <Text :size="isMobile ? 'mini' : 'small'"> {{ pair.token0.symbol }} - {{ pair.token1.symbol }} </Text>
          <Text :size="'mini'" :color="'secondary-text'"> {{ pair.APR || '-' }}% APR</Text>
        </div>
      </div>
    </div>

    <div class="claims">
      <h2>Claim rewards STRK</h2>
      <div class="illustrate">
        <ul>
          <li>Larger positions earn a larger share of incentives, all else equal.</li>
          <li>The longer you hold a position, the more rewards you get (during the event).</li>
          <li>If the reward is too low, you can accumulate it and claim the rewards together in the next round.</li>
          <li>
            ⚠️ When using the ArgentX wallet to make a claim, a warning will appear. We are reaching out to ArgentX to address this issue, which will
            not affect the claim reward.
          </li>
        </ul>
      </div>
      <div class="claim-content">
        <div class="claim-content--item">
          <Text :color="'secondary-text'">Round 02/22 - 03/07 claimable:</Text>&nbsp;
          <div v-if="!rewardsLoading">
            {{ rewardsCalldataAmountSTRK.toFixed(3) }}
            STRK<Text size="mini" v-if="rewardsClaimed > 0">&nbsp;(claimed: {{ rewardsClaimed.toFixed(3) }})</Text>&nbsp;<StarknetIcon
              width="18"
              heigth="18"
            />
          </div>
          <span v-else>Loading...</span>
          <Button
            class="button"
            :type="'primary'"
            :size="'small'"
            bold
            @click="onClickClaim"
            :disabled="claiming || rewardsLoading || rewardsCalldataAmountSTRK <= 0 || rewardsCalldataAmountSTRK <= rewardsClaimed"
            >{{ claimButtonText }}</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatEther } from '@ethersproject/units'
import { StarknetChainId } from 'l0k_swap-sdk'
import { cloneDeep } from 'lodash'
import { computed, defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Button from '../../../components/Button/Button'
import DoubleLogo from '../../../components/DoubleLogo/index.vue'
import { StarknetIcon } from '../../../components/Svg/index'
import Text from '../../../components/Text/Text.vue'
import useIsMobile from '../../../hooks/useIsMobile'
import { getCalldata } from '../../../server/defispring'
import { useStarknet } from '../../../starknet-vue/providers/starknet'
import { useOpenWalletModal } from '../../../state/modal/hooks'
import { useAllPairs } from '../../../state/pool/hooks'
import { useStarknetExecute } from '../../../starknet-vue/hooks/execute'
import { DEFISPRING_DISTRIBUTOR_ADDRESSES } from '../../../constants/address'
import distributorAbi from '../../../constants/abis/distributor.json'
import { Abi, Contract, num } from 'starknet5'
import { getRpcProvider } from '../../../utils/getRpcProvider'
import { sleep } from '../../../utils'

async function getAmountAlreadyClaimed(claimee: string, tryCount = 3): Promise<bigint> {
  const contract = new Contract(
    distributorAbi as Abi,
    DEFISPRING_DISTRIBUTOR_ADDRESSES.SN_MAIN,
    getRpcProvider(StarknetChainId.MAINNET, { default: true })
  )
  try {
    if (!claimee) return 0n

    const data = await contract.call('amount_already_claimed', [claimee])
    return num.toBigInt(data + '')
  } catch (error) {
    if (tryCount > 1) {
      await sleep(200)
      return await getAmountAlreadyClaimed(claimee, (tryCount -= 1))
    }

    return 0n
  }
}

export default defineComponent({
  components: {
    Text,
    DoubleLogo,
    StarknetIcon,
    Button,
  },
  setup() {
    const { t } = useI18n()

    const router = useRouter()
    const isMobile = useIsMobile()
    const {
      state: { account, chainId },
    } = useStarknet()
    const openWalletModal = useOpenWalletModal()

    const claiming = ref(false)
    const rewardsLoading = ref(false)
    const rewardsCalldata = ref<{ amount: string; proof: string[] }>({ amount: '', proof: [] })
    const rewardsClaimed = ref(0)
    const rewardsCalldataAmountSTRK = computed(() => parseFloat(formatEther(rewardsCalldata.value.amount)))

    const executeContractAddresses = computed(() => [DEFISPRING_DISTRIBUTOR_ADDRESSES.SN_MAIN])
    const {
      // state: executeState,
      execute: executeInvoke,
      reset: executeReset,
    } = useStarknetExecute(executeContractAddresses, [distributorAbi as Abi], ['claim'])

    const [pairs, loadingPairs] = useAllPairs()

    const filterPairs = computed(() =>
      cloneDeep(
        pairs.value?.length > 0
          ? pairs.value
          : // Default data
            JSON.parse(
              '[{"token0":{"decimals":18,"symbol":"STRK","name":"Starknet Token","chainId":"SN_MAIN","address":"0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"},"token1":{"decimals":18,"symbol":"ETH","name":"Ether","chainId":"SN_MAIN","address":"0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"},"pairAddress":"0x4ad445ffb6294d1394b3f6a5610642d37c702eaaa47346b680c6af2f102192e","totalSupply":{"numerator":[54726931,661485392,1824],"denominator":[660865024,931322574],"token":{"decimals":18,"symbol":"10k Swap LP","name":"10k Swap","chainId":"SN_MAIN","address":"0x04ad445ffb6294d1394b3f6a5610642d37c702eaaa47346b680c6af2f102192e"}},"decimals":18,"reserve0":"0x12282a3ed34271b141d2","reserve1":"0x2f9b38fbcab6300b5","liquidity":429080.9248817572,"APR":"","fee24h":"343.81180443479417","strkPrice":"2.5022","lastUpdatedTime":"2024-03-06T20:23:32.641Z","pair":{"liquidityToken":{"decimals":18,"symbol":"10k Swap LP","name":"10k Swap","chainId":"SN_MAIN","address":"0x04ad445ffb6294d1394b3f6a5610642d37c702eaaa47346b680c6af2f102192e"},"tokenAmounts":[{"numerator":[833700306,687557897,74370],"denominator":[660865024,931322574],"token":{"decimals":18,"symbol":"STRK","name":"Starknet Token","chainId":"SN_MAIN","address":"0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"}},{"numerator":[727908533,651050738,47],"denominator":[660865024,931322574],"token":{"decimals":18,"symbol":"ETH","name":"Ether","chainId":"SN_MAIN","address":"0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"}}]}},{"token0":{"decimals":18,"symbol":"STRK","name":"Starknet Token","chainId":"SN_MAIN","address":"0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"},"token1":{"decimals":6,"symbol":"USDC","name":"USD Coin","chainId":"SN_MAIN","address":"0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8"},"pairAddress":"0x66733193503019e4e9472f598ff32f15951a0ddb8fb5001f0beaa8bd1fb6840","totalSupply":{"numerator":[956590506,57049852],"denominator":[660865024,931322574],"token":{"decimals":18,"symbol":"10k Swap LP","name":"10k Swap","chainId":"SN_MAIN","address":"0x066733193503019e4e9472f598ff32f15951a0ddb8fb5001f0beaa8bd1fb6840"}},"decimals":18,"reserve0":"0x86b36e3c81d237b9518","reserve1":"0x16db0eb2db","liquidity":198019.5625371614,"APR":"","fee24h":"132.63653700359527","strkPrice":"2.5022","lastUpdatedTime":"2024-03-06T20:23:31.522Z","pair":{"liquidityToken":{"decimals":18,"symbol":"10k Swap LP","name":"10k Swap","chainId":"SN_MAIN","address":"0x066733193503019e4e9472f598ff32f15951a0ddb8fb5001f0beaa8bd1fb6840"},"tokenAmounts":[{"numerator":[595301656,462364788,34483],"denominator":[660865024,931322574],"token":{"decimals":18,"symbol":"STRK","name":"Starknet Token","chainId":"SN_MAIN","address":"0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"}},{"numerator":[453948123,91],"denominator":[1000000],"token":{"decimals":6,"symbol":"USDC","name":"USD Coin","chainId":"SN_MAIN","address":"0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8"}}]}},{"token0":{"decimals":18,"symbol":"ETH","name":"Ether","chainId":"SN_MAIN","address":"0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"},"token1":{"decimals":6,"symbol":"USDC","name":"USD Coin","chainId":"SN_MAIN","address":"0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8"},"pairAddress":"0x23c72abdf49dffc85ae3ede714f2168ad384cc67d08524732acea90df325","totalSupply":{"numerator":[682972574,7819544],"denominator":[660865024,931322574],"token":{"decimals":18,"symbol":"10k Swap LP","name":"10k Swap","chainId":"SN_MAIN","address":"0x000023c72abdf49dffc85ae3ede714f2168ad384cc67d08524732acea90df325"}},"decimals":18,"reserve0":"0xb6442b7225b321cee","reserve1":"0xbd4e684a81","liquidity":1628429.5370653344,"APR":"","fee24h":"375.2548002513309","strkPrice":"2.5022","lastUpdatedTime":"2024-03-06T20:23:20.150Z","pair":{"liquidityToken":{"decimals":18,"symbol":"10k Swap LP","name":"10k Swap","chainId":"SN_MAIN","address":"0x000023c72abdf49dffc85ae3ede714f2168ad384cc67d08524732acea90df325"},"tokenAmounts":[{"numerator":[456269038,285924489,182],"denominator":[660865024,931322574],"token":{"decimals":18,"symbol":"ETH","name":"Ether","chainId":"SN_MAIN","address":"0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"}},{"numerator":[241715841,757],"denominator":[1000000],"token":{"decimals":6,"symbol":"USDC","name":"USD Coin","chainId":"SN_MAIN","address":"0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8"}}]}},{"token0":{"decimals":6,"symbol":"USDC","name":"USD Coin","chainId":"SN_MAIN","address":"0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8"},"token1":{"decimals":6,"symbol":"USDT","name":"Tether USD","chainId":"SN_MAIN","address":"0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8"},"pairAddress":"0x41a708cf109737a50baa6cbeb9adf0bf8d97112dc6cc80c7a458cbad35328b0","totalSupply":{"numerator":[494730459,85],"denominator":[660865024,931322574],"token":{"decimals":18,"symbol":"10k Swap LP","name":"10k Swap","chainId":"SN_MAIN","address":"0x041a708cf109737a50baa6cbeb9adf0bf8d97112dc6cc80c7a458cbad35328b0"}},"decimals":18,"reserve0":"0x190ab09eac","reserve1":"0x1913d05b4a","liquidity":215066.53752487118,"APR":"","fee24h":"10.710393216","strkPrice":"2.5022","lastUpdatedTime":"2024-03-06T20:23:28.181Z","pair":{"liquidityToken":{"decimals":18,"symbol":"10k Swap LP","name":"10k Swap","chainId":"SN_MAIN","address":"0x041a708cf109737a50baa6cbeb9adf0bf8d97112dc6cc80c7a458cbad35328b0"},"tokenAmounts":[{"numerator":[179347116,100],"denominator":[1000000],"token":{"decimals":6,"symbol":"USDC","name":"USD Coin","chainId":"SN_MAIN","address":"0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8"}},{"numerator":[332421962,100],"denominator":[1000000],"token":{"decimals":6,"symbol":"USDT","name":"Tether USD","chainId":"SN_MAIN","address":"0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8"}}]}}]'
            )
      )
        .filter((item: any) => {
          if (item.token0.symbol == 'STRK' && item.token1.symbol == 'USDC') return true
          if (item.token0.symbol == 'STRK' && item.token1.symbol == 'ETH') return true
          if (item.token0.symbol == 'ETH' && item.token1.symbol == 'USDC') return true
          if (item.token0.symbol == 'USDC' && item.token1.symbol == 'USDT') return true

          return false
        })
        .sort((a: any, b: any) => parseFloat(b.APR) - parseFloat(a.APR))
    )

    const claimButtonText = computed(() => {
      if (!account.value) return 'Connect Wallet'
      else if (claiming.value) return 'Claiming'
      else return 'Claim'
    })

    const loadCalldata = async () => {
      rewardsLoading.value = true

      const [_calldata, _claimed] = await Promise.all([
        getCalldata(chainId.value || StarknetChainId.MAINNET, account.value, 1),
        getAmountAlreadyClaimed(account.value || ''),
      ])

      rewardsCalldata.value = _calldata
      rewardsClaimed.value = parseFloat(formatEther(_claimed))
      rewardsLoading.value = false
    }

    loadCalldata()
    watch([account, chainId], () => {
      loadCalldata()
    })

    const onClickPair = () => {
      router.replace({ path: '/pool' })
    }

    const onClickClaim = async () => {
      if (!account.value) return openWalletModal()

      executeReset()
      claiming.value = true

      try {
        const response = await executeInvoke({
          args: [[rewardsCalldata.value.amount, rewardsCalldata.value.proof]],
          metadata: {
            message: `Claim DeFi Spring rewards`,
          },
        })

        if (response?.transaction_hash) {
          await getRpcProvider(StarknetChainId.MAINNET).waitForTransaction(response?.transaction_hash)
          loadCalldata()
        }
      } catch (e) {
        console.error(e)
      }

      claiming.value = false
      executeReset()
    }

    return {
      t,
      isMobile,
      filterPairs,
      loadingPairs,
      claimButtonText,
      claiming,
      rewardsLoading,
      rewardsCalldata,
      rewardsClaimed,
      rewardsCalldataAmountSTRK,

      onClickPair,
      onClickClaim,
    }
  },
})
</script>

<style lang="scss">
@import '../../../styles/index.scss';

.l0k-swap-rewards {
  width: 768px;
  border-radius: 20px;
  background: $color-white;
  margin: 28px auto;
  padding: 32px;
  @media screen and (max-width: 768px) {
    width: calc(100% - 24px);
    margin: 8px 12px;
    padding: 20px 12px;
    box-sizing: border-box;
  }

  .rewards-title {
    font-size: 17px;

    & > * {
      margin-bottom: 24px;
    }

    h1 {
      font-size: 22px;
      font-weight: bolder;
      text-align: center;
      border-bottom: 1px rgba(0, 0, 0, 0.1) solid;
      padding-bottom: 20px;
    }

    .rewards-title_40m {
      display: flex;
      align-items: center;
      flex-direction: row;
      font-size: 32px;
      font-weight: 100;
    }
  }

  .pairs-title {
    margin-top: 24px;
    margin-bottom: 12px;
    font-size: 17px;

    h2 {
      font-size: 18px;
      font-weight: bolder;
      margin-bottom: 16px;
    }

    a {
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .pairs {
    display: flex;
    flex-direction: row;

    .pairs-item {
      flex: 1;
      padding: 10px;
      border-radius: 10px;
      border: 1px rgba(0, 0, 0, 0.16) solid;
      margin: 8px;
      box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.16);

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        cursor: pointer;
      }

      &:first-child {
        margin-left: 0;
      }

      .pairs-item_title {
        display: flex;
        flex-direction: column;
        align-items: center;

        & > * {
          margin-top: 5px;
        }
      }
    }
  }

  .claims {
    margin-top: 24px;
    margin-bottom: 24px;

    h2 {
      font-size: 18px;
      font-weight: bolder;
      margin-bottom: 12px;
    }

    .illustrate {
      padding: 2px 10px;
      margin: 16px 0;
      border-left: 3px #68b41b solid;
      color: #888888;
      font-size: 14px;

      ul {
        list-style: decimal;

        li {
          margin-bottom: 8px;
          margin-left: 14px;
          line-height: 20px;

          &:last-child {
            margin-bottom: 0px;
          }
        }
      }
    }

    .claim-content {
      .claim-content--item {
        width: 100%;
        font-size: 16px;
        display: flex;
        align-items: center;

        div {
          display: flex;
          align-items: center;
        }

        .button {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
