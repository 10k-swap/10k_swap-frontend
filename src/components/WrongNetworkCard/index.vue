<template>
  <div class="l0kswap-wrong-network">
    <div class="icon">
      <WarningIcon class="svg" />
    </div>
    <div class="content">
      <Text bold :size="'small'">
        <span v-html="t('wrong_network_tips', { network: chainId === ChainId.MAINNET ? 'Testnet' : 'Mainnet' })"></span>
      </Text>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChainId } from 'l0k_swap-sdk'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { WarningIcon } from '../Svg/index'
import Text from '../Text/Text.vue'

export default defineComponent({
  components: {
    WarningIcon,
    Text,
  },
  setup() {
    const { t } = useI18n()
    const {
      state: { chainId },
    } = useStarknet()

    return {
      chainId,
      ChainId,

      t,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';
.l0kswap-wrong-network {
  display: flex;
  width: 252px;
  background: $color-white;
  border-radius: 20px;
  .icon {
    display: flex;
    justify-content: center;
    width: 40px;
    padding-top: 7px;
    .svg {
      width: 26px;
      height: 26px;
    }
  }
  .content {
    flex: 1;
    padding: 10px 0;
    padding-right: 18px;
  }
}
</style>
