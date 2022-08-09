<template>
  <StarknetProvider :connectors="connectors">
    <AppBody>
      <router-view />
    </AppBody>
  </StarknetProvider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppBody from './pages/AppBody/index.vue'
import { getInstalledInjectedConnectors } from './starknet-vue/connectors'
import { StarknetProvider } from './starknet-vue/providers/index'

const connectors = getInstalledInjectedConnectors()

export default defineComponent({
  components: {
    AppBody,
    StarknetProvider,
  },
  setup() {
    return {
      connectors: connectors,
    }
  },
})
</script>

<style lang="scss" scoped>
.a {
  text-align: center;
}
</style>