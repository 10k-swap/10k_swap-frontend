import { StarknetChainId } from 'starknet/constants'
import { Token } from '../sdk'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in StarknetChainId]: Token[]
}

const tokens: ChainTokenList = {
  [StarknetChainId.MAINNET]: [],
  [StarknetChainId.TESTNET]: [
    new Token(StarknetChainId.TESTNET, '0x002e6249b9e54016496a3e618a87537afeb6451105fb645de38b340d1faba527', 1, 'TKA1', 'TestMainnet Token'),
    new Token(StarknetChainId.TESTNET, '0x021cd6f82b7a863d8b9805d391d942fe50179dc41f2dcd1620d1ad7c4bb8bab9', 1, 'TKB1', 'TestMainnet Token'),
    new Token(StarknetChainId.TESTNET, '0x055ae6909088751ccbe4d5ad4653c037ce98798e4ce9bae451b22d43b9cd1ced', 6, 'TKC6', 'TestMainnet Token'),
    new Token(StarknetChainId.TESTNET, '0x03e14d3e29e25b676f31dcbd5b745206a1f0fb7934409bdee0a932e316b14b3e', 6, 'TKD6', 'TestMainnet Token'),
  ],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [StarknetChainId.MAINNET]: [],
  [StarknetChainId.TESTNET]: [],
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in StarknetChainId]?: { [tokenAddress: string]: Token[] } } = {
  [StarknetChainId.MAINNET]: {},
}

export default tokens
