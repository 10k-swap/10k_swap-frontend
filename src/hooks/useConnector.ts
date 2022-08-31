import { computed, nextTick, ref, toRaw, watch } from 'vue'
import { Connector } from '../starknet-vue/connectors'
import { ConnectorNotFoundError, UserRejectedRequestError } from '../starknet-vue/errors'
import { useStarknet } from '../starknet-vue/providers/starknet'
import { useModalStore } from '../state'
import useArgentXRejectCallback from './useArgentXRejectCallback'

function getConnector(connectors: Connector<unknown>[]) {
  const argentX = connectors.find((item) => item.id() === 'argent-x')
  if (argentX) {
    return argentX
  }
  return connectors[0]
}

export default function useConnector() {
  const connectError = ref<Error>()
  const store = useModalStore()

  const {
    state: { account, connectors },
    connect,
  } = useStarknet()

  const showConnectingModal = computed(() => store.showConnectingModal)

  watch(connectError, (newErr) => {
    if (!newErr) {
      return
    }
    if (newErr instanceof ConnectorNotFoundError) {
      store.toggleConnectorNotFoundModal(true)
    }
    if (newErr instanceof UserRejectedRequestError) {
      store.toggleConnectRejectModal(true)
    }
  })

  useArgentXRejectCallback(() => {
    if (account.value) {
      return
    }
    if (showConnectingModal.value) {
      store.toggleConnectingModal(false)
    }
    if (connectError.value) {
      return
    }
    nextTick(() => {
      connectError.value = new UserRejectedRequestError()
    })
  })

  const onConnect = async () => {
    connectError.value = undefined

    if (!connectors.value.length) {
      connectError.value = new ConnectorNotFoundError()
      return
    }

    try {
      const connector = getConnector(toRaw(connectors.value))
      const ready = await connector.ready()

      if (!ready) {
        store.toggleConnectingModal(true)
      }

      await connect(connector)

      nextTick(() => {
        store.toggleConnectingModal(false)
        if (account.value) {
          store.toggleAccountModal(true)
        }
      })
    } catch (error) {
      console.log('connect error', error)
      connectError.value = error as Error
    }
  }

  return {
    onConnect,
  }
}
