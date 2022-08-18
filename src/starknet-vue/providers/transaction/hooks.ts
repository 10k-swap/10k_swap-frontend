import { inject, ref, Ref, toRaw, ToRefs } from 'vue'
import { Transaction, StarknetTransactionManager } from './model'
import { StarknetTransactionStateSymbol, StarknetTransactionMethodsSymbol } from './const'
import { noop } from '../../utils'

export function useStarknetTransactionManager(): StarknetTransactionManager & { transactions: Ref<Transaction[]> } {
  const transactions = inject<ToRefs<{ transactions: Transaction[] }>>(StarknetTransactionStateSymbol)
  const methods = inject<StarknetTransactionManager>(StarknetTransactionMethodsSymbol) ?? {
    addTransaction: noop,
    removeTransaction: noop,
    refreshTransaction: noop,
    clearTransactions: noop,
  }

  if (transactions) {
    return {
      transactions: toRaw(transactions.transactions),
      ...methods,
    }
  }

  return {
    transactions: ref([]),
    ...methods,
  }
}
