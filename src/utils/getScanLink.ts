import { StarknetChainId } from 'l0k_swap-sdk'

// const SCAN_PREFIXES: { [chainId in StarknetChainId]: string } = {
//   [StarknetChainId.MAINNET]: 'https://voyager.online',
//   [StarknetChainId.TESTNET]: 'https://goerli.voyager.online',
// }
const SCAN_PREFIXES: { [chainId in StarknetChainId]: string } = {
  [StarknetChainId.MAINNET]: 'https://starkscan.co',
  [StarknetChainId.TESTNET]: 'https://testnet.starkscan.co',
}

export function getScanLink(chainId: StarknetChainId, data: string, type: 'transaction' | 'contract'): string {
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
