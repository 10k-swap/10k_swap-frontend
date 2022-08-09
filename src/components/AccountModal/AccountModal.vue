<template>
  <Modal v-model="showModal">
    <template v-slot:header>
      <ModalHeader @dismiss="() => showModal = false">
        {{ t('account_modal.account') }}
      </ModalHeader>
    </template>
    <div class="l0k-swap-account-modal-card">
      <div class="l0k-swap-account-modal-card-top">
        <Text color="secondary-text" size="small"> {{ t('account_modal.tips', { wallet }) }}</Text>
        <Button type="danger" size="small" @click="onDisconnect">
          {{ t('account_modal.disconnect') }}
        </Button>
      </div>
      <div class="l0k-swap-account-modal-card-account">
        <div class="account">
          <UserIcon />
          <Text size="md" bold>
            {{ account && shortenAddress(account) }}
          </Text>
        </div>
        <div class="copy" v-if="!copySuccess" id="l0k-swap-account-modal-copy-address" :data-clipboard-text="account">
          <CopyIcon color="secondary" width="15px" />
          <Text size="small" :color="'secondary-text'">{{ t('account_modal.copy') }} </Text>
        </div>
        <Text v-else size="small" :color="'secondary-text'">{{ t('account_modal.copy_success') }} </Text>
      </div>
    </div>
    <RecentTransactions />
  </Modal>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ClipboardJS from 'clipboard'
import Modal from '../Modal/Modal.vue'
import ModalHeader from '../Modal/ModalHeader.vue'
import Text from '../Text/Text.vue'
import Button from '../Button/Button'
import RecentTransactions from '../RecentTransactions/RecentTransactions.vue'
import { UserIcon, CopyIcon } from '../Svg'
import { useModalStore } from '../../state'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import useConnectorWallet from '../../hooks/useConnectorWallet'
import { shortenAddress } from '../../utils'

export default defineComponent({
  components: {
    Modal,
    ModalHeader,
    Button,
    Text,
    CopyIcon,
    UserIcon,
    RecentTransactions
  },
  setup() {
    const { t } = useI18n()
    const store = useModalStore()
    const { state: { account }, disconnect } = useStarknet()
    const wallet = useConnectorWallet()

    const copySuccess = ref(false)

    const showModal = computed({
      get: () => store.showAccountModal,
      set(newValue) {
        store.toggleAccountModal(newValue)
      }
    })

    onMounted(() => {
      const clipboard = new ClipboardJS('#l0k-swap-account-modal-copy-address')

      clipboard.on('success', () => {
        copySuccess.value = true
        setTimeout(() => copySuccess.value = false, 2000)
      })
    })

    const onDisconnect = () => {
      disconnect()
      showModal.value = false
    }

    return {
      showModal,
      wallet,
      account,
      copySuccess,

      t,
      shortenAddress,
      onDisconnect,
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';

.l0k-swap-account-modal-card {
  padding: 16px;
  border-radius: 20px;
  background: $color-bg-secondary;

  .l0k-swap-account-modal-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .l0k-swap-account-modal-card-account {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;

    .account {
      display: flex;
      align-items: center;

      svg {
        margin-right: 8px;
      }
    }

    .copy {
      display: flex;
      align-items: center;
      cursor: pointer;

      svg {
        margin-right: 6px;
      }
    }
  }
}
</style>