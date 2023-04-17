<template>
  <div class="l0k-swap-haeder">
    <Logo class="app-logo" />
    <div class="connector-menu">
      <Connector class="connector" :connectText="t('header.connect')" v-if="isMobile" />
      <Menu />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import Menu from '../Menu/Menu.vue'
import Logo from '../Logo/index.vue'
import Connector from '../Connector/Connector.vue'
import useIsMobile from '../../hooks/useIsMobile'

export default defineComponent({
  components: {
    Menu,
    Logo,
    Connector,
  },
  setup() {
    const { t } = useI18n()

    const isMobile = useIsMobile()

    return {
      isMobile,
      t,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';
.l0k-swap-haeder {
  display: flex;
  align-items: center;
  height: 80px;
  padding: 0 20px;
  background-color: rgba(0, 0, 0, 0.15);
  .app-logo {
    flex: 0 0 275px;
  }
  .connector-menu {
    display: flex;
    align-items: center;
    .connector {
      margin-right: 8px;
    }
  }
  @include mobile {
    padding: 0 12px;
    justify-content: space-between;
    background-color: transparent;
    .app-logo {
      flex: 0 0 165px;
    }
  }
}
</style>
