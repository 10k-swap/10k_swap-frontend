import { StarknetChainId } from 'l0k_swap-sdk'
import axios from './axios'
import { sleep } from '../utils'

export interface DefispringCalldata {
  amount: string
  proof: string[]
}

export async function getCalldata(chainId: StarknetChainId, account?: string, round?: number, retryNumber = 0): Promise<DefispringCalldata> {
  if (chainId !== StarknetChainId.MAINNET) throw new Error('Not support testnet')
  if (!account) throw new Error('Miss account')

  try {
    const res = await axios.get<DefispringCalldata>('https://10kswap.defispring.xyz/get_calldata', { params: { address: account, round } })

    if (res.data) {
      return res.data
    }

    throw new Error('fetch pairs fail')
  } catch (error: any) {
    retryNumber += 1
    await sleep(Math.min(retryNumber * 200, 5000))
    return await getCalldata(chainId, account, round, retryNumber)

    // return { amount: '0x00', proof: [] } as DefispringCalldata
  }
}
