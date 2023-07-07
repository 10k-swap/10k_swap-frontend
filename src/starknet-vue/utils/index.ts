import { AccountInterface } from 'starknet4'

export const noop = (): null => null

export const isAccountInterface = (library: unknown): library is AccountInterface => {
  return !!(typeof library === 'object' && library !== null && (library as any).execute)
}
