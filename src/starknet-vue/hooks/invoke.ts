import { AddTransactionResponse, Contract, Overrides } from 'starknet'
import { ComputedRef, reactive } from 'vue'
import { useStarknetTransactionManager } from '../providers/transaction/hooks'

interface State {
  data?: string | undefined
  loading: boolean | undefined
  error?: string | undefined
}

export interface InvokeArgs<T extends unknown[]> {
  args: T
  overrides?: Overrides
  metadata?: {
    method?: string
    message?: string
  }
}

export interface UseStarknetInvoke<T extends unknown[]> {
  state: State
  reset: () => void
  invoke: ({ args, metadata }: InvokeArgs<T>) => Promise<AddTransactionResponse | undefined>
}

const INIT_STATE = {
  data: undefined,
  loading: false,
  error: undefined,
}

export function useStarknetInvoke<T extends unknown[]>(contract: ComputedRef<Contract | undefined>, method: string): UseStarknetInvoke<T> {
  const { addTransaction } = useStarknetTransactionManager()
  const state = reactive<State>(INIT_STATE)

  const reset = () => {
    state.data = undefined
    state.loading = false
    state.error = undefined
  }

  const invoke = async ({ args, overrides, metadata }: InvokeArgs<T>) => {
    if (!contract.value) {
      throw new Error('invoke: contract is undefined')
    }

    if (method && args && !state.loading) {
      try {
        state.loading = true
        const response = await contract.value.invoke(method, args, overrides)
        state.data = response.transaction_hash
        // start tracking the transaction
        addTransaction({
          status: response.code,
          transactionHash: response.transaction_hash,
          metadata,
        })
        return response
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        console.error(message)
        state.error = message
      } finally {
        state.loading = false
      }
    }
    return undefined
  }

  return { state, reset, invoke }
}
