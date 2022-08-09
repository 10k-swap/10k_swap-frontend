import { ref, watch, onMounted } from 'vue'
import { useStarknet } from '../starknet-vue/providers/starknet'
import ConnectorStorageManager from '../starknet-vue/utils/ConnectorStorageManager'

export default function useConnectorWallet() {
  const {
    state: { account },
  } = useStarknet()

  const wallet = ref<string | null>(null)
  const connectorStorageManager = new ConnectorStorageManager()

  const getConnector = () => {
    if (account.value) {
      wallet.value = connectorStorageManager.get()
    }
  }

  watch([account], getConnector)
  onMounted(getConnector)

  return wallet
}
