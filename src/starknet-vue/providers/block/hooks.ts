import { inject, toRefs, ToRefs } from 'vue'
import { StarknetBlockStateSymbol } from './const'
import { BlockState, INIT_BLOCK_STATE } from './model'

export function useStarknetBlock(): ToRefs<BlockState> {
  const state = inject<ToRefs<BlockState>>(StarknetBlockStateSymbol)

  return state ?? toRefs(INIT_BLOCK_STATE)
}
