import { StarknetChainId } from 'starknet/constants'
import { Token } from '../sdk'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in StarknetChainId]: Token[]
}

const tokens: ChainTokenList = {
  [StarknetChainId.MAINNET]: [],
  [StarknetChainId.TESTNET]: [
    new Token(StarknetChainId.TESTNET, '0x02e2faab2cad8ecdde5e991798673ddcc08983b872304a66e5f99fbb24e14abc', 6, 'TKA', 'TestMainnet Token'),
    new Token(StarknetChainId.TESTNET, '0x0250a29c8cd4d07a4db0516798fe86225e362439e769c9a0e1640d4a8ec12883', 6, 'TKB', 'TestMainnet Token'),
    new Token(StarknetChainId.TESTNET, '0x043a3737fcd6638ae58fc9e497cee036333f02984e4ff4deaf512333b6220481', 18, 'TKC', 'TestMainnet Token'),
    new Token(StarknetChainId.TESTNET, '0x060079a4e9c922f8143c1b8670c053cec37db6b3894e3e2129f0a408b47dfac3', 18, 'TKD', 'TestMainnet Token'),
    new Token(StarknetChainId.TESTNET, '0x03e85bfbb8e2a42b7bead9e88e9a1b19dbccf661471061807292120462396ec9', 18, 'DAI', 'Dai Stablecoin'),
    new Token(StarknetChainId.TESTNET, '0x005a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426', 6, 'USDC', 'Goerli USD Coin'),
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
