import { Transaction } from '../providers/transaction/model'

export default class TransactionStorageManager {
  readonly name = 'transactions'

  get(): { [account: string]: Transaction[] } | null {
    const data = window.localStorage.getItem(this.name)

    return data ? JSON.parse(data) : null
  }

  set(transactions: Transaction[], account: string): void {
    const data = this.get()

    return window.localStorage.setItem(
      this.name,
      JSON.stringify({
        ...data,
        [account]: transactions,
      })
    )
  }

  at(account: string | undefined) {
    if (!account) {
      return []
    }

    const data = this.get()

    return data && data[account] ? data[account] : []
  }
}
