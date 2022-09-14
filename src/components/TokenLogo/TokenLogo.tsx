import { computed, defineComponent, PropType, ref, toRefs, watch } from 'vue'
import { Token } from 'l0k_swap-sdk'

const BADS: { [url: string]: true } = {}

function stringToColor(str: string) {
  const hash = Array.from({ length: str.length }).reduce<number>((hash, _, i) => str.charCodeAt(i) + (hash << 5) - hash, 0)
  const color = Math.floor(Math.abs(((Math.sin(hash) * 10000) % 1) * 16777216)).toString(16)

  return Array(6 - color.length + 1).join('0') + color
}
function getDefaultUrl(token: Token | undefined) {
  const symbol = token?.symbol ?? 'token'
  return `https://eu.ui-avatars.com/api/?name=${symbol}&background=${stringToColor(symbol)}&color=fff&length=3&rounded=true&size=24`
}

export default defineComponent({
  props: {
    alt: String,
    token: {
      type: Object as PropType<Token | null | undefined>,
    },
    size: {
      type: Number,
      default: 24,
    },
  },

  setup(props) {
    const hasError = ref(false)

    const { token, alt, size } = toRefs(props)

    const src = computed(() => {
      if (hasError.value || !token.value) {
        return getDefaultUrl(token.value ?? undefined)
      }

      const url = `./images/coins/${token.value.address}.png`
      return BADS[url] ? getDefaultUrl(token.value) : url
    })

    watch(token, () => (hasError.value = false))

    const onError = () => {
      BADS[src.value] = true
      hasError.value = true
    }

    return () => <img src={src.value} alt={alt.value} width={size.value} height={size.value} onError={onError} />
  },
})
