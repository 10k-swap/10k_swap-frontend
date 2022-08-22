import { StarknetChainId } from "starknet/constants"

export const ROUTER_ADDRESSES: {
  [chainId in StarknetChainId]: string
} = {
  [StarknetChainId.MAINNET]: '',
  [StarknetChainId.TESTNET]: '0x0666a26b85b439dc6e5ab00f4578c8354edf5a1c9ee63d68a97c50949488ccaf',
}

export const FACTORY_ADDRESSES: {
  [chainId in StarknetChainId]: string
} = {
  [StarknetChainId.MAINNET]: '',
  [StarknetChainId.TESTNET]: '0x0492f41499a6419abb7e98eb276ccb4be0994f2462e57b3b51262bfa1dac8b3e',
}
