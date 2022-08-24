<template>
  <div class="l0k-swap-recent-transactions-wrap">
    <template v-if="sortdTransactions.length">
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
        <div class="l0k-swap-recent-transaction" v-for="transaction in sortdTransactions" :key="transaction.transactionHash">
          <div class="svgs">
            <ScuccessIcon v-if="transaction.scuccess" :color="'primary'" width="16px" />
            <LoadingIcon v-else-if="transaction.loading" :color="'minor'" width="16px" />
            <FailIcon v-else-if="transaction.fail" color="red" width="16px" />
          </div>
          <Text class="text" :color="'secondary-text'" :size="isMobile ? 'mini' : 'small'">
            {{ transaction.metadata?.message }}
          </Text>
          <a target="_blank" :href="chainId && getScanLink(chainId, transaction.transactionHash, 'transaction')">
            <ShareIcon :color="'transparent'" width="12px" />
          </a>
        </div>
      </div>
    </template>
    <template v-else>
      <Text :color="'secondary-text'" :size="'small'">
        {{ t('recent_transactions.tips') }}
      </Text>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import Text from '../Text/Text.vue'
import { ClearIcon, ScuccessIcon, LoadingIcon, FailIcon, ShareIcon } from '../Svg'
import { useStarknetTransactionManager } from '../../starknet-vue/providers/transaction'
import { getScanLink } from '../../utils/getScanLink'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import useIsMobile from '../../hooks/useIsMobile'

export default defineComponent({
  components: {
    Text,
    ClearIcon,
    ScuccessIcon,
    FailIcon,
    LoadingIcon,
    ShareIcon,
  },
  setup() {
    const {
      state: { chainId },
    } = useStarknet()
    const { t } = useI18n()
    const { transactions, clearTransactions } = useStarknetTransactionManager()
    const isMobile = useIsMobile()
    const sortdTransactions = computed(() => toRaw(transactions.value).sort((a, b) => b.createAt - a.createAt))

    return {
      chainId,
      isMobile,
      sortdTransactions,

      t,
      getScanLink,
      clearTransactions,
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
