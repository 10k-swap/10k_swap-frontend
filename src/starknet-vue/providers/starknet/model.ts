import { defaultProvider, ProviderInterface, AccountInterface } from 'starknet'
import { Connector } from '../../connectors'
import { StarknetChainId } from 'starknet/constants'

export interface StarknetState {
  account: string | undefined
  library: ProviderInterface | AccountInterface
  connectors: Connector[]
  chainId: StarknetChainId | undefined
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
