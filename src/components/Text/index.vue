<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue'
import { createNamespace } from '../../utils/create'
import { TextColor, TextType } from './types'

const otherColorPrefix = (color: TextColor) => color.indexOf('text') > 0 ? color : `g-${color}`
const [, bem] = createNamespace('text')

export default defineComponent({
  props: {
    type: {
      type: String as PropType<TextType>,
      default: 'normal'
    },
    color: {
      type: String as PropType<TextColor>,
      default: 'normal'
    }
  },
  setup(props) {
    const { type, color } = toRefs(props)

    const classes = computed(() => (
      [bem([type.value, otherColorPrefix(color.value)]),]
    ))

    return {
      classes
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/index.scss';
$text-prefix: '#{$prefix}-text';

.#{$text-prefix}--large-header {
  font-weight: 700;
  font-size: $font-size-lg;
  line-height: 40px;
}

.#{$text-prefix}--sub-header {
  font-weight: 700;
  font-size: $font-size-md;
  line-height: 24px;
}

.#{$text-prefix}--header {
  font-weight: 700;
  font-size: $font-size-normal;
  line-height: 24px;
}

.#{$text-prefix}--normal {
  font-weight: 400;
  font-size: $font-size-normal;
  line-height: 24px;
}

$textColors: (
  normal: $color-primary-text,
  secondary-text: $color-secondary-text,
  description-text:$color-description-text,
  transparent-text:$color-transparent-text,
  'g-white':$color-primary,
  'g-primary':$color-white,
  'g-red':$color-red
);
$textNames: 'g-red''g-primary''g-white''normal''secondary-text''description-text''transparent-text';

@each $name in $textNames {
  .#{$text-prefix}--#{$name} {
    color: map-get($textColors, $name);
  }
}
</style>