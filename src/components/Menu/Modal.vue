<template>
  <vue-final-modal
    v-model="showModal"
    classes="l0k-swap-menu-modal-container"
    overlay-class="l0k-swap-menu-overlay"
    content-class="l0k-swap-menu-modal-content"
  >
    <div class="l0k-swap-mobile-menu-content">
      <div class="close" @click="showModal = false">
        <ArrowRight class="arrow" :color="'white'" />
      </div>
      <img class="logo" width="108" height="40" src="./logo.png" />
      <div class="l0k-swap-mobile-menus">
        <div
          class="menu"
          v-for="menu in menus"
          :key="menu.path"
          :class="{ active: getMenuActive(menu.includePaths) }"
          @click="onMenuClick(menu.path)"
        >
          {{ menu.name }}
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowRight } from '../Svg/index'
import { menus } from './menus'

export default defineComponent({
  components: {
    ArrowRight,
  },
  props: {
    modelValue: {
      type: Boolean,
      require: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { modelValue } = toRefs(props)

    const route = useRoute()
    const router = useRouter()

    const showModal = computed({
      get: () => modelValue.value,
      set(newValue) {
        emit('update:modelValue', newValue)
      },
    })

    const getMenuActive = (paths: string[]) => paths.includes(route.path)

    const onMenuClick = (path: string) => {
      router.replace({ path })
      showModal.value = false
    }

    return {
      showModal,
      menus,

      getMenuActive,
      onMenuClick,
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/index.scss';
.l0k-swap-menu-modal-content {
  display: flex;
  justify-content: flex-end;
  height: 100%;
  width: 100%;
}
.l0k-swap-mobile-menu-content {
  position: relative;
  background: #00606f;
  height: 100%;
  width: 65%;
  .close {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    position: absolute;
    top: 72px;
    transform: translateX(-50%);
    height: 77px;
    width: 66px;
    border-radius: 50%;
    background: #00606f;
    .arrow {
      margin-left: 7px;
    }
  }
  .logo {
    display: block;
    margin: 59px auto 50px auto;
  }
  .l0k-swap-mobile-menus {
    .menu {
      display: flex;
      align-items: center;
      position: relative;
      height: 60px;
      padding-left: 30px;
      font-size: 20px;
      font-weight: bold;
      color: #fff;
      &.active {
        background-color: rgba($color: #000000, $alpha: 0.2);
        &::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: #3bc6a5;
        }
      }
    }
  }
}
</style>
