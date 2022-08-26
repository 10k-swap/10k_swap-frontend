import { Contract, Result } from 'starknet'
import * as objectHash from 'object-hash'
import { computed, ComputedRef, onMounted, reactive, watch } from 'vue'
import { BN } from '../../utils'
import { useStarknetBlock } from '../providers/block'

interface State {
  data?: Result | undefined
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

function toCallKey(address: string, method: string, block: string | undefined, data: string): string {
  return `${address}-${method}-${block}-${data}`
}

function argsToHash(args: any) {
  return objectHash.sha1(JSON.stringify(args))
}

const caches: {
  [key: string]: Result
} = {}

export function useStarknetCall<T extends unknown[]>(
  contract: ComputedRef<Contract | undefined>,
  method: string,
  args?: ComputedRef<T | undefined> | [],
  options?: UseStarknetCallOptions | undefined
): UseStarknetCall & { state: State } {
  const state = reactive<State>({
    data: undefined,
    loading: false,
    error: undefined,
    lastUpdatedAt: '',
  })

  const { block } = useStarknetBlock()

  // default to true
  const sholudWatch = options?.watch !== undefined ? options.watch : true

  const callContract = async () => {
    if (contract.value && method) {
      const arg = Array.isArray(args) ? args : args && args.value ? args.value : []

      const key = toCallKey(contract.value.address, method, block.value?.block_hash, argsToHash(arg))
      const current = caches[key]
      if (current) {
        return current
      }
      try {
        const result = await contract.value.call(method, arg)
        caches[key] = result
        return result
      } catch (error) {
        console.log('call:call error', error)
        throw error
      }
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

  const arg = computed(() => (Array.isArray(args) ? args : args?.value ? args.value : undefined))
  watch([contract, arg], () => {
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
  data: Array<(BN[] & { [key: string]: BN }) | undefined>
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
  const sholudWatch = options?.watch !== undefined ? options.watch : true

  const callContract = async () => {
    if (contracts.value && methods.value) {
      const calls = contracts.value.map(async (contract, i) => {
        const args = argsList && argsList.value?.[i] ? argsList.value[i] : []
        const method = methods.value && methods.value?.[i] ? methods.value?.[i] : ''
        const key = toCallKey(contract.address, method, block.value?.block_hash, argsToHash(args))
        const current = caches[key]

        if (current) {
          return current
        }

        try {
          const result: Result = await contract.call(method, args)
          caches[key] = result
          return result
        } catch (error) {
          console.log('calls:call error', error)
          return undefined
        }
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

  const arg = computed(() => (argsList?.value ? argsList.value : undefined))
  watch([contracts, arg], () => {
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
