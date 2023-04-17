<template>
  <div class="l0k-swap-wallet">
    <div class="desc-wrapper">
      <div class="title">
        <img src="./title.png" />
      </div>
      <div class="desc">
        <img src="./desc.png" />
      </div>
      <Text :color="'white'" :size="'md'">{{ t('wallet.desc') }} </Text>
      <div class="links-wapper">
        <div class="links">
          <a href="#"> <img class="ios" src="./ios.png" width="162" height="53" /></a>
          <a href="#"> <img src="./android.png" width="162" height="53" /></a>
        </div>
        <div class="qrcode">
          <img src="./qrcode.png" />
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

export default defineComponent({
  components: {
    Text,
  },
  setup() {
    const { t } = useI18n()

    return {
      t,
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
          margin-bottom: 24px;
        }
      }
      .qrcode {
        margin-left: 75px;
      }
    }
  }
}
</style>
