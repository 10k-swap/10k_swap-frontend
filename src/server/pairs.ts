import axios from './axios'
import { SERVER_URLS } from '../constants'
import { IResponse } from './types'
import { ERR_OK } from './'
import { Pair, Token, TokenAmount, ChainId } from 'l0k_swap-sdk'
import tokens from '../constants/tokens'
import { isEqualsAddress } from '../utils'

function getToken(chainId: ChainId, address: string) {
  return tokens[chainId].find((item) => isEqualsAddress(address, item.address))
}

export interface AllPairItem {
  token0: {
    address: string
    decimals: number
    name: string
    symbol: string
  }
  token1: {
    address: string
    decimals: number
    name: string
    symbol: string
  }
  liquidity: number
  pairAddress: string
  totalSupply: string //0x
  decimals: number
  reserve0: string //0x
  reserve1: string //0x
  APR: number
}

export async function getAllPairs(chainId: ChainId) {
  try {
    const res = await axios.get<IResponse<AllPairItem[]>>(`${SERVER_URLS[chainId]}/pool/pairs`)
    if (res.data.errCode === ERR_OK) {
      const data = res.data.data

      return data
        .filter((item) => {
          return !!(getToken(chainId, item.token0.address) && getToken(chainId, item.token1.address))
        })
        .map((item) => {
          const { reserve0, reserve1, totalSupply } = item
          const token0 = getToken(chainId, item.token0.address) as Token
          const token1 = getToken(chainId, item.token1.address) as Token
          const pair = new Pair(new TokenAmount(token0, reserve0), new TokenAmount(token1, reserve1))

          return {
            ...item,
            token0,
            token1,
            pair,
            totalSupply: new TokenAmount(pair.liquidityToken, totalSupply),
          }
        })
    }

    throw new Error('fetch pairs fail')
  } catch (error: any) {
    throw new Error(error)
  }
}
