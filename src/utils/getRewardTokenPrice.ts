import { StarknetChainId } from 'l0k_swap-sdk'

export function getRewardTokenPrice(chainId: StarknetChainId, strkPrice: number) {
  return chainId === StarknetChainId.TESTNET ? 1 : strkPrice
}
