import { defineComponent, provide, readonly, toRefs, PropType } from 'vue'
import { ProviderInterface } from 'starknet'
import { useStarknetManager } from './manager'
import { Connector } from '../../connectors'
import { StarknetMethodsSymbol, StarknetStateSymbol } from './const'

export const StarknetLibraryProvider = defineComponent({
  props: {
    defaultProvider: Object as PropType<ProviderInterface | undefined>,
    connectors: {
      type: Array as PropType<Connector[]>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const { defaultProvider, connectors } = toRefs(props)

    const { state, connect, disconnect } = useStarknetManager(defaultProvider, connectors)
    provide(StarknetStateSymbol, toRefs(readonly(state)))
    provide(StarknetMethodsSymbol, { connect, disconnect })

    return slots.default
  },
})
