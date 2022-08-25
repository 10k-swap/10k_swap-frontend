import axios from './axios'
import { SERVER_URLS, StarknetChainId } from '../constants'
import { IResponse } from './types'
import { ERR_OK } from './'

export interface AllPairItem {
  token0: string
  token1: string
  pairAddress: string
  totalSupply: string
  decimals: number
  APR: number
}

export async function getAllPairs(chainId: StarknetChainId) {
  try {
    const res = await axios.get<IResponse<AllPairItem[]>>(`${SERVER_URLS[chainId]}/pool/pairs`)
    if (res.data.errCode === ERR_OK) {
      return res.data.data
    }
    throw new Error('fetch pairs fail')
  } catch (error: any) {
    throw new Error(error)
  }
}
