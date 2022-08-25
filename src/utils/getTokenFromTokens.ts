import { toBN } from 'starknet/utils/number'
import { StarknetChainId } from '../constants'
import tokens from '../constants/tokens'
import { Token } from '../sdk'

export default function getTokenFromTokens(chainId: StarknetChainId, address: string): Token | undefined {
  const a = toBN(address)
  return tokens[chainId].find((item) => a.eq(toBN(item.address)))
}
