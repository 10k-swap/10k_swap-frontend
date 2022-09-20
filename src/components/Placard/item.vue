<template>
  <div :class="classes" v-show="show" v-html="placard?.content"></div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { Placard } from './types'
import { createNamespace } from '../../utils/create'

const [, bem] = createNamespace('placard')

export default defineComponent({
  props: {
    placard: Object as PropType<Placard>,
  },
  setup(props) {
    const {
      state: { chainId },
    } = useStarknet()
    const { placard } = toRefs(props)

    const show = computed(() => chainId.value && placard.value?.chainIds.includes(chainId.value))

    const classes = computed(() => [bem([placard.value?.type ?? 'info'])])

    return {
      show,

      classes,
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/index.scss';
$placard-prefix: '#{$prefix}-placard';

.#{$placard-prefix} {
  padding: 12px 5px;
  color: $color-white;
  text-align: center;
  font-weight: 500;
  @include mobile {
    padding: 12px;
    text-align: left;
  }
  a {
    color: $color-white;
    font-weight: 600;
  }
  &--warning {
    background: $color-black;
  }
  &--error {
    background: $color-red;
  }
  &--info {
    background: $color-primary;
  }
}
</style>
