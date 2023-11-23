import { StarknetChainId } from 'l0k_swap-sdk'
import { Transaction } from '../providers/transaction/model'
export default class TransactionStorageManager {
  static readonly _name = 'transactions'

  static get(): { [chainId in StarknetChainId]: { [account: string]: Transaction[] } } | null {
    const data = window.localStorage.getItem(TransactionStorageManager._name)

    return data ? JSON.parse(data) : null
  }

  static set(transactions: Transaction[], account: string, chainId: StarknetChainId): void {
    const data = TransactionStorageManager.get()

    return window.localStorage.setItem(
      TransactionStorageManager._name,
      JSON.stringify({
        ...data,
        [chainId]: {
          [account]: transactions,
        },
      })
    )
  }

  static at(account: string | undefined, chainId: StarknetChainId | undefined) {
    if (!account || !chainId) {
      return []
    }

    const data = TransactionStorageManager.get()
    return data?.[chainId]?.[account] ?? []
  }
}
