import { onMounted, onUnmounted, reactive, Ref, ref } from 'vue'
import { RpcProvider, AccountInterface, ProviderInterface } from 'starknet5'
import { StarknetMethods, StarknetState } from './model'
import { Connector, InjectedConnector } from '../../connectors'
import { ConnectorNotFoundError, UserRejectedRequestError, ConnectorNotConnectedError } from '../../errors'
import ConnectorStorageManager from '../../utils/ConnectorStorageManager'
import { StarknetChainId, isEqualAddress } from 'l0k_swap-sdk'
import { chainIdMap, defaultProvider } from './const'
import { InjectedConnectorOptions } from '../../connectors/injected'

export function useStarknetManager(
  userDefaultProvider: Ref<ProviderInterface | undefined>,
  connectors: Ref<Connector<InjectedConnectorOptions>[]>
): StarknetMethods & { state: StarknetState } {
  const state = reactive<{
    library: ProviderInterface | AccountInterface | RpcProvider
    connectors: Connector<InjectedConnectorOptions>[]
    account: string | undefined
    chainId: StarknetChainId | undefined
    error: Error | undefined
  }>({
    library: userDefaultProvider.value ? userDefaultProvider.value : defaultProvider,
    connectors: connectors.value,
    account: undefined,
    error: undefined,
    chainId: StarknetChainId.MAINNET,
  })

  const connectorId = ConnectorStorageManager.get()
  const currentConnector = ref<Connector | undefined>(connectorId ? new InjectedConnector({ id: connectorId }) : undefined)

  const _getConnectorInfo = async () => {
    if (!currentConnector.value) {
      return
    }
    const connector = currentConnector.value
    const account = await connector.connect()
    const chainId = chainIdMap[await account.getChainId()]

    if ((state.account && !isEqualAddress(account.address, state.account)) || state.chainId !== chainId) {
      state.account = account.address
      state.library = account
      state.chainId = chainId
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
      state.chainId = chainIdMap[await account.getChainId()]

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
      async () => {
        ConnectorStorageManager.set(null)
        state.account = undefined
        state.library = userDefaultProvider.value ? userDefaultProvider.value : defaultProvider
        state.chainId = chainIdMap[await state.library.getChainId()]
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
