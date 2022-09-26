<template>
  <a class="l0kswap-jump-to-mainnet" target="_blank" href="https://10kswap.com/">
    <Text bold :size="'md'"> Jump To Mainnet </Text>
    <img src="./jump.png" width="30" height="27" />
    <img class="click" src="./click.png" width="50" height="50" />
  </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Text from '../Text/Text.vue'

export default defineComponent({
  components: { Text },
})
</script>

<style lang="scss" scoped>
.l0kswap-jump-to-mainnet {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  margin-top: 20px;
  text-decoration: none;
  .click {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-49%) translateY(18%);
  }
}
</style>
