import { StarknetChainId } from 'starknet/constants'
import { Token } from '../sdk'

export default {
  [StarknetChainId.MAINNET]: [],
  [StarknetChainId.TESTNET]: [],
} as {
  [chainId in StarknetChainId]: Token[]
}
