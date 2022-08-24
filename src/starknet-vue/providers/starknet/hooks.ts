import { inject, toRefs, ToRefs } from 'vue'
import { StarknetState, StarknetMethods, STARKNET_INITIAL_STATE } from './model'
import { StarknetStateSymbol, StarknetMethodsSymbol } from './const'
import { noop } from '../../utils'
import { ConnectorNotFoundError } from '../../errors'

export function useStarknet(): StarknetMethods & { state: ToRefs<StarknetState> } {
  const state = inject<ToRefs<StarknetState>>(StarknetStateSymbol)
  const methods = inject<StarknetMethods>(StarknetMethodsSymbol) ?? {
    connect: () => Promise.reject(new ConnectorNotFoundError()),
    disconnect: noop,
  }

  if (state) {
    return {
      state,
      ...methods,
    }
  }

  return {
    state: toRefs(STARKNET_INITIAL_STATE),
    ...methods,
  }
}
