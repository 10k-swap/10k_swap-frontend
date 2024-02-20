import axios from './axios'
import { SERVER_URLS } from '../constants'
import { IResponse } from './types'
import { ERR_OK } from './'
import { Pair, Token, TokenAmount, StarknetChainId, Fetcher } from 'l0k_swap-sdk'
import tokens from '../constants/tokens'
import { isEqualsAddress } from '../utils'
import { Pool } from '../state/pool'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import I10kSwapPairABI from '../constants/abis/l0k_pair_abi.json'
import pairs from '../constants/pairs.json'
import { Abi, RpcProvider, Contract, Uint256, uint256 } from 'starknet5'

dayjs.extend(utc)

function getToken(chainId: StarknetChainId, address: string) {
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
  APR: string
  lastUpdatedTime: string
  fee24h: string
  strkPrice: string
}

export async function getAllPairs(chainId: StarknetChainId) {
  try {
    const res = await axios.get<IResponse<AllPairItem[]>>(`${SERVER_URLS[chainId]}/pool/pairs`)
    if (res.data.errCode === ERR_OK) {
      if (!res.data.data.length) {
        throw Error('get pairs error')
      }

      const data = res.data.data.filter((item) => {
        return !!(getToken(chainId, item.token0.address) && getToken(chainId, item.token1.address))
      })

      const checkedData: Pool[] = []

      for (let index = 0; index < data.length; index++) {
        const item = data[index]

        const token0 = getToken(chainId, item.token0.address) as Token
        const token1 = getToken(chainId, item.token1.address) as Token

        if (dayjs(item.lastUpdatedTime).add(1, 'h').isAfter(dayjs().utc())) {
          const { reserve0, reserve1, totalSupply } = item
          const pair = new Pair(new TokenAmount(token0, reserve0), new TokenAmount(token1, reserve1))

          checkedData.push({
            ...item,
            token0,
            token1,
            pair,
            totalSupply: new TokenAmount(pair.liquidityToken, totalSupply),
            fee24h: item.fee24h,
            strkPrice: item.strkPrice,
          })
        } else {
          const pool = await getPoolInfo(chainId, item)
          pool && checkedData.push(pool)
        }
      }

      return checkedData
    }

    throw new Error('fetch pairs fail')
  } catch (error: any) {
    const rets: Pool[] = []

    for (let index = 0; index < pairs.data.length; index++) {
      const item = pairs.data[index]
      const data = await getPoolInfo(chainId, item)
      if (data) {
        rets.push(data)
      }
    }

    return rets
  }
}

async function getPoolInfo(chainId: StarknetChainId, data: Omit<Omit<AllPairItem, 'fee24h'>, 'strkPrice'>) {
  const token0 = getToken(chainId, data.token0.address) as Token
  const token1 = getToken(chainId, data.token1.address) as Token

  try {
    const pair = await Fetcher.fetchPairData(token0, token1)

    const provider = new RpcProvider({ nodeUrl: chainId, default: true })
    const { totalSupply } = (await new Contract(I10kSwapPairABI as Abi, pair.liquidityToken.address, provider).call('totalSupply', [])) as {
      totalSupply: Uint256
    }

    if (!totalSupply || !pair) {
      return undefined
    }

    return {
      ...data,
      token0,
      token1,
      pair,
      fee24h: '0',
      strkPrice: '0',
      totalSupply: new TokenAmount(pair.liquidityToken, uint256.uint256ToBN(totalSupply).toString()),
    }
  } catch (error) {
    console.log('error for the get pair', error)
  }
}
