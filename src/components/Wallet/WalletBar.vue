<template>
  <div class="l0k-swap-wallet-bar-wrapper" v-if="show">
    <div class="logo-desc">
      <img class="logo" src="./logo.png" />
      <div class="desc">
        <div class="title">{{ t('wallet.wallet') }}</div>
        <div class="remark">{{ t('wallet.check_l2_progress') }}</div>
      </div>
    </div>
    <div class="buttons" @click="onDownload">
      <button class="download">
        {{ t('wallet.download') }}
      </button>
      <div class="close" @click="close = true">
        <img src="./close2.png" width="24" height="24" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import useIsMobile from '../../hooks/useIsMobile'

export default defineComponent({
  setup() {
    const { t } = useI18n()

    const close = ref(false)

    const router = useRouter()
    const route = useRoute()

    const isMobile = useIsMobile()

    const show = computed(() => !close.value && isMobile.value && route.path !== '/wallet')

    const onDownload = () => {
      router.push({ path: '/wallet' })
    }

    return {
      t,

      close,
      show,
      onDownload,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';

.l0k-swap-wallet-bar-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #020202;
  overflow: hidden;
  padding: 16px 12px;

  .logo-desc {
    display: flex;
    align-items: center;
    .logo {
      width: 40px;
      height: 40px;
      border-radius: 5px;
    }
    .desc {
      margin-left: 5px;
      .title,
      .remark {
        font-size: 12px;
        color: #fff;
      }
      .remark {
        margin-top: 5px;
      }
    }
  }
  .buttons {
    display: flex;
    align-items: center;
    .download {
      width: 106px;
      height: 30px;
      background: #005c6d;
      border-radius: 20px 20px 20px 20px;
      outline: none;
      border: 0;
      padding: 0;
      margin: 0;
      font-weight: bold;
      color: #fff;
    }
    .close {
      margin-left: 8px;
      cursor: pointer;
    }
  }
}
</style>
