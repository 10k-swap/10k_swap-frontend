import { Overrides } from 'starknet'
import { InvokeFunctionResponse, Call, Abi } from 'starknet4'
import { ComputedRef, reactive, toRaw } from 'vue'
import { useStarknet } from '../providers/starknet'
import { useStarknetTransactionManager } from '../providers/transaction/hooks'
import { isAccountInterface } from '../utils'

interface State {
  data?: string | undefined
  loading: boolean | undefined
  error?: string | undefined
}

export interface ExecuteArgs<T extends unknown[]> {
  args: T[]
  overrides?: Overrides
  metadata?: {
    method?: string
    message?: string
  }
}

export interface UseStarknetExecute<T extends unknown[]> {
  state: State
  reset: () => void
  execute: ({ args, metadata }: ExecuteArgs<T>) => Promise<InvokeFunctionResponse | undefined>
}

const INIT_STATE = {
  data: undefined,
  loading: false,
  error: undefined,
}

export function useStarknetExecute<T extends unknown[]>(
  contractAddresses: ComputedRef<string[] | undefined>,
  abis: Abi[],
  methods: string[]
): UseStarknetExecute<T> {
  const {
    state: { library },
  } = useStarknet()

  const { addTransaction } = useStarknetTransactionManager()
  const state = reactive<State>(INIT_STATE)

  const reset = () => {
    state.data = undefined
    state.loading = false
    state.error = undefined
  }

  const execute = async ({ args, overrides, metadata }: ExecuteArgs<T>) => {
    if (!contractAddresses.value) {
      throw new Error('execute: contract is undefined')
    }

    const libraryRaw = toRaw(library.value)

    if (!isAccountInterface(libraryRaw)) {
      throw new Error('execute: library not a AccountInterface')
    }

    if (methods && args && !state.loading) {
      try {
        state.loading = true

        const transactions: Call[] = contractAddresses.value.map((address, i) => ({
          contractAddress: address,
          entrypoint: methods[i],
          calldata: args[i],
        }))
        const response = await libraryRaw.execute(transactions, abis, overrides)
        state.data = response.transaction_hash
        // start tracking the transaction
        addTransaction({
          status: 'RECEIVED',
          transactionHash: response.transaction_hash,
          metadata,
        })
        return response
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        state.error = message
        console.log(message)
      } finally {
        state.loading = false
      }
    }
    return undefined
  }

  return { state, reset, execute }
}
