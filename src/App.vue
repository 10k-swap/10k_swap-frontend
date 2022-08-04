<template>
  <StarknetProvider :connectors="connectors" autoConnect>
    <router-view />
  </StarknetProvider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getInstalledInjectedConnectors } from './starknet-vue/connectors'
import { StarknetProvider } from './starknet-vue/providers/index'

const connectors = getInstalledInjectedConnectors()

export default defineComponent({
  components: {
    StarknetProvider,
  },
  setup() {
    return {
      connectors: connectors,
    }
  },
})
</script>
