import axios from './axios'
import { NetworkNames, SERVER_URLS } from '../constants'
import { IResponse } from './types'
import { ERR_OK } from './'
import { Pair, Token, TokenAmount, StarknetChainId, Fetcher } from 'l0k_swap-sdk'
import tokens from '../constants/tokens'
import { isEqualsAddress } from '../utils'
import { Pool } from '../state/pool'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import I10kSwapPairABI from '../constants/abis/l0k_pair_abi.json'
import { Abi, Provider, Contract } from 'starknet4'
import { uint256ToBN } from 'starknet/dist/utils/uint256'

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
  APR: number
  lastUpdatedTime: string
}

export async function getAllPairs(chainId: StarknetChainId) {
  try {
    const res = await axios.get<IResponse<AllPairItem[]>>(`${SERVER_URLS[chainId]}/pool/pairs`)
    if (res.data.errCode === ERR_OK) {
      const data = res.data.data.filter((item) => {
        return !!(getToken(chainId, item.token0.address) && getToken(chainId, item.token1.address))
      })

      const checkedData: Pool[] = []

      for (let index = 0; index < data.length; index++) {
        const item = data[index]

        if (dayjs(item.lastUpdatedTime).add(1, 'h').isAfter(dayjs().utc())) {
          const { reserve0, reserve1, totalSupply } = item
          const token0 = getToken(chainId, item.token0.address) as Token
          const token1 = getToken(chainId, item.token1.address) as Token
          const pair = new Pair(new TokenAmount(token0, reserve0), new TokenAmount(token1, reserve1))

          checkedData.push({
            ...item,
            token0,
            token1,
            pair,
            totalSupply: new TokenAmount(pair.liquidityToken, totalSupply),
          })
        } else {
          try {
            const { pairAddress } = item
            const token0 = getToken(chainId, item.token0.address) as Token
            const token1 = getToken(chainId, item.token1.address) as Token
            const pair = await Fetcher.fetchPairData(token0, token1)

            const provider = new Provider({ sequencer: { network: NetworkNames[chainId] } })
            const { totalSupply } = await new Contract(I10kSwapPairABI as Abi, pairAddress, provider).call('totalSupply', [])

            if (!totalSupply || !pair) {
              continue
            }

            checkedData.push({
              ...item,
              token0,
              token1,
              pair,
              totalSupply: new TokenAmount(pair.liquidityToken, uint256ToBN(totalSupply).toString()),
            })
          } catch (error) {
            console.log('error for the get pair', error)
          }
        }
      }

      return checkedData
    }

    throw new Error('fetch pairs fail')
  } catch (error: any) {
    throw new Error(error)
  }
}
