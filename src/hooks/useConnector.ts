import { computed, nextTick, ref, watch } from 'vue'
import { Connector } from '../starknet-vue/connectors'
import { InjectedConnectorOptions } from '../starknet-vue/connectors/injected'
import { UserRejectedRequestError } from '../starknet-vue/errors'
import { useStarknet } from '../starknet-vue/providers/starknet'
import { useModalStore } from '../state'
import useArgentXRejectCallback from './useArgentXRejectCallback'

export default function useConnector() {
  const connectError = ref<Error>()

  const store = useModalStore()

  const {
    state: { account },
    connect,
  } = useStarknet()

  const showConnectingModal = computed(() => store.showConnectingModal)

  watch(connectError, (newErr) => {
    if (!newErr) {
      return
    }

    if (showConnectingModal.value) {
      store.toggleConnectingModal(false)
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

  const onConnect = async (connector: Connector<InjectedConnectorOptions>) => {
    connectError.value = undefined

    try {
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
