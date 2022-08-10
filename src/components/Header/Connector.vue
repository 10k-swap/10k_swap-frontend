<template>
  <div class="l0k-swap-connector">
    <div class="connected" v-if="account">
      <template v-if="chainId">
        <Button plain v-if="!isMobile" class="network">
          <template v-slot:icon>
            <StarknetIcon class="icon" />
          </template>
          {{ CHAIN_LABELS[chainId] }}
        </Button>
        <Button plain v-else class="network">
          <template v-slot:icon>
            <StarknetIcon class="icon" />
          </template>
        </Button>
      </template>
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
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { CHAIN_LABELS } from '../../constants'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { shortenAddress } from '../../utils'
import { StarknetIcon } from '../Svg/index'
import Button from '../Button/Button'
import { useModalStore } from '../../state'
import useConnector from '../../hooks/useConnector'
import useIsMobile from '../../hooks/useIsMobile'

export default defineComponent({
  components: {
    Button,
    StarknetIcon
  },
  setup() {
    const store = useModalStore()
    const isMobile = useIsMobile()

    const { state: { account, library } } = useStarknet()
    const { t } = useI18n()
    const { onConnect } = useConnector()

    const chainId = computed(() => library.value.chainId ?? undefined)

    return {
      account,
      chainId,
      CHAIN_LABELS,
      store,
      isMobile,

      t,
      onConnect,
      shortenAddress
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';

.l0k-swap-connector {
  .connected {
    .network {
      cursor: default;

      @include mobile {
        margin-right: 0;
        width: 40px;
        height: 40px;
        padding: 8px;
      }
    }

    button {
      &:first-child {
        margin-right: 8px;
      }
    }
  }
}
</style>
