<template>
  <div class="l0k-swap-haeder">
    <Logo class="app-logo" />
    <Menu />
    <Connector class="connector" :connectText="isMobile ? t('header.connect') : undefined" v-if="showConnector" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import Menu from '../Menu/Menu.vue'
import Logo from '../Logo/index.vue'
import Connector from '../Connector/Connector.vue'
import { useRoute } from 'vue-router'
import useIsMobile from '../../hooks/useIsMobile'

export default defineComponent({
  components: {
    Menu,
    Logo,
    Connector,
  },
  setup() {
    const { t } = useI18n()

    const route = useRoute()
    const isMobile = useIsMobile()

    const showConnector = computed(() => route.path !== '/wallet')

    return {
      showConnector,
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
  position: relative;
  height: 60px;
  padding: 0 20px;
  background-color: rgba(0, 0, 0, 0.15);
  .app-logo {
    flex: 0 0 275px;
  }
  .connector {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    @include mobile {
      right: 44px;
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
