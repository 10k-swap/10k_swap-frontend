import { number } from 'starknet'
import * as buffer from 'buffer'

export type BN = ReturnType<typeof number.toBN>

export function BN2String(value: BN | undefined) {
  if (!value) {
    return ''
  }
  return number.toBN(value).toArrayLike(buffer.Buffer, 'utf-8').toString()
}
