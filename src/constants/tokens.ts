import { StarknetChainId } from 'starknet/constants'
import { Token } from '../sdk'

const tokens: { [chainId in StarknetChainId]: Token[] } = {
  [StarknetChainId.MAINNET]: [],
  [StarknetChainId.TESTNET]: [
    new Token(StarknetChainId.TESTNET, '0x01f16ff16e38786750800d81b89f442e7c88a282b58929516921115e551a14cf', 18, 'TKA', 'TestMainnet Token'),
    new Token(StarknetChainId.TESTNET, '0x06dd5d9a4fa06d10afb39ae267ac6d3999e36e16d160082cf5c612e4ed944f2b', 18, 'TKB', 'TestMainnet Token'),
    new Token(StarknetChainId.TESTNET, '0x0107de6ea0ab3ba87b08eff2a8cde01332aec64fb15a7196b837871adbc38699', 18, 'TKC', 'TestMainnet Token'),
    new Token(StarknetChainId.TESTNET, '0x0084cad938d01c8b706a07f46ed4e336e41f36d1191b3ffc16cb70068c965bc4', 18, 'TKD', 'TestMainnet Token'),
    // new Token(StarknetChainId.TESTNET, '0x055ae6909088751ccbe4d5ad4653c037ce98798e4ce9bae451b22d43b9cd1ced', 6, 'TKF', 'TestMainnet Token'),
    // new Token(StarknetChainId.TESTNET, '0x03e14d3e29e25b676f31dcbd5b745206a1f0fb7934409bdee0a932e316b14b3e', 6, 'TKE', 'TestMainnet Token'),
  ],
}

export default tokens
