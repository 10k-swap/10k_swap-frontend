export enum SwapReverses {
  Reversed,
  NotReverse,
}

export enum TransactionType {
  Mint = 'Mint',
  Swap = 'Swap',
  Burn = 'Burn',
}

export interface Transaction {
  created_by: string
  updated_by: string
  published_at: null
  created_at: string
  updated_at: string
  deleted_at: null
  id: string
  pair_address: string
  event_id: string
  transaction_hash: string
  key_name: TransactionType
  account_address: string
  event_time: string
  amount0: string
  amount1: string
  swap_reverse: SwapReverses
  fee: string
  token0: {
    address: string
    name: string
    symbol: string
    decimals: number
  }
  token1: {
    address: string
    name: string
    symbol: string
    decimals: number
  }
  amount0_human: string
  amount1_human: string
  fee_usd: number | ''
}

export interface Summary {
  total: number
  profits: {
    address: string
    name: string
    symbol: string
    decimals: number
    amount: string
    amountHuman: string
  }[]
}

export interface Pair {
  APR: string
  decimals: number
  fees24h: number
  feesTotal: number
  liquidity: number
  pairAddress: string
  reserve0: string
  reserve1: string
  token0: {
    address: string
    name: string
    symbol: string
    decimals: number
  }
  token1: {
    address: string
    name: string
    symbol: string
    decimals: number
  }
  totalSupply: string
  volume7d: number
  volume24h: number
}
