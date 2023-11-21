import { TransactionStatus as _TransactionStatus } from 'starknet5'

export type TransactionStatus = 'REVERTED' | 'ACCEPTED_ON_L2' | 'ACCEPTED_ON_L1' | _TransactionStatus | 'RECEIVED' | 'REJECTED' | 'NOT_RECEIVED'

export interface TransactionSubmitted {
  status: 'RECEIVED'
  transactionHash: string
  address?: string
  metadata?: {
    method?: string
    message?: string
  }
}

export interface TransactionReceived {
  status: TransactionStatus
  transactionHash: string
  lastUpdatedAt: number
  metadata?: {
    method?: string
    message?: string
  }
}

export type Transaction = (TransactionSubmitted | TransactionReceived) & {
  createAt: number
  loading: boolean
  scuccess: boolean
  fail: boolean
}

export interface TransactionRefreshData {
  oldTransaction: Transaction
  newTransaction: Transaction
}

export interface StarknetTransactionManager {
  addTransaction: (transaction: TransactionSubmitted) => void
  removeTransaction: (transactionHash: string) => void
  refreshTransaction: (transactionHash: string) => void
  clearTransactions: () => void
}
