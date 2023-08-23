<template>
  <div class="l0k-swap-app-menu-wrapper">
    <div class="l0k-swap-app-menu" v-if="!isMobile">
      <div class="menu" v-for="menu in menus" :key="menu.path" :class="{ active: getMenuActive(menu.includePaths) }" @click="onMenuClick(menu.path)">
        {{ menu.name }}
      </div>
    </div>
    <div class="l0k-swap-app-menu-mobile" v-else @click="showModal = !showModal">
      <MenuIcon />
    </div>
  </div>
  <Modal v-model="showModal" />
</template>

<script lang="ts">
/* todo: this file deprecate */
import { defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useIsMobile from '../../hooks/useIsMobile'
import Modal from './Modal.vue'
import { menus } from './menus'
import { MenuIcon } from '../Svg'

export default defineComponent({
  components: {
    Modal,
    MenuIcon,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const isMobile = useIsMobile()

    const showModal = ref(false)

    const getMenuActive = (paths: string[]) => paths.includes(route.path)

    const onMenuClick = (path: string) => {
      router.replace({ path })
    }

    return {
      menus,
      isMobile,
      showModal,

      getMenuActive,

      onMenuClick,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';
.l0k-swap-app-menu-wrapper {
  .l0k-swap-app-menu {
    display: flex;
    flex: 1;
    font-size: 24px;
    font-weight: bold;
    color: $color-white;
    .menu {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 196px;
      height: 60px;
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
  .l0k-swap-app-menu-mobile {
    cursor: pointer;
    img {
      width: 24px;
      height: 24px;
    }
  }
}
</style>
