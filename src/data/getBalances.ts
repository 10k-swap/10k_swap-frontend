import { StarknetChainId } from 'l0k_swap-sdk'
import { Abi, Contract, RpcProvider } from 'starknet5'
import l0k_pair_abi from '../constants/abis/l0k_pair_abi.json'

export default async function getBalances(account: string, pairAddress: string, chainId: StarknetChainId): Promise<string | undefined> {
  const contract = new Contract(l0k_pair_abi as Abi, pairAddress, new RpcProvider({ nodeUrl: chainId }))
  try {
    const data = (await contract.call('balanceOf', [account])) as bigint[]
    if (data?.[0]) {
      return data[0]?.toString()
    }
    return undefined
  } catch (error) {
    return undefined
  }
}
