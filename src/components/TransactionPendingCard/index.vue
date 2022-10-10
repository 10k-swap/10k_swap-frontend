<template>
  <div class="l0k-swap-pending-transaction" @click="onCardClick" v-show="pendingTransactionNumber > 0">
    <div class="icon">
      <PendingIcon class="svg" />
    </div>
    <div class="content">
      <Text :size="'small'" :color="'orange'">
        {{ t('pending', { n: pendingTransactionNumber }) }}
      </Text>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStarknetTransactionManager } from '../../starknet-vue/providers/transaction'
import { useModalStore } from '../../state'
import { PendingIcon } from '../Svg/index'
import Text from '../Text/Text.vue'

export default defineComponent({
  components: {
    PendingIcon,
    Text,
  },
  setup() {
    const { t } = useI18n()
    const modalStore = useModalStore()
    const { state } = useStarknetTransactionManager()

    const pendingTransactionNumber = computed(() => state.transactions.value.filter((item) => item.loading).length)

    const onCardClick = () => {
      modalStore.toggleAccountModal(true)
    }

    return {
      t,

      pendingTransactionNumber,

      onCardClick,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';
.l0k-swap-pending-transaction {
  display: flex;
  position: absolute;
  background: $color-white;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  cursor: pointer;
  .icon {
    display: flex;
    justify-content: center;
    width: 32px;
    padding-top: 7px;
    .svg {
      width: 20px;
      height: 20px;
    }
  }
  .content {
    flex: 1;
    padding: 8px 0;
    padding-right: 8px;
  }
}
</style>
