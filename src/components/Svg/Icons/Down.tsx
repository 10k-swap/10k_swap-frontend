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
      <Svg viewBox="0 0 12 12" {...props}>
        <path
          d="M11 6.36585L5.90909 11M5.90909 11L1 6.36585M5.90909 11V1"
          stroke="#999999"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </Svg>
    )
  },
})
