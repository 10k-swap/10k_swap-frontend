<template>
  <div class="l0k-swap-analytics">
    <div class="charts">
      <div class="chart-wrapper">
        <Text>
          {{ t('analytics.liquidity') }}
        </Text>
        <div class="total">
          <Text bold :size="'large'">$ 1.002B </Text>
          <Text class="change" :color="'primary'" :size="'mini'">+1% </Text>
        </div>
        <div class="chart" id="l0k-swap-liquidity-chart"></div>
      </div>
      <div class="chart-wrapper">
        <Text>
          {{ t('analytics.volume') }}
        </Text>
        <div class="total">
          <Text bold :size="'large'">$ 1.002B </Text>
          <Text class="change" :color="'red'" :size="'mini'">-1% </Text>
        </div>
        <div class="chart" id="l0k-swap-volume-chart"></div>
      </div>
    </div>
    <Pairs />
    <Transactions />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import useECharts, { EChartsOption } from '../../hooks/useECharts'
import Text from '../../components/Text/Text.vue'
import Pairs from './Pairs.vue'
import Transactions from './Transactions.vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  components: {
    Text,
    Pairs,
    Transactions,
  },
  setup() {
    const { t } = useI18n()

    const liquidityOps = ref<EChartsOption>({
      xAxis: { data: ['2022/1', '2022/1', '2022/1', '2022/1'] },
      series: { data: ['1', '16', '4', '20'] },
    })
    const volumeOps = ref<EChartsOption>({
      xAxis: { data: ['2022/1', '2022/1', '2022/1', '2022/1'] },
      series: { data: ['1', '16', '4', '20'] },
    })

    useECharts('l0k-swap-liquidity-chart', liquidityOps)

    useECharts('l0k-swap-volume-chart', volumeOps)

    return {
      t,
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/index.scss';

.l0k-swap-analytics {
  max-width: 1040px;
  border-radius: 20px;
  background: $color-white;
  margin: 28px auto;
  padding: 20px;
  .charts {
    display: flex;
    justify-content: space-between;
    .chart-wrapper {
      flex: 1;
      width: 100%;
      padding: 16px;
      &:first-child {
        margin-right: 16px;
      }
      .total {
        display: flex;
        .change {
          margin-top: 14px;
          margin-left: 8px;
        }
      }
      .chart {
        width: 100%;
        height: 196px;
      }
    }
  }

  .el-pagination {
    justify-content: flex-end;
    .el-pager li.is-active {
      background: $color-navy-blue;
      color: $color-white;
      border-radius: 8px;
    }
  }
  .el-date-editor--datetimerange {
    width: 348px;
  }
}
</style>
