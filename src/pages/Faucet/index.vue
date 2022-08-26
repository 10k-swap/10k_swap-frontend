<template>
  <Page class="l0k-swap-faucet" :title="t('faucet.title')">
    <div class="tips">
      <template v-if="!account">
        <Text :size="'small'"> {{ t('faucet.connectTips1') }} </Text>
        <Text :size="'small'"> {{ t('faucet.connectTips2') }} </Text>
      </template>
      <Text :size="'small'" v-else> {{ t('faucet.tips') }} </Text>
    </div>
    <div class="buttons">
      <Button v-if="!account" :type="'primary'" :size="'large'" @click="onConnect" bold>{{ t('connect') }}</Button>
      <Button v-else :type="'primary'" :size="'large'">{{ t('faucet.retweet') }}</Button>
    </div>
  </Page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import Text from '../../components/Text/Text.vue'
import Page from '../../components/Page/Page.vue'
import Button from '../../components/Button/Button'
import useConnector from '../../hooks/useConnector'

export default defineComponent({
  components: {
    Page,
    Text,
    Button,
  },
  setup() {
    const { t } = useI18n()
    const {
      state: { account },
    } = useStarknet()
    const { onConnect } = useConnector()

    return {
      account,

      t,
      onConnect,
    }
  },
})
</script>

<style lang="scss" scoped>
.l0k-swap-faucet {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 28px;
  .tips {
    padding: 80px 46px;
    text-align: center;
  }
  .buttons {
    display: flex;
    justify-content: center;
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px 30px;
  }
}
</style>
