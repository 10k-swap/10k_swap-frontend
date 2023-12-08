import { number } from 'starknet4'
import * as buffer from 'buffer'

export function parseBN2String(value: bigint | undefined): string {
  const _value = value ? number.toBN(value.toString()) : undefined

  return _value ? number.toBN(_value).toArrayLike(buffer.Buffer, 'utf-8').toString() : ''
}
