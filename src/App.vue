<template>
  <StarknetProvider :connectors="connectors" @transaction-refresh="onTransactionRefresh">
    <AppBody>
      <router-view />
    </AppBody>
  </StarknetProvider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppBody from './pages/AppBody/index.vue'
import { getInstalledInjectedConnectors } from './starknet-vue/connectors'
import { StarknetProvider } from './starknet-vue/providers/index'
import { TransactionRefreshData } from './starknet-vue/providers/transaction'
import { useAddPopup } from './state/application/hooks'

const connectors = getInstalledInjectedConnectors()

export default defineComponent({
  components: {
    AppBody,
    StarknetProvider,
  },
  setup() {
    const addPopup = useAddPopup()

    const onTransactionRefresh = ({ newTransaction, oldTransaction }: TransactionRefreshData) => {
      const { loading: oldLoading } = oldTransaction
      const { loading: newLoading } = newTransaction

      // transaction state change
      if (oldLoading !== newLoading) {
        addPopup({
          content: {
            txn: newTransaction,
          },
        })
      }
    }

    return {
      connectors: connectors,

      onTransactionRefresh,
    }
  },
})
</script>
