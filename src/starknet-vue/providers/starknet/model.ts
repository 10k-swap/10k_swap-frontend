import { StarknetChainId } from 'l0k_swap-sdk'
import { ProviderInterface, AccountInterface } from 'starknet5'
import { Connector } from '../../connectors'
import { InjectedConnectorOptions } from '../../connectors/injected'
import { defaultProvider, defaultChainId } from './const'

export interface StarknetState {
  account: string | undefined
  library: ProviderInterface | AccountInterface
  connectors: Connector<InjectedConnectorOptions>[]
  chainId: StarknetChainId | undefined
  error: Error | undefined
}

export interface StarknetMethods {
  connect: (connector: Connector<InjectedConnectorOptions>) => Promise<void>
  disconnect: () => void
}

export const STARKNET_INITIAL_STATE: StarknetState = {
  account: undefined,
  library: defaultProvider,
  connectors: [],
  error: undefined,
  chainId: defaultChainId,
}
