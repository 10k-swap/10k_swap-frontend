<template>
  <div class="l0k-swap-analytics-transactions">
    <div class="header">
      <Text class="title">{{ t('analytics.transactions') }}</Text>
      <div class="date-picker">
        <el-date-picker
          v-model="dates"
          type="datetimerange"
          range-separator="~"
          start-placeholder="Start date"
          end-placeholder="End date"
          :clearable="false"
        />
      </div>
    </div>
    <div class="wrapper">
      <div class="summary">
        <div class="total">
          <Text class="head" :size="'small'" :color="'description-text'">{{ t('analytics.total_transactions') }}</Text>
          <Text class="value" :size="'small'">{{ transactions?.summary.total }}</Text>
        </div>
        <div class="profit">
          <Text class="head" :size="'small'" :color="'description-text'">{{ t('analytics.profit') }}</Text>
          <div class="value">
            <div class="item" v-for="item in transactions?.summary.profits" :key="item.address">
              <Text class="name" :size="'small'">{{ item.symbol }}</Text>
              <Text class="amount" :size="'small'">{{ numeral(item.amountHuman) }}</Text>
            </div>
          </div>
        </div>
      </div>
      <div class="transactions">
        <div class="head">
          <div class="label">
            <template v-for="item in TransactionTypes" :key="item.type">
              <Text
                class="type"
                :size="'small'"
                :color="item.type === currentType ? 'normal' : 'description-text'"
                :class="{ active: item.type === currentType }"
                @click="currentType = item.type"
              >
                {{ item.label }}
              </Text>
            </template>
          </div>
          <Text class="token0" :size="'small'">{{ t('analytics.token0') }}</Text>
          <Text class="token1" :size="'small'">{{ t('analytics.token1') }}</Text>
          <Text class="account" :size="'small'">{{ t('analytics.account') }}</Text>
          <Text class="fees" :size="'small'">{{ t('analytics.fees') }}</Text>
          <Text class="time" :size="'small'">{{ t('analytics.time') }}</Text>
        </div>
        <div class="contents">
          <div class="content" v-for="item in transactions?.transactions.transactions" :key="item.id">
            <Text class="label" :size="'small'" :title="getTransactionSummary(item)">{{ getTransactionSummary(item) }}</Text>
            <Text class="token0" :size="'small'">{{ numeral(item.amount0_human) }} {{ item.token0.symbol }}</Text>
            <Text class="token1" :size="'small'">{{ numeral(item.amount1_human) }} {{ item.token1.symbol }}</Text>
            <Text class="account" :size="'small'" :title="item.account_address">{{ shortenAddress(item.account_address) }}</Text>
            <Text class="fees" :size="'small'">{{ item.fee_usd !== '' ? `$ ${numeral(item.fee_usd)}` : '-' }}</Text>
            <Text class="time" :size="'small'" :title="new Date(item.event_time).toLocaleString()">
              {{ dayjs().to(new Date(item.event_time)) }}
            </Text>
          </div>
        </div>
      </div>
    </div>
    <ElPagination
      small
      :page-size="transactions?.transactions.limit"
      :total="transactions?.transactions.total ?? 0"
      :current-page="currentPage"
      layout="prev, pager, next"
      @update:current-page="onPageChange"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ElPagination, ElDatePicker } from 'element-plus'
import Text from '../../components/Text/Text.vue'
import { useI18n } from 'vue-i18n'
import { useTransactions } from '../../state/analytics/hooks'
import i18n from '../../i18n'
import { TransactionType, Transaction, SwapReverses } from '../../state/analytics/types'
import { shortenAddress } from '../../utils'

dayjs.extend(relativeTime)

const TransactionTypes = [
  { label: i18n.global.t('analytics.all'), type: undefined },
  { label: i18n.global.t('analytics.swaps'), type: TransactionType.Swap },
  { label: i18n.global.t('analytics.adds'), type: TransactionType.Mint },
  { label: i18n.global.t('analytics.removes'), type: TransactionType.Burn },
]

export default defineComponent({
  components: {
    ElPagination,
    ElDatePicker,
    Text,
  },
  setup() {
    const dates = ref<[Date, Date]>([new Date(2022, 8, 18), new Date()])
    const currentPage = ref(1)
    const currentType = ref<TransactionType>()

    const { t } = useI18n()

    const transactions = useTransactions(dates, currentPage, currentType)

    const onPageChange = (page: number) => {
      currentPage.value = page
    }

    const getTransactionSummary = (transaction: Transaction) => {
      const amount0 = `${numeral(transaction.amount0_human)}${transaction.token0.symbol}`
      const amount1 = `${numeral(transaction.amount1_human)}${transaction.token1.symbol}`
      const isReverse = transaction.swap_reverse === SwapReverses.Reversed

      switch (transaction.key_name) {
        case TransactionType.Burn:
          return `Remove ${amount0} and ${amount1}`
        case TransactionType.Mint:
          return `Add ${amount0} and ${amount1}`
        case TransactionType.Swap:
          return `Swap ${isReverse ? amount0 : amount1} for ${isReverse ? amount1 : amount0}`
        default:
          return ''
      }
    }
    const numeral = (n: string | number) => {
      const parsed = Number(n)
      return parsed < 1e-6 ? parsed.toExponential(5) : parsed.toFixed(5)
    }

    return {
      dates,
      currentPage,
      transactions,
      TransactionTypes,
      currentType,

      t,
      dayjs,
      numeral,
      onPageChange,
      getTransactionSummary,
      shortenAddress,
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/index.scss';

.l0k-swap-analytics-transactions {
  padding: 16px;
  margin-top: 16px;
  .header {
    display: flex;
    align-items: center;
    .title {
      width: 100px;
    }
    .date-picker {
      width: 368px;
    }
  }
  .wrapper {
    overflow: auto;
    width: 100%;
    .summary {
      display: flex;
      background: $color-white;
      margin-top: 12px;
      width: 1008px;
      .head {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 32px;
        border: 1px solid #ccc;
        box-sizing: border-box;
      }
      .value {
        display: flex;
        height: 64px;
        border: 1px solid #ccc;
        border-top: 0;
        box-sizing: border-box;
      }
      .total {
        flex: 0 0 170px;
        .head {
          width: 100%;
        }
        .value {
          justify-content: center;
          align-items: center;
          width: 100%;
        }
      }
      .profit {
        flex: auto;
        .head {
          border-left: 0;
        }
        .value {
          border-left: 0;
          .item {
            display: flex;
            flex-direction: column;
            flex: 1;
            .name,
            .amount {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 50%;
            }
            .name {
              border-right: 1px solid #ccc;
              border-bottom: 1px solid #ccc;
            }
            .amount {
              border-right: 1px solid #ccc;
            }
            &:last-child {
              .name {
                border-right: none;
              }
              .amount {
                border-right: none;
              }
            }
          }
        }
      }
    }
    .transactions {
      margin-top: 12px;
      background: $color-white;
      width: 1008px;
      .head,
      .contents {
        display: flex;
        .label {
          width: 240px;
          padding: 0 10px;
        }
        .token0,
        .token1,
        .account,
        .fees,
        .time {
          display: flex;
          align-items: center;
          flex: 1;
          padding: 0 10px;
        }
      }
      .head {
        height: 32px;
        background: $color-bg-secondary;
        .label {
          display: flex;
          align-items: center;
          .type {
            margin-right: 12px;
            cursor: pointer;
            &.active {
              font-weight: 500;
            }
          }
        }
        .label,
        .token0,
        .token1,
        .account,
        .fees,
        .time {
          font-weight: 500;
        }
      }
      .contents {
        flex-direction: column;
        .content {
          display: flex;
          align-items: center;
          height: 40px;
          .label {
            text-align: left;
            word-break: break-all;
            @include no-wrap;
          }
        }
      }
    }
  }
  @include mobile {
    padding: 0;
    .header {
      align-items: flex-start;
      flex-direction: column;
      .date-picker {
        width: 100%;
        box-sizing: border-box;
        margin-top: 8px;
      }
    }
  }
}
</style>
