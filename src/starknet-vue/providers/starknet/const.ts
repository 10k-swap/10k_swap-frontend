import { StarknetChainId } from 'l0k_swap-sdk'
import { getRpcProvider } from '../../../utils/getRpcProvider'

export const StarknetStateSymbol = Symbol('StarknetState')

export const StarknetMethodsSymbol = Symbol('StarknetMethods')

export const defaultChainId = StarknetChainId.MAINNET

export const defaultProvider = getRpcProvider(defaultChainId, { default: true })

enum Chains {
  MAINNET = '0x534e5f4d41494e',
  TESTNET = '0x534e5f474f45524c49',
  TESTNET2 = '0x534e5f474f45524c4932',
}

export const chainIdMap: { [K in Chains]?: StarknetChainId } = {
  '0x534e5f4d41494e': StarknetChainId.MAINNET, // mainnet
  '0x534e5f474f45524c49': StarknetChainId.TESTNET, // testnet
}
