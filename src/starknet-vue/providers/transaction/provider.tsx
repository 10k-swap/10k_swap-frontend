import { defineComponent, toRefs, onMounted, onBeforeUnmount, watch, provide, readonly, reactive, toRaw } from 'vue'
import { useStarknet } from '../starknet/hooks'
import { DEFAULT_INTERVAL, StarknetTransactionMethodsSymbol, StarknetTransactionStateSymbol } from './const'
import { Transaction, TransactionStatus, TransactionSubmitted } from './model'
import TransactionStorageManager from '../../utils/TransactionStorageManager'
import { TransactionFinalityStatus } from 'starknet5'

function isLoading(status: TransactionStatus | undefined) {
  if (!status) {
    return false
  }
  return ['RECEIVED', 'PENDING', 'NOT_RECEIVED'].includes(status)
}
function isSuccess(status: TransactionStatus | undefined) {
  if (!status) {
    return false
  }
  return ['ACCEPTED_ON_L2', 'ACCEPTED_ON_L1'].includes(status)
}
function isFail(status: TransactionStatus | undefined) {
  if (!status) {
    return false
  }
  return ['REJECTED', 'REVERTED'].includes(status)
}

function shouldRefreshTransaction(transaction: Transaction, now: number): boolean {
  // try to get transaction data as soon as possible
  if (transaction.status === 'RECEIVED') {
    return true
  }

  // wont' be updated anymore
  if (transaction.status === 'ACCEPTED_ON_L1' || transaction.status === 'REJECTED') {
    return false
  }

  // every couple of minutes is enough. Blocks finalized infrequently.
  if (transaction.status === 'ACCEPTED_ON_L2') {
    return now - transaction?.lastUpdatedAt > 120000
  }

  return now - transaction?.lastUpdatedAt > 15000
}

let intervalId: number

export const StarknetTransactionManagerProvider = defineComponent({
  props: {
    interval: Number,
  },
  emits: ['transactionRefresh'],
  setup(props, { slots, emit }) {
    const { interval } = toRefs(props)
    const {
      state: { library, account, chainId },
    } = useStarknet()

    const state = reactive<{ transactions: Transaction[] }>({ transactions: [] })

    const addTransaction = (transaction: TransactionSubmitted) => {
      state.transactions = state.transactions.concat([
        { loading: true, scuccess: false, fail: false, ...transaction, createAt: new Date().getTime() },
      ])
      if (account.value && chainId.value) {
        TransactionStorageManager.set(toRaw(state.transactions), account.value, chainId.value)
      }
    }
    const removeTransaction = (transactionHash: string) => {
      state.transactions = state.transactions.filter((tx) => tx.transactionHash !== transactionHash)
      if (account.value && chainId.value) {
        TransactionStorageManager.set(toRaw(state.transactions), account.value, chainId.value)
      }
    }
    const clearTransactions = () => {
      state.transactions = []
      if (account.value && chainId.value) {
        TransactionStorageManager.set([], account.value, chainId.value)
      }
    }
    const refreshTransaction = async (transactionHash: string) => {
      try {
        const transactionResponse = await library.value.getTransactionReceipt(transactionHash)
        const lastUpdatedAt = Date.now()
        const finalityStatus: TransactionFinalityStatus = (transactionResponse as any).finality_status
        const status = finalityStatus ? finalityStatus : transactionResponse.status

        if (!status || status === 'NOT_RECEIVED') {
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
          status: status,
          scuccess: isSuccess(status),
          fail: isFail(status),
          loading: isLoading(status),
          createAt: oldTransaction.createAt,
          metadata: oldTransaction.metadata,
        }
        emit('transactionRefresh', { oldTransaction: toRaw(oldTransaction), newTransaction })
        state.transactions[index] = newTransaction
        if (account.value && chainId.value) {
          TransactionStorageManager.set(toRaw(state.transactions), account.value, chainId.value)
        }
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

    provide(StarknetTransactionStateSymbol, toRefs(readonly(state)))
    provide(StarknetTransactionMethodsSymbol, {
      addTransaction,
      removeTransaction,
      refreshTransaction,
      refreshAllTransactions,
      clearTransactions,
    })

    onMounted(() => {
      refreshAllTransactions()
      intervalId = window.setInterval(() => {
        refreshAllTransactions()
      }, interval.value ?? DEFAULT_INTERVAL)
    })
    onBeforeUnmount(() => clearInterval(intervalId))

    watch([state.transactions, library, interval], () => refreshAllTransactions())

    watch([account, chainId], () => {
      state.transactions = TransactionStorageManager.at(account.value, chainId.value)
    })

    return slots.default
  },
})
