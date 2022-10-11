<template>
  <div class="l0k-swap-popups">
    <template v-for="item in activePopups" :key="item.key">
      <PopupItem class="l0k-swap-popup" :txn="item.content.txn" :removeAfterMs="item.removeAfterMs ?? undefined" :id="item.key" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useActivePopup } from '../../state/application/hooks'
import PopupItem from './PopupItem.vue'

export default defineComponent({
  components: {
    PopupItem,
  },
  setup() {
    const activePopups = useActivePopup()

    return {
      activePopups,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';
.l0k-swap-popups {
  position: absolute;
  top: 72px;
  right: 20px;
  z-index: 1;
  @include mobile {
    top: 16px;
    left: 12px;
    right: 12px;
  }
}
</style>
