import { defineComponent } from 'vue'
import Svg from '../Svg.vue'
import { SvgProps } from '../types'

export default defineComponent({
  props: {
    ...SvgProps,
  },
  components: {
    Svg,
  },
  setup(props) {
    return () => (
      <Svg viewBox="0 0 28 28" {...props}>
        <rect width="28" height="28" rx="8" fill="#111111" />
        <path
          d="M6 9.90909L8.90909 7M8.90909 7L11.8182 9.90909M8.90909 7V17.1818C8.90909 17.9534 9.21558 18.6933 9.76114 19.2389C10.3067 19.7844 11.0466 20.0909 11.8182 20.0909H13.2727M22 17.1818L19.0909 20.0909M19.0909 20.0909L16.1818 17.1818M19.0909 20.0909V9.90909C19.0909 9.13755 18.7844 8.39761 18.2389 7.85205C17.6933 7.30649 16.9534 7 16.1818 7H14.7273"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </Svg>
    )
  },
})
