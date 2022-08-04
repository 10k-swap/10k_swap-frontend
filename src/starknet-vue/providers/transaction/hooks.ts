import { inject, ref, Ref, ToRefs } from 'vue'
import { Transaction, StarknetTransactionManager } from './model'
import { StarknetTransactionStateSymbol, StarknetTransactionMethodsSymbol } from './const'
import { noop } from '../../utils'

export function useStarknetTransactionManager(): StarknetTransactionManager & { transactions: Ref<Transaction[]> } {
  const transactions = inject<ToRefs<{ transactions: Transaction[] }>>(StarknetTransactionStateSymbol)
  const methods = inject<StarknetTransactionManager>(StarknetTransactionMethodsSymbol) ?? {
    addTransaction: noop,
    removeTransaction: noop,
    refreshTransaction: noop,
  }

  if (transactions) {
    return {
      transactions: ref(transactions.transactions),
      ...methods,
    }
  }

  return {
    transactions: ref([]),
    ...methods,
  }
}
