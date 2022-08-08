<template>
  <div class="l0k-swap-connector">
    <div class="connected" v-if="account">
      <Button plain>

      </Button>
      <Button plain>
        {{ shortenAddress(account) }}
      </Button>
    </div>
    <Button type="primary" bold v-else @click="onConnect">
      {{ t('header.connector.connect') }}
    </Button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ConnectorNotFoundError } from '../../starknet-vue/errors'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { shortenAddress } from '../../utils'
import Button from '../Button/Button'

export default defineComponent({
  components: {
    Button
  },
  setup() {
    const err = ref<Error>()

    const { state: { account, connectors, library }, connect } = useStarknet()
    const { t } = useI18n()
    console.log(parseInt(library.value.chainId))
    watch(library, () => console.log(library))

    const onConnect = async () => {
      if (!connectors.value) {
        err.value = new ConnectorNotFoundError()
        return
      }

      try {
        await connect(connectors.value[0])
      } catch (error) {
        console.log('connect error', error)
        err.value = error as Error
      }
    }

    return {
      account,

      t,
      onConnect,
      shortenAddress
    }
  },
})
</script>

<style lang="scss" scoped>
</style>
