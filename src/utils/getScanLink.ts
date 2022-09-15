import { ChainId } from 'l0k_swap-sdk'

const SCAN_PREFIXES: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://voyager.online',
  [ChainId.TESTNET]: 'https://goerli.voyager.online',
}

export function getScanLink(chainId: ChainId, data: string, type: 'transaction' | 'contract'): string {
  const prefix = SCAN_PREFIXES[chainId]

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'contract': {
      return `${prefix}/contract/${data}`
    }
    default: {
      return `${prefix}`
    }
  }
}
