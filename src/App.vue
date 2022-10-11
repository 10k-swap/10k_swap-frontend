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

    addPopup({
      content: {
        txn: {
          transactionHash: '0x645f86f6a7d13a60c7d17b3f392fb3cf775fac1550df8ccb4ed502f6e44f4aa',
          lastUpdatedAt: 1665479330072,
          status: 'ACCEPTED_ON_L2',
          scuccess: true,
          fail: false,
          loading: false,
          createAt: 1665478918279,
          transaction: {
            version: '0x0',
            contract_address: '0x29e407b9a95f8990eccd2baeb9645ddd165ee547ae6aebb1c9c0220c77ef065',
            entry_point_selector: '0x15d40a3d6ca2ac30f4031e42be28da9b056fef9bb7357ac5e85627ee876e5ad',
            entry_point_type: 'EXTERNAL',
            calldata: [
              '0x2',
              '0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
              '0x219209e083275171774dab1df80982e9df2096516f06319c5c6d71ae0a8480c',
              '0x0',
              '0x3',
              '0x975910cd99bc56bd289eaaa5cee6cd557f0ddafdb2ce6ebea15b158eb2c664',
              '0x2c0f7bf2d6cf5304c29171bf493feb222fef84bdaf17805a6574b0c2e8bcc87',
              '0x3',
              '0x9',
              '0xc',
              '0x975910cd99bc56bd289eaaa5cee6cd557f0ddafdb2ce6ebea15b158eb2c664',
              '0x2386f26fc10000',
              '0x0',
              '0x2386f26fc10000',
              '0x0',
              '0x94ff039453d9ea4',
              '0x0',
              '0x2',
              '0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
              '0x3e85bfbb8e2a42b7bead9e88e9a1b19dbccf661471061807292120462396ec9',
              '0x29e407b9a95f8990eccd2baeb9645ddd165ee547ae6aebb1c9c0220c77ef065',
              '0x63453f0c',
              '0x48',
            ],
            signature: [
              '0x735880146a1d54707a726a9ad5d5147122e6118cd867c8aa666d882ad0932a0',
              '0xfce574b94d1b5fccd23818aef2b1d098ecd6b702d6779d60893a30b301bfbb',
            ],
            max_fee: '0x815c2a8f7091',
            type: 'INVOKE_FUNCTION',
          },
          metadata: {
            message: 'Approve 0.01 ETH & Swap 0.01 ETH for 0.672 DAI',
          },
        },
      },
    })

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
