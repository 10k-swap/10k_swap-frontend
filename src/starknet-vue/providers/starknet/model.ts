import { defaultProvider, ProviderInterface, AccountInterface } from 'starknet'
import { Connector } from '../../connectors'

export interface StarknetState {
  account: string | undefined
  library: ProviderInterface | AccountInterface
  connectors: Connector[]
  error: Error | undefined
}

export interface StarknetMethods {
  connect: (connector: Connector) => void
  disconnect: () => void
}

export const STARKNET_INITIAL_STATE: StarknetState = {
  account: undefined,
  library: defaultProvider,
  connectors: [],
  error: undefined,
}
