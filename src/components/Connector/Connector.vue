<template>
  <div class="l0k-swap-connector">
    <div class="connected" v-if="account">
      <template v-if="chainId">
        <Button plain v-if="!isMobile" class="network">
          <template v-slot:icon>
            <StarknetIcon class="icon" />
          </template>
          {{ CHAIN_LABELS[chainId] }}
        </Button>
        <Button plain v-else class="network">
          <template v-slot:icon>
            <StarknetIcon class="icon" />
          </template>
        </Button>
      </template>
      <div class="address" :class="{ 'has-id': !!starknetId }" plain @click="store.toggleAccountModal(true)">
        {{ starknetId ? starknetId : shortenAddress(account) }}
        <ShareIcon v-if="starknetId" class="share" :color="'white'" width="13px" @click="toStarknetId" />
      </div>
    </div>
    <Button type="primary" bold v-else @click="openWalletModal">
      {{ connectText || t('connector.connect') }}
    </Button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { CHAIN_LABELS } from '../../constants'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { shortenAddress } from '../../utils'
import { StarknetIcon, ShareIcon } from '../Svg/index'
import Button from '../Button/Button'
import { useModalStore } from '../../state'
import useIsMobile from '../../hooks/useIsMobile'
import { useOpenWalletModal } from '../../state/modal/hooks'
import { useDomainFromAddress } from '../../hooks/naming'
import { ChainId } from 'l0k_swap-sdk'

export default defineComponent({
  props: {
    connectText: {
      type: String,
    },
  },
  components: {
    Button,
    StarknetIcon,
    ShareIcon,
  },
  setup() {
    const store = useModalStore()
    const isMobile = useIsMobile()

    const {
      state: { account, library },
    } = useStarknet()
    const { t } = useI18n()
    const openWalletModal = useOpenWalletModal()

    const chainId = computed(() => library.value.chainId ?? undefined)

    const starknetId = useDomainFromAddress(account)

    const toStarknetId = (e: Event) => {
      e.stopPropagation()
      const urls = {
        [ChainId.MAINNET]: 'https://app.starknet.id',
        [ChainId.TESTNET]: 'https://goerli.app.starknet.id',
      }

      window.open(`${urls[chainId.value ?? ChainId.MAINNET]}/search?domain=${starknetId.value}`)
    }

    return {
      account,
      chainId,
      CHAIN_LABELS,
      store,
      isMobile,
      starknetId,

      t,
      openWalletModal,
      shortenAddress,
      toStarknetId,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';

.l0k-swap-connector {
  .connected {
    display: flex;
    .network {
      cursor: default;

      @include mobile {
        margin-right: 0;
        width: 40px;
        height: 40px;
        padding: 8px;
      }
    }

    button {
      &:first-child {
        margin-right: 8px;
      }
    }
    .address {
      position: relative;
      display: inline-block;
      box-sizing: border-box;
      height: 40px;
      margin: 0;
      padding: 0;
      font-size: 16px;
      line-height: 40px;
      text-align: center;
      border-radius: 20px;
      cursor: pointer;
      transition: opacity 0.2s;
      background-color: #eaeaea;
      color: #000;
      border: none;
      padding: 0 20px;
      font-size: 16px;
    }
    .has-id {
      background: #19aa6e;
      color: $color-white;
      font-weight: bold;
      .share {
        margin-left: 5px;
      }
    }
  }
}
</style>
