import { Contract } from 'starknet'
import { ComputedRef, onMounted, reactive, watch } from 'vue'
import { useStarknetBlock } from '../providers/block'

interface State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Array<any>
  loading: boolean
  error?: string
  lastUpdatedAt: string
}

interface UseStarknetCallOptions {
  watch?: boolean
}

export interface UseStarknetCall {
  refresh: () => void
}

export function useStarknetCall<T extends unknown[]>(
  contract: ComputedRef<Contract | undefined>,
  method: string,
  args: ComputedRef<T | undefined>,
  options?: UseStarknetCallOptions | undefined
): UseStarknetCall & { state: State } {
  const state = reactive<State>({
    data: [],
    loading: false,
    error: undefined,
    lastUpdatedAt: '',
  })

  const { block } = useStarknetBlock()

  // default to true
  const sholudWatch = options?.watch !== undefined ? options.watch : false

  const callContract = async () => {
    if (contract.value && method && args.value) {
      return await contract.value.call(method, args.value)
    }
  }

  const refresh = () => {
    state.loading = true

    callContract()
      .then((response) => {
        if (response) {
          state.data = response
        }
      })
      .catch((err) => {
        if (err.message) {
          state.error = err.message
        } else {
          state.error = 'call failed'
        }
      })
      .finally(() => {
        state.loading = false
      })
  }

  onMounted(() => {
    refresh()
  })

  watch([contract, args], () => {
    refresh()
  })

  watch([block], () => {
    if (block.value?.block_hash && sholudWatch) {
      if (block.value.block_hash === state.lastUpdatedAt) {
        return
      }
      refresh()
      state.lastUpdatedAt = block.value.block_hash
    }
  })

  return { state, refresh }
}

interface CallsState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Array<any>
  loading: boolean
  error?: string
  lastUpdatedAt: string
}

export function useStarknetCalls<T extends unknown[]>(
  contracts: ComputedRef<Contract[] | undefined>,
  methods: ComputedRef<string[] | undefined>,
  argsList?: ComputedRef<T[] | undefined>,
  options?: UseStarknetCallOptions | undefined
): UseStarknetCall & { states: CallsState } {
  const states = reactive<CallsState>({
    data: [],
    loading: false,
    error: undefined,
    lastUpdatedAt: '',
  })

  const { block } = useStarknetBlock()

  // default to false
  const sholudWatch = options?.watch !== undefined ? options.watch : false

  const callContract = async () => {
    if (contracts.value && methods.value) {
      const calls = contracts.value.map((contract, i) => {
        const args = argsList && argsList.value?.[i] ? argsList.value[i] : undefined
        return contract.call(methods.value?.[i] as string, args)
      })
      return await Promise.all(calls)
    }
  }

  const refresh = () => {
    states.loading = true

    callContract()
      .then((response) => {
        if (response) {
          states.data = response
        }
      })
      .catch((err) => {
        if (err.message) {
          states.error = err.message
        } else {
          states.error = 'call failed'
        }
      })
      .finally(() => {
        states.loading = false
      })
  }

  onMounted(() => {
    refresh()
  })

  watch([contracts, argsList], () => {
    refresh()
  })

  watch([block], () => {
    if (block.value?.block_hash && sholudWatch) {
      if (block.value.block_hash === states.lastUpdatedAt) {
        return
      }
      refresh()
      states.lastUpdatedAt = block.value.block_hash
    }
  })

  return { states, refresh }
}
