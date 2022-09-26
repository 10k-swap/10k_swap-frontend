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
      <a v-else class="retweet" :href="href" target="_blank" rel="noopener noreferrer">
        <Button :type="'primary'" :size="'large'">{{ t('faucet.retweet') }}</Button></a
      >
    </div>
  </Page>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
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

    const href = computed(() => {
      const text = `I'm+claiming+testnet+tokens+for+%4010KSwap%2C+an+open+sourced+AMM+protocol+built+on+StarkNet+in+Cairo.+%0A10KSwap+mainnet+has+been+launched:+https://10kswap.com+%0A%0AMy+Address:+${account.value}%0A%0ATestnet:+https://goerli.10kswap.com`

      return `https://twitter.com/intent/tweet?text=${text}`
    })

    return {
      account,
      href,

      t,
      onConnect,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';
.l0k-swap-faucet {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 28px;
  @include mobile {
    margin-top: 5px;
  }

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
    .retweet {
      display: block;
      width: 100%;
      height: fit-content;
    }
  }
}
</style>
