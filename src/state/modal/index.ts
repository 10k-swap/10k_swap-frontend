import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => {
    return {
      showAccountModal: false,
      showConnectingModal: false,
      showConnectRejectModal: false,
      showSlippageToleranceSettingsModal: false,
      showWalletModal: false,
    }
  },
  actions: {
    toggleAccountModal(show: boolean) {
      this.showAccountModal = show
    },
    toggleWalletModal(show: boolean) {
      this.showWalletModal = show
    },
    toggleConnectingModal(show: boolean) {
      this.showConnectingModal = show
    },
    toggleConnectRejectModal(show: boolean) {
      this.showConnectRejectModal = show
    },
    toggleSlippageToleranceSettingsModal(show: boolean) {
      this.showSlippageToleranceSettingsModal = show
    },
  },
})
