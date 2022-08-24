import { computed, defineComponent, PropType, ref, toRefs, watch } from 'vue'
import { Token } from '../../sdk'

const BADS: { [url: string]: true } = {}

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
        return `./images/coins/default.png`
      }
      const url = `./images/coins/${token.value.address}.png`
      if (BADS[url]) {
        return `./images/coins/default.png`
      }
      return url
    })

    watch(token, () => (hasError.value = false))

    const onError = () => {
      BADS[src.value] = true
      hasError.value = true
    }

    return () => <img src={src.value} alt={alt.value} width={size.value} height={size.value} onError={onError} />
  },
})
