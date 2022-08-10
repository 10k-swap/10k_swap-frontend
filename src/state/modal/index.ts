import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => {
    return {
      showAccountModal: false,
      showConnectingModal: false,
      showConnectorNotFoundModal: false,
      showConnectRejectModal: false,
      showSlippageToleranceSettingsModal: false,
    }
  },
  actions: {
    toggleAccountModal(show: boolean) {
      this.showAccountModal = show
    },
    toggleConnectingModal(show: boolean) {
      this.showConnectingModal = show
    },
    toggleConnectorNotFoundModal(show: boolean) {
      this.showConnectorNotFoundModal = show
    },
    toggleConnectRejectModal(show: boolean) {
      this.showConnectRejectModal = show
    },
    toggleSlippageToleranceSettingsModal(show: boolean) {
      this.showSlippageToleranceSettingsModal = show
    },
  },
})
