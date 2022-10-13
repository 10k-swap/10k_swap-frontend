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
      <Svg viewBox="0 0 20 20" {...props}>
        <path
          d="M9.99935 18.3332C5.39685 18.3332 1.66602 14.6023 1.66602 9.99984C1.66602 5.39734 5.39685 1.6665 9.99935 1.6665C14.6018 1.6665 18.3327 5.39734 18.3327 9.99984C18.3327 14.6023 14.6018 18.3332 9.99935 18.3332ZM10.8327 9.99984V5.83317H9.16602V11.6665H14.166V9.99984H10.8327Z"
          fill="#FE5B00"
        />
      </Svg>
    )
  },
})
