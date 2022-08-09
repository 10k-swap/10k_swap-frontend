<template>
  <div class="l0k-swap-connector">
    <div class="connected" v-if="account">
      <Button plain v-if="chainId">
        <template v-slot:icon>
          <StarknetIcon />
        </template>
        {{ CHAIN_LABELS[chainId] }}
      </Button>
      <Button plain @click="store.toggleAccountModal(true)">
        {{ shortenAddress(account) }}
      </Button>
    </div>
    <Button type="primary" bold v-else @click="onConnect">
      {{ t('header.connector.connect') }}
    </Button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { CHAIN_LABELS } from '../../constants'
import { ConnectorNotFoundError } from '../../starknet-vue/errors'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { shortenAddress } from '../../utils'
import { StarknetIcon } from '../Svg/index'
import Button from '../Button/Button'
import { useModalStore } from '../../state'

export default defineComponent({
  components: {
    Button,
    StarknetIcon
  },
  setup() {
    const err = ref<Error>()
    const store = useModalStore()

    const { state: { account, connectors, library }, connect } = useStarknet()
    const { t } = useI18n()

    const chainId = computed(() => library.value.chainId ?? undefined)

    const onConnect = async () => {
      if (!connectors.value) {
        err.value = new ConnectorNotFoundError()
        return
      }

      try {
        const connector = toRaw(connectors.value[0])
        const ready = await connector.ready()

        if (!ready) {
          store.toggleConnectingModal(true)
        }

        await connect(connector)

        nextTick(() => {
          if (account.value) {
            store.toggleConnectingModal(false)
            store.toggleAccountModal(true)
          }
        })
      } catch (error) {
        console.log('connect error', error)
        err.value = error as Error
      }
    }

    return {
      account,
      chainId,
      CHAIN_LABELS,
      store,

      t,
      onConnect,
      shortenAddress
    }
  },
})
</script>

<style lang="scss" scoped>
.l0k-swap-connector {
  .connected {
    button {
      &:first-child {
        margin-right: 8px;
      }
    }
  }
}
</style>
