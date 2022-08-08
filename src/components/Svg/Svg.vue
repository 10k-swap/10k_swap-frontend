<template>
  <svg :class="classes" :style="{ ...style, width }" :viewBox="viewBox">
    <slot></slot>
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue'
import { createNamespace } from '../../utils/create'
import { SvgColor, SvgProps } from './types'

const [, bem] = createNamespace('svg')
const normalColor = (color: SvgColor) => ['white', 'primary'].includes(color) ? color : `g-${color}`

export default defineComponent({
  props: {
    ...SvgProps,
    viewBox: {
      type: String as PropType<string>,
      default: '0 0 24 24',
    },
  },
  setup(props) {
    const { color, style, viewBox, width } = toRefs(props)
    const classes = computed(() => ([bem([normalColor(color.value)]),]))

    return {
      classes,
      style,
      viewBox,
      width
    }
  }
})
</script>

<style lang="scss">
@import '../../styles/index.scss';
$text-prefix: '#{$prefix}-svg';

.#{$text-prefix} {
  width: 24px;
}

$colors: (
  normal: $color-primary-text,
  'g-white':$color-primary,
  'g-primary':$color-white
);
$textNames: 'g-primary''g-white';

@each $name in $textNames {
  .#{$text-prefix}--#{$name} {
    color: map-get($colors, $name);
  }
}
</style>