import { parseUnits } from '@ethersproject/units'
import JSBI from 'jsbi'
import { Token, TokenAmount } from '../sdk'

// try to parse a user entered amount for a given token
export function tryParseAmount(value?: string | number, currency?: Token): TokenAmount | undefined {
  if (!value || !currency) {
    return undefined
  }
  value = value.toString().indexOf('e') > 0 ? JSBI.BigInt(value).toString() : value

  try {
    const typedValueParsed = parseUnits(value.toString(), currency.decimals).toString()
    if (typedValueParsed !== '0') {
      return new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.info(`Failed to parse input amount: "${value}"`, error)
  }
  // necessary for all paths to return a value
  return undefined
}
