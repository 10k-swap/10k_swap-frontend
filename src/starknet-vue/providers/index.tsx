import { ProviderInterface } from 'starknet'
import { defineComponent, PropType, toRefs } from 'vue'

import { StarknetBlockProvider } from './block'
import { StarknetTransactionManagerProvider, TransactionRefreshData } from './transaction'
import { StarknetLibraryProvider } from './starknet'
import { Connector } from '../connectors'
import { InjectedConnectorOptions } from '../connectors/injected'

export const StarknetProvider = defineComponent({
  props: {
    defaultProvider: Object as PropType<ProviderInterface>,
    connectors: {
      type: Array as PropType<Connector<InjectedConnectorOptions>[]>,
      required: true,
    },
  },
  emits: ['transactionRefresh'],
  setup(props, { slots, emit }) {
    const { defaultProvider, connectors } = toRefs(props)

    return () => (
      <StarknetLibraryProvider defaultProvider={defaultProvider.value} connectors={connectors.value}>
        <StarknetBlockProvider>
          <StarknetTransactionManagerProvider onTransactionRefresh={(data: TransactionRefreshData) => emit('transactionRefresh', data)}>
            {slots.default && slots.default()}
          </StarknetTransactionManagerProvider>
        </StarknetBlockProvider>
      </StarknetLibraryProvider>
    )
  },
})
