import { CSS_PREFIX } from '../../constants'
import { createBEM } from './bem'

export function createNamespace(name: string) {
  const prefixedName = `${CSS_PREFIX}-${name}`
  return [prefixedName, createBEM(prefixedName)] as const
}
