import { number } from 'starknet'
import * as buffer from 'buffer'
import { BN } from '../types'

export function parseBN2String(value: BN | undefined) {
  return value ? number.toBN(value).toArrayLike(buffer.Buffer, 'utf-8').toString() : ''
}
