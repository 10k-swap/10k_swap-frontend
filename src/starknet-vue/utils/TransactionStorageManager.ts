import { Transaction } from '../providers/transaction/model'

export default class TransactionStorageManager {
  static readonly _name = 'transactions'

  static get(): { [account: string]: Transaction[] } | null {
    const data = window.localStorage.getItem(TransactionStorageManager._name)

    return data ? JSON.parse(data) : null
  }

  static set(transactions: Transaction[], account: string): void {
    const data = TransactionStorageManager.get()

    return window.localStorage.setItem(
      TransactionStorageManager._name,
      JSON.stringify({
        ...data,
        [account]: transactions,
      })
    )
  }

  static at(account: string | undefined) {
    if (!account) {
      return []
    }

    const data = TransactionStorageManager.get()

    return data && data[account] ? data[account] : []
  }
}
