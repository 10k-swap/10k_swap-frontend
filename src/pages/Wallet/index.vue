<template>
  <PC v-if="!isMobile" />
  <Mobile v-else />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useIsMobile from '../../hooks/useIsMobile'
import PC from './PC.vue'
import Mobile from './Mobile.vue'

export default defineComponent({
  components: {
    PC,
    Mobile,
  },
  setup() {
    const isMobile = useIsMobile()

    return {
      isMobile,
    }
  },
})
</script>
