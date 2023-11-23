import { number } from 'starknet'
import * as buffer from 'buffer'
import { toBN } from 'starknet/utils/number'

export function parseBN2String(value: bigint | undefined): string {
  const _value = value ? toBN(value.toString()) : undefined

  return _value ? number.toBN(_value).toArrayLike(buffer.Buffer, 'utf-8').toString() : ''
}
