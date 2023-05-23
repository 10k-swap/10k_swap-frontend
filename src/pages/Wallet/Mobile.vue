<template>
  <div class="l0k-swap-wallet-mobile">
    <div class="title">
      <svg xmlns="http://www.w3.org/2000/svg" width="124" height="26" viewBox="0 0 124 26">
        <g id="48" data-name="48" transform="translate(16.378 3.503)">
          <text
            id="_10K_Wallet"
            data-name="10K Wallet"
            transform="translate(45.622 15.497)"
            fill="none"
            stroke="#084043"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            font-size="24"
            font-family="Helvetica-Bold, Helvetica"
            font-weight="700"
            style="mix-blend-mode: soft-light; isolation: isolate"
          >
            <tspan x="-60.246" y="0">10K Wallet</tspan>
          </text>
          <text
            id="_10K_Wallet-2"
            data-name="10K Wallet"
            transform="translate(44.622 14.497)"
            fill="#fff"
            font-size="24"
            font-family="Helvetica-Bold, Helvetica"
            font-weight="700"
          >
            <tspan x="-60.246" y="0">10K Wallet</tspan>
          </text>
        </g>
      </svg>
    </div>
    <div class="desc">
      <svg xmlns="http://www.w3.org/2000/svg" width="334" height="26" viewBox="0 0 334 26">
        <g id="49" data-name="49" transform="translate(42.378 4.146)">
          <text
            id="ZK_enhanced_EIP-4337_wallet"
            data-name="ZK enhanced EIP-4337 wallet"
            transform="translate(124.622 14.854)"
            fill="none"
            stroke="#084043"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            font-size="24"
            font-family="Helvetica-Bold, Helvetica"
            font-weight="700"
            style="mix-blend-mode: soft-light; isolation: isolate"
          >
            <tspan x="-165.393" y="0">ZK enhanced EIP-4337 wallet</tspan>
          </text>
          <text
            id="ZK_enhanced_EIP-4337_wallet-2"
            data-name="ZK enhanced EIP-4337 wallet"
            transform="translate(123.622 13.854)"
            fill="#fff"
            font-size="24"
            font-family="Helvetica-Bold, Helvetica"
            font-weight="700"
          >
            <tspan x="-165.393" y="0">ZK enhanced EIP-4337 wallet</tspan>
          </text>
        </g>
      </svg>
    </div>
    <Text class="remark" :color="'white'" :size="'md'">{{ t('wallet.desc') }} </Text>
    <div class="banner">
      <img src="./banner.png" />
    </div>
    <div class="downloads ios" v-if="isIOS()">
      <div class="download">
        <a @click="active = true" :href="'itms-services://?action=download-manifest&url=https://ipa.10kx.com/1.0.0/10kWallet.plist'">
          <img :src="IOSDownload" />
        </a>
        <a class="active" v-if="active" target="_blank" :href="'./assets/iPhone-trust-description-file.pdf'"
          >Installing, you still need to trust this enterprise-level developer.</a
        >
      </div>
    </div>
    <div class="downloads" v-else>
      <div class="download" v-for="(item, i) in android" :key="i">
        <a :href="item.url">
          <img :src="item.source" />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Text from '../../components/Text/Text.vue'
import { isIOS } from '../../utils/device'
import { useAndroidAPKDownloadUrl } from '../../state/wallet/hooks'

// import AppStore from './app-store.png'
// import TestFlight from './test-flight.png'
import IOSDownload from './IOS-download.png'

// import GooglePlay from './google-play.png'
import APK from './APK.png'

export default defineComponent({
  components: {
    Text,
  },
  setup() {
    const { t } = useI18n()
    const active = ref(false)

    const APKDownloadUrl = useAndroidAPKDownloadUrl()

    const android = computed(() => [{ url: APKDownloadUrl.value, source: APK, online: true }])

    return {
      t,
      isIOS,

      active,

      android,

      IOSDownload,
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
    margin: 0 15px;
    img {
      width: 100%;
    }
  }
  .downloads {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 15px;
    .download {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 18px;
      a {
        display: block;
        img {
          display: block;
          width: 100%;
        }
      }
      .coming {
        margin: 3px 0 6px 0;
        font-size: 12px;
        color: #ffcc00;
      }
    }
  }
  .ios {
    .download {
      .active {
        margin: 3px 0 6px 0;
        font-size: 12px;
        color: #ffcc00;
        text-decoration: none;
      }
    }
  }
}
</style>
