import { onMounted, reactive, Ref, ref, toRaw } from 'vue'
import { defaultProvider, Provider, AccountInterface, ProviderInterface } from 'starknet'

import { StarknetMethods, StarknetState } from './model'
import { Connector, InjectedConnector } from '../../connectors'
import { ConnectorNotFoundError, UserRejectedRequestError, ConnectorNotConnectedError } from '../../errors'
import ConnectorStorageManager from '../../utils/ConnectorStorageManager'

export function useStarknetManager(
  userDefaultProvider: Ref<ProviderInterface | undefined>,
  connectors: Ref<Connector[]>
): StarknetMethods & { state: StarknetState } {
  const state = reactive<{
    library: ProviderInterface | AccountInterface | Provider
    connectors: Connector[]
    account: string | undefined
    error: Error | undefined
  }>({
    library: userDefaultProvider.value ? userDefaultProvider.value : defaultProvider,
    connectors: connectors.value,
    account: undefined,
    error: undefined,
  })

  const connectorStorageManager = new ConnectorStorageManager()

  const connectorId = connectorStorageManager.get()
  const currentConnector = ref<Connector | undefined>(connectorId ? new InjectedConnector({ id: connectorId }) : undefined)

  const connect = async (connector: Connector) => {
    if (state.account) {
      return
    }
    try {
      const account = await connector.connect()
      currentConnector.value = connector
      state.account = account.address
      state.library = account
      connectorStorageManager.set(connector.id())
    } catch (error) {
      if (error instanceof UserRejectedRequestError) {
        state.error = error
        throw error
      }
      if (error instanceof ConnectorNotConnectedError) {
        state.error = error
        throw error
      }
      state.error = error instanceof Error ? error : new Error(error as any)
    }
  }

  const disconnect = () => {
    if (!currentConnector.value) {
      return
    }
    currentConnector.value.disconnect().then(
      () => {
        connectorStorageManager.set(null)
        state.account = undefined
        state.library = userDefaultProvider.value ? userDefaultProvider.value : defaultProvider
      },
      (err) => {
        console.error(err)
        state.error = new ConnectorNotFoundError()
      }
    )
  }

  onMounted(() => {
    if (connectorId) {
      connect(new InjectedConnector({ id: connectorId }))
    }
  })

  return {
    connect,
    disconnect,
    state,
  }
}
