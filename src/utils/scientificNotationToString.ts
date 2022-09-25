// parse scientific notation to string, like this 1e5->10000
export function scientificNotationToString(param: string) {
  if (!/e/.test(param)) {
    return param
  }

  let sysbol = true
  if (/e-/.test(param)) {
    sysbol = false
  }

  const index = Number(param.match(/\d+$/)?.[0])
  const basis = param.match(/^[\d.]+/)?.[0].replace(/\./, '')

  if (!basis) {
    return param
  }

  return sysbol ? basis.padEnd(index + 1, '0') : basis.padStart(index + (basis?.length ?? 0), '0').replace(/^0/, '0.')
}
