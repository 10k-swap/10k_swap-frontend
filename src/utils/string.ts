import { number } from 'starknet'
import * as buffer from 'buffer'
import { BN } from '../types'

export function BN2String(value: BN | undefined) {
  if (!value) {
    return ''
  }
  return number.toBN(value).toArrayLike(buffer.Buffer, 'utf-8').toString()
}
