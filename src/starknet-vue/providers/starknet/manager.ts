import { onMounted, onUnmounted, reactive, Ref, ref } from 'vue'
import { Provider, AccountInterface, ProviderInterface } from 'starknet'
import { StarknetMethods, StarknetState } from './model'
import { Connector, InjectedConnector } from '../../connectors'
import { ConnectorNotFoundError, UserRejectedRequestError, ConnectorNotConnectedError } from '../../errors'
import ConnectorStorageManager from '../../utils/ConnectorStorageManager'
import { ChainId, isEqualAddress } from 'l0k_swap-sdk'
import { defaultProvider } from './const'
import { InjectedConnectorOptions } from '../../connectors/injected'

export function useStarknetManager(
  userDefaultProvider: Ref<ProviderInterface | undefined>,
  connectors: Ref<Connector<InjectedConnectorOptions>[]>
): StarknetMethods & { state: StarknetState } {
  const state = reactive<{
    library: ProviderInterface | AccountInterface | Provider
    connectors: Connector<InjectedConnectorOptions>[]
    account: string | undefined
    chainId: ChainId | undefined
    error: Error | undefined
  }>({
    library: userDefaultProvider.value ? userDefaultProvider.value : defaultProvider,
    connectors: connectors.value,
    account: undefined,
    error: undefined,
    chainId: (userDefaultProvider.value ? userDefaultProvider.value : defaultProvider).chainId,
  })

  const connectorId = ConnectorStorageManager.get()
  const currentConnector = ref<Connector | undefined>(connectorId ? new InjectedConnector({ id: connectorId }) : undefined)

  const _getConnectorInfo = async () => {
    if (!currentConnector.value) {
      return
    }
    const connector = currentConnector.value
    const account = await connector.connect()
    if ((state.account && !isEqualAddress(account.address, state.account)) || state.chainId !== account.chainId) {
      state.account = account.address
      state.library = account
      state.chainId = account.chainId
    }
  }
  const _watch = (connector: Connector) => {
    connector.on('accountsChanged', _getConnectorInfo)
    connector.on('networkChanged', _getConnectorInfo)
  }

  const connect = async (connector: Connector) => {
    _watch(connector)

    if (state.account) {
      return
    }
    try {
      const account = await connector.connect()
      currentConnector.value = connector
      state.account = account.address
      state.library = account
      state.chainId = account.chainId
      ConnectorStorageManager.set(connector.id())
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
        ConnectorStorageManager.set(null)
        state.account = undefined
        state.library = userDefaultProvider.value ? userDefaultProvider.value : defaultProvider
        state.chainId = state.library.chainId
      },
      (err) => {
        console.error(err)
        state.error = new ConnectorNotFoundError()
      }
    )
  }

  onUnmounted(() => {
    if (currentConnector.value) {
      currentConnector.value.off('accountsChanged', _getConnectorInfo)
      currentConnector.value.off('networkChanged', _getConnectorInfo)
    }
  })

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
