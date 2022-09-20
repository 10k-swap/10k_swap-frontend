import { ref, watch, onMounted } from 'vue'
import { useStarknet } from '../starknet-vue/providers/starknet'
import ConnectorStorageManager from '../starknet-vue/utils/ConnectorStorageManager'

const wallets: { [k: string]: string } = {
  argentx: 'Argent X',
  braavos: 'Braavos',
}

export default function useConnectorWallet() {
  const {
    state: { account },
  } = useStarknet()

  const wallet = ref<string | null>(null)

  const getConnector = () => {
    if (account.value) {
      const id = ConnectorStorageManager.get()
      wallet.value = id ? wallets[id.replace(/-|\s/g, '').toLowerCase()] ?? id : null
    }
  }

  watch([account], getConnector)
  onMounted(getConnector)

  return wallet
}
