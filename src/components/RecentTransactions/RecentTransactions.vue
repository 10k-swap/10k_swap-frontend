<template>
  <div class="l0k-swap-recent-transactions-wrap">
    <div class="l0k-swap-recent-transactions-head">
      <Text>
        {{ t('recent_transactions.title') }}
      </Text>
      <div class="clear" @click="clearTransactions">
        <ClearIcon width="15px" />
        <Text>
          {{ t('recent_transactions.clear') }}
        </Text>
      </div>
    </div>
    <div class="l0k-swap-recent-transactions">
      <div class="l0k-swap-recent-transaction" v-for="transaction in transactions" :key="transaction.transactionHash">
        <div class="svgs">
          <ScuccessIcon v-if="transaction.scuccess" :color="'primary'" width="16px" />
          <LoadingIcon v-else-if="transaction.loading" :color="'minor'" width="16px" />
          <FailIcon v-else-if="transaction.fail" color="red" width="16px" />
        </div>
        <Text class="text" :color="'secondary-text'" :size="'small'">
          {{ transaction.metadata?.message }}
        </Text>
        <a href="#">
          <ShareIcon :color="'transparent'" width="12px" />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import Text from '../Text/Text.vue'
import { ClearIcon, ScuccessIcon, LoadingIcon, FailIcon, ShareIcon } from '../Svg'
import { useStarknetTransactionManager } from '../../starknet-vue/providers/transaction'

export default defineComponent({
  components: {
    Text,
    ClearIcon,
    ScuccessIcon,
    FailIcon,
    LoadingIcon,
    ShareIcon
  },
  setup() {
    const { t } = useI18n()
    const { transactions, clearTransactions } = useStarknetTransactionManager()

    return {
      transactions,

      t,
      clearTransactions
    }
  },
})
</script>

<style lang="scss">
.l0k-swap-recent-transactions-wrap {
  margin-top: 20px;

  .l0k-swap-recent-transactions-head {
    display: flex;
    justify-content: space-between;

    .clear {
      display: flex;
      align-items: center;
      cursor: pointer;

      svg {
        margin-right: 6px;
      }
    }
  }

  .l0k-swap-recent-transactions {
    padding-top: 20px;

    .l0k-swap-recent-transaction {
      display: flex;
      align-items: center;
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }

      .svgs {
        display: flex;
        align-items: center;
        margin-right: 8px;
      }

      a {
        margin-left: 8px;
      }
    }
  }
}
</style>