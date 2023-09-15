<template>
  <div class="l0k-swap-wallet-card-wrapper" v-if="show">
    <div class="l0k-swap-wallet-card">
      <div class="close" @click="close = true">
        <img src="./close.png" width="14" height="14" />
      </div>
      <div class="title">{{ t('wallet.wallet_online') }}</div>
      <div class="desc">{{ t('wallet.check_layer2') }}</div>
      <div class="link">
        <div class="progress">{{ t('wallet.progress') }}</div>
        <a class="download" target="_self" :href="WALLET_HREF">
          {{ t('wallet.download_it') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { WALLET_HREF } from '../../constants'
import useIsMobile from '../../hooks/useIsMobile'

export default defineComponent({
  setup() {
    const { t } = useI18n()

    const close = ref(false)
    const route = useRoute()
    const isMobile = useIsMobile()

    const show = computed(() => !close.value && !isMobile.value && route.path !== '/wallet')

    return {
      t,

      close,
      show,
      WALLET_HREF
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';

.l0k-swap-wallet-card-wrapper {
  position: fixed;
  right: 80px;
  bottom: 150px;
  background: #ffffff;
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.43);
  border-radius: 10px 10px 10px 10px;
  overflow: hidden;
  .l0k-swap-wallet-card {
    position: relative;
    padding: 17px 7px;
    .close {
      position: absolute;
      right: 3px;
      top: 3px;
      cursor: pointer;
    }
    .title {
      font-size: 14px;
      font-weight: bold;
      color: #070707;
    }
    .desc {
      font-size: 12px;
      color: #272727;
      margin-top: 10px;
    }

    .link {
      color: #272727;
      font-size: 14px;
      margin-top: 10px;
      .progress {
        display: inline-block;
      }
      .download {
        font-weight: bold;
        color: #00c9a3;
      }
    }
  }
}
</style>
