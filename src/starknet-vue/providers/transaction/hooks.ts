import { inject, toRefs, ToRefs } from 'vue'
import { Transaction, StarknetTransactionManager } from './model'
import { StarknetTransactionStateSymbol, StarknetTransactionMethodsSymbol } from './const'
import { noop } from '../../utils'

export function useStarknetTransactionManager(): StarknetTransactionManager & {
  state: ToRefs<{
    transactions: Transaction[]
  }>
} {
  const state = inject<ToRefs<{ transactions: Transaction[] }>>(StarknetTransactionStateSymbol)
  const methods = inject<StarknetTransactionManager>(StarknetTransactionMethodsSymbol) ?? {
    addTransaction: noop,
    removeTransaction: noop,
    refreshTransaction: noop,
    clearTransactions: noop,
  }

  return {
    state: state ? state : toRefs({ transactions: [] }),
    ...methods,
  }
}
