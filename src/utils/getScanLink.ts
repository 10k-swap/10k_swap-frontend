import { StarknetChainId } from '../constants'

const SCAN_PREFIXES: { [chainId in StarknetChainId]: string } = {
  [StarknetChainId.MAINNET]: 'https://voyager.online',
  [StarknetChainId.TESTNET]: 'https://goerli.voyager.online',
}

export function getScanLink(chainId: StarknetChainId, data: string, type: 'transaction' | 'address'): string {
  const prefix = SCAN_PREFIXES[chainId]

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/contract/${data}`
    }
  }
}
