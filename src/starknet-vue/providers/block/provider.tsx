import { defineComponent, onBeforeUnmount, onMounted, toRefs, watch, readonly, provide, reactive } from 'vue'
import { GetBlockResponse } from 'starknet'
import { useStarknet } from '../starknet'
import { DEFAULT_INTERVAL, StarknetBlockStateSymbol } from './const'
import { BlockState, INIT_BLOCK_STATE } from './model'
import useIsWindowVisible from '../../../hooks/useIsWindowVisible'

let intervalId: number

export const StarknetBlockProvider = defineComponent({
  props: {
    interval: Number,
  },
  setup(props, { slots }) {
    const { interval } = toRefs(props)

    const state = reactive<BlockState>(INIT_BLOCK_STATE)

    const isWindowVisible = useIsWindowVisible()

    // 使用 `toRefs()` 确保其在消费者组件中广泛可用
    // 而 `readonly()` 预防了用户修改全局状态
    provide(StarknetBlockStateSymbol, toRefs(readonly(state)))

    const {
      state: { library },
    } = useStarknet()

    const fetchBlock = () => {
      if (library && !state.loading && isWindowVisible.value) {
        // Set to loading on first load
        state.loading = true
        library.value
          .getBlock()
          .then((newBlock: GetBlockResponse) => {
            // The new block is a different object from the old one
            // so simply updating the value of block would cause the state
            // to change and trigger a re-render.
            // This is especially bad because the block is used to trigger
            // state updates downstream.
            // Compare the new and old block hashes and update only if
            // they changed. Notice we use hashes and not block numbers
            // because we want to update the block in case of rollbacks.
            if (state.block?.block_hash !== newBlock.block_hash) {
              state.block = newBlock
            }
            // Reset error and return new block.
            state.error = undefined
          })
          .catch(() => {
            state.error = 'failed fetching block'
          })
          .finally(() => (state.loading = false))
      }
    }

    const onFetch = () => {
      // Fetch block immediately
      fetchBlock()

      intervalId = window.setInterval(() => {
        fetchBlock()
      }, interval.value ?? DEFAULT_INTERVAL)
    }

    onMounted(onFetch)
    watch([library, interval, isWindowVisible], onFetch)

    onBeforeUnmount(() => clearInterval(intervalId))

    return slots.default
  },
})
