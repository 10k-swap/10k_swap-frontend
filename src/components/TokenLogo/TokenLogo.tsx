import { computed, defineComponent, PropType, ref, toRefs, watch } from 'vue'
import { Token } from '../../sdk'

export default defineComponent({
  props: {
    alt: String,
    token: {
      type: Object as PropType<Token>,
    },
    width: {
      type: Number,
      default: 24,
    },
    height: {
      type: Number,
      default: 24,
    },
  },

  setup(props) {
    const hasError = ref(false)

    const { token, alt, width, height } = toRefs(props)

    const src = computed(() => {
      if (hasError.value || !token.value) {
        return `./images/coins/default.png`
      }

      return `./images/coins/${token.value.address}.png`
    })

    watch(token, () => (hasError.value = false))

    return () => <img src={src.value} alt={alt.value} width={width.value} height={height.value} onError={() => (hasError.value = true)} />
  },
})
