<template>
  <div class="l0k-swap-wallet">
    <div class="desc-wrapper">
      <div class="title">
        <svg xmlns="http://www.w3.org/2000/svg" width="206" height="44" viewBox="0 0 206 44">
          <g id="44" data-name="44" transform="translate(-119 -251)">
            <text
              id="_10K_Wallet"
              data-name="10K Wallet"
              transform="translate(222 284)"
              fill="none"
              stroke="#084043"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              font-size="40"
              font-family="Helvetica-Bold, Helvetica"
              font-weight="700"
              style="mix-blend-mode: soft-light; isolation: isolate"
            >
              <tspan x="-100.41" y="0">10K Wallet</tspan>
            </text>
            <text
              id="_10K_Wallet-2"
              data-name="10K Wallet"
              transform="translate(220 282)"
              fill="#fff"
              font-size="40"
              font-family="Helvetica-Bold, Helvetica"
              font-weight="700"
            >
              <tspan x="-100.41" y="0">10K Wallet</tspan>
            </text>
          </g>
        </svg>
      </div>
      <div class="desc">
        <svg xmlns="http://www.w3.org/2000/svg" width="556" height="44" viewBox="0 0 556 44">
          <g id="45" data-name="45" transform="translate(-120 -311)">
            <text
              id="ZK_enhanced_EIP-4337_wallet"
              data-name="ZK enhanced EIP-4337 wallet"
              transform="translate(398 344)"
              fill="none"
              stroke="#084043"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              font-size="40"
              font-family="Helvetica-Bold, Helvetica"
              font-weight="700"
              style="mix-blend-mode: soft-light; isolation: isolate"
            >
              <tspan x="-275.654" y="0">ZK enhanced EIP-4337 wallet</tspan>
            </text>
            <text
              id="ZK_enhanced_EIP-4337_wallet-2"
              data-name="ZK enhanced EIP-4337 wallet"
              transform="translate(396 342)"
              fill="#fff"
              font-size="40"
              font-family="Helvetica-Bold, Helvetica"
              font-weight="700"
            >
              <tspan x="-275.654" y="0">ZK enhanced EIP-4337 wallet</tspan>
            </text>
          </g>
        </svg>
      </div>
      <Text :color="'white'" :size="'md'">{{ t('wallet.desc') }} </Text>
      <div class="links-wapper">
        <div class="links">
          <a href="#" class="ios"> <img src="./ios.png" width="162" height="53" /></a>
          <div class="coming">coming soon</div>
          <a :href="APKDownloadUrl"> <img src="./android.png" width="162" height="53" /></a>
        </div>
        <div class="qrcode">
          <img src="./qrcode.png" width="148" height="148" />
        </div>
      </div>
    </div>
    <div class="banner">
      <img src="./banner.png" width="594" height="527" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import Text from '../../components/Text/Text.vue'
import { useAndroidAPKDownloadUrl } from '../../state/wallet/hooks'

export default defineComponent({
  components: {
    Text,
  },
  setup() {
    const { t } = useI18n()
    const APKDownloadUrl = useAndroidAPKDownloadUrl()

    return {
      t,

      APKDownloadUrl,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';
.l0k-swap-wallet {
  display: flex;
  padding: 78px 0;
  margin: 0 135px;
  .desc-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .title {
      margin-bottom: 20px;
    }
    .desc {
      margin-bottom: 25px;
    }

    .links-wapper {
      display: flex;
      margin-top: 50px;
      .links {
        display: flex;
        justify-content: center;
        flex-direction: column;
        .ios {
          cursor: not-allowed;
        }
        .coming {
          margin: 7px 0 9px 0;
          font-size: 12px;
          color: #ffcc00;
        }
      }
      .qrcode {
        margin-left: 75px;
      }
    }
  }
}
</style>
