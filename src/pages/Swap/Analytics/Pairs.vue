<template>
  <div class="l0k-swap-analytics-pairs">
    <div class="header">
      <Text class="title">{{ t('analytics.pairs') }}</Text>
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
    <div class="pairs">
      <div class="head">
        <Text class="name" :size="'small'">{{ t('analytics.name') }}</Text>
        <Text class="liquidity" :size="'small'">{{ t('analytics.liquidity') }}</Text>
        <Text class="volume_24h" :size="'small'">{{ t('analytics.volume_24h') }}</Text>
        <Text class="volume_7d" :size="'small'">{{ t('analytics.volume_7d') }}</Text>
        <Text class="fees_24h" :size="'small'">{{ t('analytics.fees_24h') }}</Text>
        <Text class="total_fees" :size="'small'">{{ t('analytics.total_fees') }}</Text>
      </div>
      <div class="contents">
        <div class="content" v-for="(item, i) in pairs?.pairs" :key="item.pairAddress">
          <div class="name">
            <Text class="no" :size="'small'">{{ i + 1 }}</Text>
            <DoubleLogo :token0="getToken(item)[0]" :token1="getToken(item)[1]" coverage />
            <Text :size="'small'" class="symbol"> {{ item.token0.symbol }} - {{ item.token1.symbol }}</Text>
          </div>
          <Text class="liquidity" :size="'small'" :title="`$ ${item.liquidity}`">{{ numeralLiquidity(item.liquidity) }}</Text>
          <Text class="volume_24h" :size="'small'">{{ numeral(item.volume24h).format('$0,0.00') }}</Text>
          <Text class="volume_7d" :size="'small'">{{ numeral(item.volume7d).format('$0,0.00') }}</Text>
          <Text class="fees_24h" :size="'small'">{{ numeral(item.fees24h).format('$0,0.00') }}</Text>
          <Text class="total_fees" :size="'small'">{{ numeral(item.feesTotal).format('$0,0.00') }}</Text>
        </div>
      </div>
    </div>
    <ElPagination
      small
      :page-size="pairs?.limit"
      :total="pairs?.total ?? 0"
      :current-page="currentPage"
      layout="prev, pager, next"
      @update:current-page="onPageChange"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ElPagination, ElDatePicker } from 'element-plus'
import numeral from 'numeral'
import Text from '../../../components/Text/Text.vue'
import DoubleLogo from '../../../components/DoubleLogo/index.vue'
import { useI18n } from 'vue-i18n'
import { usePairs } from '../../../state/analytics/hooks'
import { Pair } from '../../../state/analytics/types'
import { Token } from 'l0k_swap-sdk'
import { useStarknet } from '../../../starknet-vue/providers/starknet'

export default defineComponent({
  components: {
    ElPagination,
    ElDatePicker,
    Text,
    DoubleLogo,
  },
  setup() {
    const dates = ref<[Date, Date]>([new Date(2022, 8, 18), new Date()])
    const currentPage = ref(1)

    const {
      state: { chainId },
    } = useStarknet()

    const { t } = useI18n()

    const pairs = usePairs(dates, currentPage)

    const getToken = (pair: Pair) => {
      const { token0, token1 } = pair
      return (
        (chainId.value && [
          new Token(chainId.value, token0.address, token0.decimals, token0.symbol),
          new Token(chainId.value, token1.address, token1.decimals, token1.symbol),
        ]) ??
        []
      )
    }

    const numeralLiquidity = (liquidity: number) => {
      return liquidity > 1e15 ? numeral(liquidity).format('$0.000 a').toUpperCase() : numeral(liquidity).format('$0,0.00')
    }

    const onPageChange = (page: number) => {
      currentPage.value = page
    }

    return {
      dates,
      pairs,
      currentPage,

      numeral,
      numeralLiquidity,
      getToken,
      t,
      onPageChange,
    }
  },
})
</script>

<style lang="scss">
@import '../../../styles/index.scss';

.l0k-swap-analytics-pairs {
  padding: 16px;
  margin-top: 16px;
  background: $color-white;
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
  .pairs {
    margin-top: 12px;
    overflow: auto;
    width: 100%;
    .head,
    .contents {
      display: flex;
      width: 1008px;
      .name {
        width: 170px;
        padding: 0 10px;
      }
      .liquidity,
      .volume_24h,
      .volume_7d,
      .fees_24h,
      .total_fees {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex: 1;
        padding: 0 10px;
      }
    }
    .head {
      height: 32px;
      background: $color-bg-secondary;
      border-radius: 8px 0px 0px 8px;
      .name {
        display: flex;
        align-items: center;
      }
      .name,
      .liquidity,
      .volume_24h,
      .volume_7d,
      .fees_24h,
      .total_fees {
        font-weight: 500;
      }
    }
    .contents {
      flex-direction: column;
      .content {
        display: flex;
        align-items: center;
        height: 40px;
        .name {
          display: flex;
          align-items: center;
          .no {
            margin-right: 5px;
            width: 22px;
          }
          .symbol {
            margin-left: 12px;
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
