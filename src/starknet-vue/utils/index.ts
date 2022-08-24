import { AccountInterface, ProviderInterface } from 'starknet'

export const noop = (): null => null

export const isAccountInterface = (library: AccountInterface | ProviderInterface): library is AccountInterface => {
  return !!(library as AccountInterface)?.execute
}
