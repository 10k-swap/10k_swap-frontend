import { ProviderInterface } from 'starknet'
import { defineComponent, PropType, toRefs } from 'vue'

import { StarknetBlockProvider } from './block'
import { StarknetTransactionManagerProvider } from './transaction'
import { StarknetLibraryProvider } from './starknet'
import { Connector } from '../connectors'

export const StarknetProvider = defineComponent({
  props: {
    defaultProvider: Object as PropType<ProviderInterface>,
    connectors: {
      type: Array as PropType<Connector[]>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const { defaultProvider, connectors } = toRefs(props)

    return () => (
      <StarknetLibraryProvider
        defaultProvider={defaultProvider.value}
        connectors={connectors.value}
      >
        <StarknetBlockProvider>
          <StarknetTransactionManagerProvider>{slots.default && slots.default()}</StarknetTransactionManagerProvider>
        </StarknetBlockProvider>
      </StarknetLibraryProvider>
    )
  },
})
