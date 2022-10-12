<template>
  <Modal v-model="showModal" :title="t('wallet_modal.title')">
    <div class="l0k-swap-wallet-modal">
      <div class="discoverys">
        <div class="discovery" v-for="item in discovery" :key="item.id" @click="onWalletSelect(item)">
          <img :src="item.icon" />
          <Text bold :color="'secondary-text'"> {{ isInstalled(item.id) ? item.name : t('wallet_modal.install', { wallet: item.name }) }} </Text>
        </div>
      </div>
      <!-- <div class="card">
        <Text :color="'secondary-text'" :size="'small'"> {{ t('wallet_modal.tips') }} </Text>
      </div> -->
    </div>
  </Modal>
</template>

<script lang="ts">
import { computed, defineComponent, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from '../Modal/Modal.vue'
import discovery from './discovery'
import Text from '../Text/Text.vue'
import getBrowserName from '../../utils/getBrowserName'
import { useModalStore } from '../../state'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { WalletProvider } from './types'
import useConnector from '../../hooks/useConnector'

const normalId = (id: string) => id.replace(/\s|-/g, '').toLowerCase()

export default defineComponent({
  components: {
    Modal,
    Text,
  },
  setup() {
    const { t } = useI18n()
    const store = useModalStore()

    const {
      state: { connectors },
    } = useStarknet()
    const { onConnect } = useConnector()

    const showModal = computed({
      get: () => store.showWalletModal,
      set(newValue) {
        store.toggleWalletModal(newValue)
      },
    })

    const isInstalled = (id: string) => {
      return !!connectors.value.find((item) => normalId(item.options.id) === id)
    }

    const onWalletSelect = (wallet: WalletProvider) => {
      const browser = getBrowserName()
      if (!browser) {
        return
      }

      const url = wallet.downloads[browser]
      if (!isInstalled(wallet.id) && url) {
        window.open(url)
        return
      }

      const connector = connectors.value.find((item) => normalId(item.options.id) === wallet.id)
      if (connector) {
        onConnect(toRaw(connector))
      }

      showModal.value = false
    }

    return {
      showModal,
      discovery,

      t,
      isInstalled,
      onWalletSelect,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';

.l0k-swap-wallet-modal {
  .discoverys {
    .discovery {
      display: flex;
      align-items: center;
      padding: 10px;
      border: 2px solid #eaeaea;
      border-radius: 12px;
      margin-bottom: 8px;
      cursor: pointer;
      &:last-child {
        margin-bottom: 0;
      }
      img {
        width: 24px;
        height: 24px;
        border: 1px solid #f2f2f2;
        border-radius: 8px;
        box-sizing: border-box;
        margin-right: 4px;
      }
    }
  }

  .card {
    padding: 16px;
    background: $color-bg-secondary;
    border-radius: 20px;
    margin-top: 20px;
  }
}
</style>
