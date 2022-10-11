<template>
  <div class="l0k-swap-popup-item" @click="onPopupClick">
    <div class="icon">
      <ScuccessIcon v-if="txn?.scuccess" :color="'primary'" width="16px" />
      <FailIcon v-else-if="txn?.fail" color="red" width="16px" />
    </div>
    <div class="content">
      <Text :size="'small'" :color="'secondary-text'"> {{ txn?.metadata?.message }}</Text>
      <a class="view-on-scan" target="_blank" :href="txn && chainId && getScanLink(chainId, txn.transactionHash, 'transaction')">
        {{ t('view_on_scan') }}
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { useTimeoutFn } from '@vueuse/shared'
import { defineComponent, PropType, toRefs } from 'vue'
import { DEFAULT_TXN_DISMISS_MS } from '../../constants'
import { Transaction } from '../../starknet-vue/providers/transaction'
import Text from '../Text/Text.vue'
import { ScuccessIcon, FailIcon } from '../Svg'
import { useRemovePopup } from '../../state/application/hooks'
import { useI18n } from 'vue-i18n'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { getScanLink } from '../../utils/getScanLink'
import { useModalStore } from '../../state'

export default defineComponent({
  props: {
    txn: {
      type: Object as PropType<Transaction>,
    },
    id: {
      type: String,
      required: true,
    },
    removeAfterMs: {
      type: Number,
    },
  },
  components: {
    Text,
    ScuccessIcon,
    FailIcon,
  },
  setup(props) {
    const { removeAfterMs, txn, id } = toRefs(props)

    const {
      state: { chainId },
    } = useStarknet()
    const { t } = useI18n()
    const store = useModalStore()

    const removePopup = useRemovePopup()

    useTimeoutFn(() => {
      removePopup({ key: id.value })
    }, removeAfterMs.value ?? DEFAULT_TXN_DISMISS_MS)

    const onPopupClick = () => {
      store.toggleAccountModal(true)
    }

    return {
      txn,
      chainId,

      t,
      getScanLink,
      onPopupClick,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index';
.l0k-swap-popup-item {
  display: flex;
  padding: 12px;
  width: 216px;
  background: $color-white;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  margin-bottom: 12px;
  margin-right: 0;
  @include mobile {
    width: calc(100% - 24px);
    background: rgba($color: $color-white, $alpha: 0.8);
  }
  .icon {
    margin-right: 8px;
    margin-top: 3px;
  }

  .content {
    .view-on-scan {
      display: block;
      margin-top: 8px;
      cursor: pointer;
      color: $color-blue;
      font-size: $font-size-sm;
      text-decoration: none;
    }
  }
}
</style>
