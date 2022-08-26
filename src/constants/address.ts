import { StarknetChainId } from 'starknet/constants'

export const ROUTER_ADDRESSES: {
  [chainId in StarknetChainId]: string
} = {
  [StarknetChainId.MAINNET]: '',
  [StarknetChainId.TESTNET]: '0x01a5200387983d5acb1c4a8f9be94219fb3bbb9438bb50eb70d9f5398656c78e',
}

export const FACTORY_ADDRESSES: {
  [chainId in StarknetChainId]: string
} = {
  [StarknetChainId.MAINNET]: '',
  [StarknetChainId.TESTNET]: '0x07e0879afbf63ec943e58cba0d9e81385f2183f1f9aa44e32f08e877c31fdb98',
}
