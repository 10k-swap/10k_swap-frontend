import { number } from 'starknet4'
import { useNamingContract } from './Contract'
import { useStarknetCall } from '../starknet-vue/hooks/call'
import { computed, ComputedRef, Ref, toRaw } from 'vue'

const basicAlphabet = 'abcdefghijklmnopqrstuvwxyz0123456789-'
const basicSizePlusOne = number.toBN(basicAlphabet.length + 1)
const bigAlphabet = '这来'
const bigAlphabetSize = number.toBN(bigAlphabet.length)
const bigAlphabetSizePlusOne = number.toBN(bigAlphabet.length + 1)

export function useDecoded(encoded: bigint[]): string {
  let decoded = ''
  for (const _subdomain of encoded) {
    let subdomain = number.toBN(_subdomain.toString())
    while (!subdomain.isZero()) {
      const code = subdomain.mod(basicSizePlusOne).toNumber()
      subdomain = subdomain.div(basicSizePlusOne)
      if (code === basicAlphabet.length) {
        const nextSubdomain = subdomain.div(bigAlphabetSizePlusOne)
        if (nextSubdomain.isZero()) {
          const code2 = subdomain.mod(bigAlphabetSizePlusOne).toNumber()
          subdomain = nextSubdomain
          if (code2 === 0) decoded += basicAlphabet[0]
          else decoded += bigAlphabet[code2 - 1]
        } else {
          const code2 = subdomain.mod(bigAlphabetSize).toNumber()
          decoded += bigAlphabet[code2]
          subdomain = subdomain.div(bigAlphabetSize)
        }
      } else decoded += basicAlphabet[code]
    }
    decoded += '.'
  }
  return decoded + 'stark'
}

export function useDomainFromAddress(address: Ref<string | undefined>): ComputedRef<string | undefined> {
  const contract = useNamingContract()
  const args = computed(() => [address.value && number.toBN(address.value).toString()])
  const { state } = useStarknetCall(contract, 'address_to_domain', args, { watch: false })

  return computed(() => {
    if (!state.data || state.data?.['domain_len'] === 0n) {
      return undefined
    }
    const domain = useDecoded(toRaw(state.data.domain))
    return domain
  })
}
