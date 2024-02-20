import { StarknetChainId, Token } from 'l0k_swap-sdk'
import { StakePool } from '../state/stake/types'

export const STAKE_POOLS: {
  [chainId in StarknetChainId]: StakePool[]
} = {
  [StarknetChainId.MAINNET]: [],
  [StarknetChainId.TESTNET]: [
    {
      poolId: 0,
      token0: new Token(StarknetChainId.TESTNET, '0x03e85bfbb8e2a42b7bead9e88e9a1b19dbccf661471061807292120462396ec9', 18, 'DAI', 'Dai Stablecoin'),
      token1: new Token(StarknetChainId.TESTNET, '0x005a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426', 6, 'USDC', 'Goerli USD Coin'),
      lpToken: new Token(StarknetChainId.TESTNET, '0x13259169d7a00bba112b8d40d1bb4fd777e1cb0028d882c8a349b2167aca20f', 18, 'DAI-USDC LP', '10k LP'),
    },
  ],
}

export const STAKE_REWARD_TOKEN: {
  [chainId in StarknetChainId]: Token
} = {
  [StarknetChainId.MAINNET]: new Token(
    StarknetChainId.MAINNET,
    '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    18,
    'STRK',
    'Starknet Token'
  ),
  [StarknetChainId.TESTNET]: new Token(
    StarknetChainId.TESTNET,
    '0x005a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426',
    6,
    'USDC',
    'Goerli USD Coin'
  ), // test token
}
