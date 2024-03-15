<template>
  <div class="l0k-swap-analytics">
    <div class="charts">
      <div class="chart-wrapper">
        <Text>
          {{ t('analytics.liquidity') }}
        </Text>
        <div class="last">
          <Text bold :size="'large'">{{ lastLiquidity?.[0] }} </Text>
          <Text class="change" v-if="lastLiquidity?.[1]" :color="lastLiquidity?.[1] && lastLiquidity?.[1] > 0 ? 'primary' : 'red'" :size="'mini'">
            {{ `${lastLiquidity[1] > 0 ? '+ ' + lastLiquidity[1].toFixed(2) : lastLiquidity[1].toFixed(2)}` }} %
          </Text>
        </div>
        <div class="chart" id="l0k-swap-liquidity-chart"></div>
      </div>
      <div class="chart-wrapper">
        <Text>
          {{ t('analytics.volume') }}
        </Text>
        <div class="last">
          <Text bold :size="'large'">{{ lastVolume?.[0] }} </Text>
        </div>
        <div class="chart" id="l0k-swap-volume-chart"></div>
      </div>
    </div>
    <Pairs v-if="false" />
    <Transactions v-if="false" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import * as echarts from 'echarts/core'
import useECharts, { EChartsOption } from '../../../hooks/useECharts'
import Text from '../../../components/Text/Text.vue'
import Pairs from './Pairs.vue'
import Transactions from './Transactions.vue'
import { useI18n } from 'vue-i18n'
import { useChartsData } from '../../../state/analytics/hooks'
import numeral from 'numeral'
import useIsMobile from '../../../hooks/useIsMobile'

const areaStyle = {
  opacity: 0.8,
  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: 'rgba(28, 119, 255, 0.6)' },
    { offset: 1, color: 'rgba(28, 119, 255, 0.01)' },
  ]),
} as const

export default defineComponent({
  components: {
    Text,
    Pairs,
    Transactions,
  },
  setup() {
    const { t } = useI18n()

    const [chartsData, loading] = useChartsData()

    const isMobile = useIsMobile()

    const liquidityOps = computed<EChartsOption>(() => ({
      xAxis: { data: chartsData.value?.tvls.map((item) => item.date + ' UTC') ?? [] },
      yAxis: {
        axisLabel: { formatter: (tvl: string) => numeral(tvl).format('$0.0 a').toUpperCase() },
      },
      series: {
        smooth: true,
        data: chartsData.value?.tvls.map((item) => item.tvl.toFixed(2)) ?? [],
        areaStyle: isMobile.value ? areaStyle : undefined,
      },
    }))

    const volumeOps = computed<EChartsOption>(() => ({
      xAxis: { data: chartsData.value?.volumes.map((item) => item.date + ' UTC') ?? [] },
      yAxis: {
        axisLabel: { formatter: (volume: string) => numeral(volume).format('$0.0 a').toUpperCase() },
      },
      series: {
        smooth: true,
        data: chartsData.value?.volumes.map((item) => item.volume.toFixed(2)) ?? [],
        areaStyle: isMobile.value ? areaStyle : undefined,
      },
    }))

    useECharts('l0k-swap-liquidity-chart', liquidityOps, loading)
    useECharts('l0k-swap-volume-chart', volumeOps, loading)

    const lastLiquidity = computed<undefined | [string, number | undefined]>(() => {
      if (!chartsData.value) {
        return undefined
      }

      const tvls = chartsData.value.tvls
      const lastTvl = tvls[tvls.length - 1].tvl
      const yesterdayTvl = tvls[tvls.length - 2].tvl

      const diff = lastTvl - yesterdayTvl
      const percent = (diff / yesterdayTvl) * 100

      return [numeral(lastTvl).format('$0.0 a').toUpperCase(), Math.abs(percent) > 1e-2 ? percent : undefined]
    })

    const lastVolume = computed<undefined | [string, number | undefined]>(() => {
      if (!chartsData.value) {
        return undefined
      }

      const volumes = chartsData.value.volumes
      const lastVolume = volumes[volumes.length - 1].volume
      const yesterdayVolume = volumes[volumes.length - 2].volume

      const diff = lastVolume - yesterdayVolume
      const percent = (diff / yesterdayVolume) * 100

      return [numeral(lastVolume).format('$0.0 a').toUpperCase(), Math.abs(percent) > 1e-2 ? percent : undefined]
    })

    return {
      t,

      lastLiquidity,
      lastVolume,
    }
  },
})
</script>

<style lang="scss">
@import '../../../styles/index.scss';

.l0k-swap-analytics {
  width: 1040px;
  border-radius: 20px;
  background: $color-white;
  margin: 28px auto;
  padding: 20px;
  @media screen and (max-width: 1040px) {
    width: calc(100% - 24px);
    margin: 8px 12px;
    padding: 20px 12px;
    box-sizing: border-box;
  }

  .charts {
    display: flex;
    justify-content: space-between;

    .chart-wrapper {
      flex: 1;
      width: 100%;
      padding: 16px;
      box-sizing: border-box;
      &:first-child {
        margin-right: 16px;
      }
      .last {
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
    @include mobile {
      flex-direction: column;
      justify-content: center;
      .chart-wrapper {
        padding: 0;
        &:first-child {
          margin-right: 0;
          margin-bottom: 32px;
        }
      }
    }
  }

  .el-pagination {
    justify-content: flex-end;
    .el-pager li.is-active {
      background: $color-nav-blue;
      color: $color-white;
      border-radius: 8px;
    }
  }
  .el-date-editor {
    width: 348px;
    border-radius: 20px;
    @include mobile {
      width: 100%;
      box-sizing: border-box;
    }
  }
}
</style>
