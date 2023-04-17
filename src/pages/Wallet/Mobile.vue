<template>
  <div class="l0k-swap-wallet-mobile">
    <div class="title">
      <img src="./title-mobile.png" width="121" height="25" />
    </div>
    <div class="desc">
      <img src="./desc-mobile.png" width="331" height="25" />
    </div>
    <Text class="remark" :color="'white'" :size="'md'">{{ t('wallet.desc') }} </Text>
    <div class="banner">
      <img src="./banner-mobile.png" />
    </div>
    <div class="downloads">
      <a class="download" v-for="(item, i) in sources" :key="i" :href="item.url" target="_blank">
        <img :src="item.source" width="302" height="40" />
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import Text from '../../components/Text/Text.vue'
import { isIOS } from '../../utils/device'

import AppStore from './app-store.png'
import TestFlight from './test-flight.png'

import GooglePlay from './google-play.png'
import APK from './APK.png'

const ios = [
  { url: '#', source: AppStore },
  { url: '#', source: TestFlight },
]

const android = [
  { url: '#', source: GooglePlay },
  { url: '#', source: APK },
]

export default defineComponent({
  components: {
    Text,
  },
  setup() {
    const { t } = useI18n()

    return {
      t,

      sources: isIOS() ? ios : android,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';
.l0k-swap-wallet-mobile {
  padding: 40px 17px 100px 17px;

  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .title,
  .desc {
    margin-bottom: 10px;
  }

  .remark {
    margin-bottom: 50px;
  }

  .banner {
    margin: 0 18px;
    img {
      width: 100%;
    }
  }
  .downloads {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 15px;

    a {
      display: block;
      margin-bottom: 12px;
    }
  }
}
</style>
