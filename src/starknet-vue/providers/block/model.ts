import { GetBlockResponse } from 'starknet4'

export interface BlockState {
  block: GetBlockResponse | undefined
  loading: boolean | undefined
  error: string | undefined
}

export const INIT_BLOCK_STATE: BlockState = {
  block: undefined,
  loading: undefined,
  error: undefined,
}
