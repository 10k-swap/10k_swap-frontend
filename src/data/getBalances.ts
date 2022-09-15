import { ChainId } from 'l0k_swap-sdk'
import { Abi, Contract, Provider } from 'starknet'
import { uint256ToBN } from 'starknet/dist/utils/uint256'
import l0k_pair_abi from '../constants/abis/l0k_pair_abi.json'

const NetworkNames: { [chainId in ChainId]: 'mainnet-alpha' | 'goerli-alpha' } = {
  [ChainId.MAINNET]: 'mainnet-alpha',
  [ChainId.TESTNET]: 'goerli-alpha',
}

export default async function getBalances(account: string, pairAddress: string, chainId: ChainId): Promise<string | undefined> {
  const contract = new Contract(l0k_pair_abi as Abi, pairAddress, new Provider({ network: NetworkNames[chainId] }))
  try {
    const data = await contract.call('balanceOf', [account])
    if (data?.[0]) {
      return uint256ToBN(data[0])?.toString()
    }
    return undefined
  } catch (error) {
    return undefined
  }
}
