import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => {
    return {
      showAccountModal: false,
      showConnectingModal: false,
    }
  },
  actions: {
    toggleAccountModal(show: boolean) {
      this.showAccountModal = show
    },
    toggleConnectingModal(show: boolean) {
      this.showConnectingModal = show
    },
  },
})
