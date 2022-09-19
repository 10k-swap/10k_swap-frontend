import { ChainId } from 'l0k_swap-sdk'
import { ProviderInterface, AccountInterface } from 'starknet'
import { Connector } from '../../connectors'
import { defaultProvider } from './const'
export interface StarknetState {
  account: string | undefined
  library: ProviderInterface | AccountInterface
  connectors: Connector[]
  chainId: ChainId | undefined
  error: Error | undefined
}

export interface StarknetMethods {
  connect: (connector: Connector) => Promise<void>
  disconnect: () => void
}

export const STARKNET_INITIAL_STATE: StarknetState = {
  account: undefined,
  library: defaultProvider,
  connectors: [],
  error: undefined,
  chainId: defaultProvider.chainId,
}
