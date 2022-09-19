import { Provider } from 'starknet'

export const StarknetStateSymbol = Symbol('StarknetState')

export const StarknetMethodsSymbol = Symbol('StarknetMethods')

export const defaultProvider = new Provider({ network: 'mainnet-alpha' })
