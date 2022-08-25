import { validateAndParseAddress as getAddress } from 'starknet/utils/address'
import { ADDRESS_ZORE } from '../constants'

export function isAddress(address: any): string | false {
  try {
    const parsed = getAddress(address)
    return parsed === ADDRESS_ZORE ? false : address
  } catch (error) {
    return false
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4) {
  if (!address) {
    return ''
  }
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`
}
