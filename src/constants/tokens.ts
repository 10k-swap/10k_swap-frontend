import { StarknetChainId } from 'starknet/constants'
import { Token } from '../sdk'

const tokens: { [chainId in StarknetChainId]: Token[] } = {
  [StarknetChainId.MAINNET]: [],
  [StarknetChainId.TESTNET]: [
    new Token(StarknetChainId.MAINNET, '0x01f16ff16e38786750800d81b89f442e7c88a282b58929516921115e551a14cf', 18, 'TKA', 'TestMainnet Token'),
    new Token(StarknetChainId.MAINNET, '0x06dd5d9a4fa06d10afb39ae267ac6d3999e36e16d160082cf5c612e4ed944f2b', 18, 'TKB', 'TestMainnet Token'),
  ],
}

export default tokens
