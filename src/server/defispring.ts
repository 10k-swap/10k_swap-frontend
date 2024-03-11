import { StarknetChainId } from 'l0k_swap-sdk'
import { SERVER_URLS } from '../constants'
import axios from './axios'

export interface DefispringCalldata {
  amount: string
  proof: string[]
}

export async function getCalldata(chainId: StarknetChainId, account?: string, round?: number) {
  try {
    if (chainId !== StarknetChainId.MAINNET) throw new Error('Not support testnet')
    if (!account) throw new Error('Miss account')

    const res = await axios.get<DefispringCalldata>(`${SERVER_URLS[chainId]}/defispring/get_calldata`, { params: { address: account, round } })

    if (res.data) {
      return res.data
    }

    throw new Error('fetch pairs fail')
  } catch (error: any) {
    return { amount: '0x00', proof: [] } as DefispringCalldata
  }
}
