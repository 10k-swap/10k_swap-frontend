<template>
  <div class="l0k-swap-app-meun" v-if="!isMobile">
    <Logo class="app-logo" />
    <div class="meuns">
      <div class="meun" v-for="meun in meuns" :key="meun.path" :class="{ active: getMeunActive(meun.includePaths) }" @click="onMeunClick(meun.path)">
        {{ meun.name }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useIsMobile from '../../hooks/useIsMobile'
import Logo from '../Logo/index.vue'

const meuns = [
  {
    name: '10K Swap',
    path: '/',
    includePaths: ['/swap', '/pool', '/faucet', '/analytics'],
  },
  {
    name: '10K Wallet',
    path: '/wallet',
    includePaths: ['/wallet'],
  },
]

export default defineComponent({
  components: {
    Logo,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const isMobile = useIsMobile()

    const getMeunActive = (paths: string[]) => paths.includes(route.path)

    const onMeunClick = (path: string) => {
      router.replace({ path })
    }

    return {
      meuns,
      isMobile,

      getMeunActive,

      onMeunClick,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';
.l0k-swap-app-meun {
  display: flex;
  align-items: center;
  height: 80px;
  padding: 0 20px;
  background-color: rgba(0, 0, 0, 0.15);
  .app-logo {
    flex: 0 0 275px;
  }
  .meuns {
    display: flex;
    flex: 1;
    font-size: 24px;
    font-weight: bold;
    color: $color-white;
    .meun {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 196px;
      height: 80px;
      cursor: pointer;
      &.active {
        background: rgba(0, 0, 0, 0.2);
        position: relative;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: $color-primary;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
