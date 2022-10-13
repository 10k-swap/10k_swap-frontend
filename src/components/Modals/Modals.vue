<template>
  <AccountModal />
  <ConnectingModal />
  <ConnectRejectModal />
  <WalletModal />
  <SlippageToleranceSettingsModal />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AccountModal from '../../components/AccountModal/AccountModal.vue'
import WalletModal from '../../components/WalletModal/index.vue'
import ConnectingModal from '../../components/ConnectingModal/ConnectingModal.vue'
import ConnectRejectModal from '../../components/ConnectRejectModal/ConnectRejectModal.vue'
import SlippageToleranceSettingsModal from '../../components/SlippageToleranceSettingsModal/SlippageToleranceSettingsModal.vue'

export default defineComponent({
  components: {
    AccountModal,
    WalletModal,
    ConnectingModal,
    ConnectRejectModal,
    SlippageToleranceSettingsModal,
  },
})
</script>
