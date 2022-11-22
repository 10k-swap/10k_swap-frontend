import axios from './axios'
import { SERVER_URLS } from '../constants'
import { IResponse } from './types'
import { ERR_OK } from './'
import { ChainId } from 'l0k_swap-sdk'
import { Pair, Summary, Transaction, TransactionType } from '../state/analytics/types'

export interface TransactionsResponse {
  transactions: {
    transactions: Transaction[]
    total: number
    limit: number
  }
  summary: Summary
}

export interface PairResponse {
  limit: number
  page: string
  total: number
  pairs: Pair[]
}

export interface ChartsDataResponse {
  tvls: {
    date: string
    tvl: number
  }[]
  volumes: {
    date: string
    volume: number
  }[]
}

export async function getTransactions(
  chainId: ChainId,
  { startTime, endTime, page, type }: { startTime: number; endTime: number; page: number; type: TransactionType | undefined }
) {
  try {
    const res = await axios.get<IResponse<TransactionsResponse>>(`${SERVER_URLS[chainId]}/analytics/transactions`, {
      params: {
        startTime,
        endTime,
        page,
        keyName: type,
      },
    })
    if (res.data.errCode === ERR_OK) {
      const data = res.data.data
      return data
    }

    throw new Error('fetch transactions fail')
  } catch (error: any) {
    throw new Error(error)
  }
}

export async function getPairs(chainId: ChainId, { startTime, endTime, page }: { startTime: number; endTime: number; page: number }) {
  try {
    const res = await axios.get<IResponse<PairResponse>>(`${SERVER_URLS[chainId]}/analytics/pairs`, {
      params: { startTime, endTime, page },
    })
    if (res.data.errCode === ERR_OK) {
      const data = res.data.data
      return data
    }
    throw new Error('fetch pairs fail')
  } catch (error: any) {
    throw new Error(error)
  }
}

export async function getChartsData(chainId: ChainId) {
  try {
    const res = await axios.get<IResponse<ChartsDataResponse>>(`${SERVER_URLS[chainId]}/analytics`)
    if (res.data.errCode === ERR_OK) {
      const data = res.data.data
      return data
    }
    throw new Error('fetch charts fail')
  } catch (error: any) {
    throw new Error(error)
  }
}
