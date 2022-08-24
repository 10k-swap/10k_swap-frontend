<template>
  <AccountModal />
  <ConnectingModal />
  <ConnectorNotFoundModal />
  <ConnectRejectModal />
  <SlippageToleranceSettingsModal />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AccountModal from '../../components/AccountModal/AccountModal.vue'
import ConnectingModal from '../../components/ConnectingModal/ConnectingModal.vue'
import ConnectorNotFoundModal from '../../components/ConnectorNotFoundModal/ConnectorNotFoundModal.vue'
import ConnectRejectModal from '../../components/ConnectRejectModal/ConnectRejectModal.vue'
import SlippageToleranceSettingsModal from '../../components/SlippageToleranceSettingsModal/SlippageToleranceSettingsModal.vue'

export default defineComponent({
  components: {
    AccountModal,
    ConnectingModal,
    ConnectorNotFoundModal,
    ConnectRejectModal,
    SlippageToleranceSettingsModal,
  },
})
</script>
