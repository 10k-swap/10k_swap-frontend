<template>
  <Page class="l0k-swap-swap-wrapper" :title="t('pool.title')">
    <template v-slot:head-right>
      <SettingIcon class="setting" width="17px" @click="onSetting" />
    </template>
    <TokenSelect v-model="current" />
  </Page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Text from '../../components/Text/Text.vue'
import Button from '../../components/Button/Button'
import Page from '../../components/Page/Page.vue'
import TokenSelect from '../../components/TokenSelect/TokenSelect.vue'
import { SettingIcon } from '../../components/Svg'
import { ChainId, Token } from '../../sdk'
import { useModalStore, useSlippageToleranceSettingsStore } from '../../state'

export default defineComponent({
  components: {
    Text,
    Button,
    Page,
    SettingIcon,
    TokenSelect
  },
  setup() {
    const { t } = useI18n()
    const modalStore = useModalStore()
    const slippageToleranceSettingsStore = useSlippageToleranceSettingsStore()

    const current = ref(new Token(ChainId.TESTNET, '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', 18, 'testEth'))

    const onSetting = () => {
      modalStore.toggleSlippageToleranceSettingsModal(true)
      slippageToleranceSettingsStore.updateCurrentSet('swap')
    }

    return {
      current,

      t,
      onSetting,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';

.l0k-swap-swap-wrapper {
  margin-top: 28px;

  .setting {
    cursor: pointer;
  }

  @include mobile {
    margin-top: 5px;
  }
}
</style>
