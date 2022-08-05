import { PropType, CSSProperties, defineComponent, ButtonHTMLAttributes } from 'vue'

import { createNamespace } from '../../utils'
import { ButtonSize, ButtonType } from './types'

// import { Loading, LoadingType } from '../loading'

const [name, bem] = createNamespace('button')

export default defineComponent({
  name,

  props: {
    text: String,
    color: String,
    block: Boolean,
    plain: Boolean,
    round: Boolean,
    square: Boolean,
    loading: Boolean,
    hairline: Boolean,
    disabled: Boolean,
    loadingSize: String,
    loadingText: String,
    tag: {
      type: String as PropType<keyof HTMLElementTagNameMap>,
      default: 'button',
    },
    type: {
      type: String as PropType<ButtonType>,
      default: 'default',
    },
    size: {
      type: String as PropType<ButtonSize>,
      default: 'normal',
    },
    nativeType: {
      type: String as PropType<ButtonHTMLAttributes['type']>,
      default: 'button',
    },
    iconPosition: {
      type: String as PropType<'left' | 'right'>,
      default: 'left',
    },
  },

  emits: ['click'],

  setup(props, { emit, slots }) {
    const renderLoadingIcon = () => {
      if (slots.loading) {
        return slots.loading()
      }

      // return <Loading size={props.loadingSize} type={props.loadingType} class={bem('loading')} />
    }

    const renderIcon = () => {
      if (props.loading) {
        return renderLoadingIcon()
      }

      if (slots.icon) {
        return slots.icon()
      }
    }

    const renderText = () => {
      let text
      if (props.loading) {
        text = props.loadingText
      } else {
        text = slots.default ? slots.default() : props.text
      }

      if (text) {
        return <span class={bem('text')}>{text}</span>
      }
    }

    const getStyle = () => {
      const { color, plain } = props
      if (color) {
        const style: CSSProperties = {
          color: plain ? color : 'white',
        }

        if (!plain) {
          // Use background instead of backgroundColor to make linear-gradient work
          style.background = color
        }

        // hide border when color is linear-gradient
        if (color.includes('gradient')) {
          style.border = 0
        } else {
          style.borderColor = color
        }

        return style
      }
    }

    const onClick = (event: MouseEvent) => {
      if (props.loading) {
        event.preventDefault()
      } else if (!props.disabled) {
        emit('click', event)
      }
    }

    return () => {
      const { tag, type, size, block, round, plain, square, loading, disabled, hairline, nativeType, iconPosition } = props

      const classes = [
        bem([
          type,
          size,
          {
            plain,
            block,
            round,
            square,
            loading,
            disabled,
            hairline,
          },
        ]),
      ]

      return (
        <tag type={nativeType} class={classes} style={getStyle()} disabled={disabled} onClick={onClick}>
          <div class={bem('content')}>
            {iconPosition === 'left' && renderIcon()}
            {renderText()}
            {iconPosition === 'right' && renderIcon()}
          </div>
        </tag>
      )
    }
  },
})
