<template>
  <div class="l0k-swap-pair-modal-tabs">
    <Button class="l0k-swap-pair-modal-tab" :class="{ active: item.value === current }" v-for="item in tabs"
      :key="item.value" :type="item.value === current ? 'primary' : 'text'" :size="'small'"
      @click="onChange(item.value)">
      {{ item.label }}
    </Button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Actions } from '../../state/poolModal'
import Button from '../Button/Button'

export default defineComponent({
  components: {
    Button
  },
  emits: ['change'],
  props: {
    tabs: {
      type: Array as PropType<{ label: string, value: Actions }[]>,
    },
    current: {
      type: Object as PropType<Actions>,
    }
  },
  setup(_, { emit }) {
    const onChange = (tab: Actions) => {
      emit('change', tab)
    }

    return {
      onChange
    }
  }
})
</script>


<style lang="scss">
@import '../../styles/index.scss';

.l0k-swap-pair-modal-tabs {
  display: flex;
  align-items: center;
  background: $color-bg-streak;
  border-radius: 14px;
  overflow: hidden;

  .l0k-swap-pair-modal-tab {
    padding: 4px 15px;

    &.active {
      cursor: default;
    }
  }
}
</style>