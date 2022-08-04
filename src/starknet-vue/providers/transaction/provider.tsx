import { defineComponent, h, toRefs, onMounted, onBeforeUnmount, watch, provide, readonly, reactive } from 'vue'
import { Status, TransactionStatus } from 'starknet'
import { useStarknet } from '../starknet/hooks'
import { DEFAULT_INTERVAL, StarknetTransactionMethodsSymbol, StarknetTransactionStateSymbol } from './const'
import { Transaction, TransactionSubmitted } from './model'

// todo: wait test
function isLoading(status: Status | TransactionStatus) {
  if (status === 'TRANSACTION_RECEIVED' || status === 'RECEIVED' || status === 'PENDING') {
    return true
  }
  return false
}

function shouldRefreshTransaction(transaction: Transaction, now: number): boolean {
  // try to get transaction data as soon as possible
  if (transaction.status === 'TRANSACTION_RECEIVED') {
    return true
  }

  // wont' be updated anymore
  if (transaction.status === 'ACCEPTED_ON_L1' || transaction.status === 'REJECTED') {
    return false
  }

  // every couple of minutes is enough. Blocks finalized infrequently.
  if (transaction.status === 'ACCEPTED_ON_L2') {
    return now - transaction.lastUpdatedAt > 120000
  }

  return now - transaction.lastUpdatedAt > 15000
}

let intervalId: number

export const StarknetTransactionManagerProvider = defineComponent({
  props: {
    interval: Number,
  },
  setup(props, { slots }) {
    const { interval } = toRefs(props)
    const {
      state: { library },
    } = useStarknet()

    const state = reactive<{ transactions: Transaction[] }>({ transactions: [] })

    const addTransaction = (transaction: TransactionSubmitted) => {
      state.transactions = state.transactions.concat([{ loading: true, ...transaction }])
    }
    const removeTransaction = (transactionHash: string) => {
      state.transactions = state.transactions.filter((tx) => tx.transactionHash !== transactionHash)
    }
    const refreshTransaction = async (transactionHash: string) => {
      try {
        const transactionResponse = await library.value.getTransaction(transactionHash)
        const lastUpdatedAt = Date.now()
        if (transactionResponse.status === 'NOT_RECEIVED') {
          return
        }

        const index = state.transactions.findIndex((tx) => tx.transactionHash === transactionHash)
        const oldTransaction = state.transactions[index]

        if (!oldTransaction) {
          return
        }

        const newTransaction: Transaction = {
          transactionHash,
          lastUpdatedAt,
          status: transactionResponse.status,
          loading: isLoading(transactionResponse.status),
          transaction: transactionResponse.transaction,
          metadata: oldTransaction.metadata,
        }
        state.transactions[index] = newTransaction
      } catch (err) {
        // TODO(fra): somehow should track the error
        console.error(err)
      }
    }
    const refreshAllTransactions = () => {
      const now = Date.now()
      for (const transaction of state.transactions) {
        if (shouldRefreshTransaction(transaction, now)) {
          refreshTransaction(transaction.transactionHash)
        }
      }
    }

    // 使用 `toRefs()` 确保其在消费者组件中广泛可用
    // 而 `readonly()` 预防了用户修改全局状态
    provide(StarknetTransactionStateSymbol, toRefs(readonly(state)))
    provide(StarknetTransactionMethodsSymbol, {
      addTransaction,
      removeTransaction,
      refreshTransaction,
      refreshAllTransactions,
    })

    onMounted(() => {
      refreshAllTransactions()
      intervalId = setInterval(() => {
        refreshAllTransactions()
      }, interval.value ?? DEFAULT_INTERVAL)
    })
    onBeforeUnmount(() => clearInterval(intervalId))
    watch([state.transactions, library, interval], () => refreshAllTransactions())

    return slots.default
  },
})
