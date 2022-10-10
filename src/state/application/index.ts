import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import { DEFAULT_TXN_DISMISS_MS } from '../../constants'
import { Transaction } from '../../starknet-vue/providers/transaction'

export type PopupContent = {
  txn: Transaction
}

export interface ApplicationState {
  popupList: PopupList
}

type PopupList = Array<{ key: string; show: boolean; content: PopupContent; removeAfterMs: number | null }>

interface ApplicationActions {
  addPopup: (payload: { content: PopupContent; removeAfterMs?: number }) => void
  removePopup: (payload: { key: string }) => void
}

export const useApplicationStore = defineStore<'application', ApplicationState, {}, ApplicationActions>('application', {
  state: () => {
    return {
      popupList: [],
    }
  },
  actions: {
    addPopup({ content, removeAfterMs = DEFAULT_TXN_DISMISS_MS }) {
      this.popupList = this.popupList.concat([
        {
          key: nanoid(),
          show: true,
          content,
          removeAfterMs,
        },
      ])
    },
    removePopup({ key }) {
      this.popupList.forEach((p) => {
        if (p.key === key) {
          p.show = false
        }
      })
    },
  },
})
