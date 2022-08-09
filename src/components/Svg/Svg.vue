<template>
  <svg :class="classes" :style="{ ...style, width }" :viewBox="viewBox" :fill="fill">
    <slot></slot>
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue'
import { createNamespace } from '../../utils/create'
import { SvgColor, SvgProps } from './types'

const [, bem] = createNamespace('svg')
const normalColor = (color: SvgColor) => ['white', 'red', 'primary'].includes(color) ? `g-${color}` : color

export default defineComponent({
  props: {
    ...SvgProps,
    fill: String,
    viewBox: {
      type: String as PropType<string>,
      default: '0 0 24 24',
    },
  },
  setup(props) {
    const { color, style, viewBox, width, fill } = toRefs(props)
    const classes = computed(() => ([bem([normalColor(color.value)])]))

    return {
      classes,
      style,
      viewBox,
      width,
      fill
    }
  }
})
</script>

<style lang="scss">
@import '../../styles/index.scss';
$svg-prefix: '#{$prefix}-svg';
$colors: (
  'normal': $color-primary-text,
  'secondary': $color-secondary-text,
  'minor': $color-description-text,
  'transparent':$color-transparent-text,
  'g-white':$color-white,
  'g-primary':$color-primary,
  'g-red':$color-red
);
$textNames: 'g-red''g-primary''g-white''secondary''minor''normal''transparent';

.#{$svg-prefix} {
  width: 24px;

  @each $name in $textNames {
    &--#{$name} {
      fill: map-get($colors, $name);
    }
  }
}
</style>