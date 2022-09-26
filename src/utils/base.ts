import { TokenAmount, JSBI } from 'l0k_swap-sdk'
import { toBN } from 'starknet/utils/number'
import { SupporteChainId } from '../constants'

export function noop() {}

export const extend = Object.assign

/**
 * Returns true if the string value is zero in hex
 * @param hexNumberString
 */
export default function isZero(hexNumberString: string) {
  return /^0x0*$/.test(hexNumberString)
}

export function calculateSlippageAmount(value: TokenAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000)),
  ]
}

export function getDeadlineFromNow(ttl: number) {
  return `${(Math.floor(new Date().getTime() / 1000) + ttl).toString()}`
}

export function isEqualsAddress(addressA: string, addressB: string): boolean {
  return toBN(addressA).eq(toBN(addressB))
}

export function isSupportedChain(chainId: string | undefined) {
  return !!chainId && chainId === SupporteChainId
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}
