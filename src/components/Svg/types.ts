import { CSSProperties, PropType } from 'vue'

export type SvgColor = 'normal' | 'primary' | 'white' | 'secondary' | 'red' | 'minor' | 'transparent' | 'none' | 'blue'

export const SvgProps = {
  color: {
    type: String as PropType<SvgColor>,
    default: 'normal',
  },
  style: {
    type: Object as PropType<CSSProperties>,
    default: () => null,
  },
  width: {
    type: String,
    default: undefined,
  },
}
