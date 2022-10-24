import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
} from 'echarts/components'
import { LineChart, LineSeriesOption } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { onMounted, onUnmounted, Ref, ShallowRef, shallowRef, toRaw, watch } from 'vue'
import { merge } from 'lodash'
import { useEventListener } from '@vueuse/core'

echarts.use([TitleComponent, TooltipComponent, GridComponent, LineChart, CanvasRenderer, UniversalTransition])

export type EChartsOption = echarts.ComposeOption<TitleComponentOption | TooltipComponentOption | GridComponentOption | LineSeriesOption>

export default function useECharts(
  elementId: string,
  options: Ref<EChartsOption>,
  loading?: Ref<boolean>
): {
  echart: ShallowRef<echarts.ECharts | undefined>
} {
  const echart = shallowRef<echarts.ECharts>()

  useEventListener('resize', () => echart.value?.resize())

  watch([options], () => {
    echart.value?.setOption(merge(toRaw(options.value), defaultChartsOptions))
  })

  watch([loading], () => {
    if (loading?.value) {
      echart.value?.showLoading()
    } else {
      echart.value?.hideLoading()
    }
  })

  onMounted(() => {
    const element = document.getElementById(elementId)
    if (element) {
      echart.value = echarts.init(element)
      echart.value.setOption(merge(toRaw(options.value), defaultChartsOptions))
    }
  })

  onUnmounted(() => {
    echart.value?.dispose()
  })

  return {
    echart,
  }
}

export const defaultChartsOptions: EChartsOption = {
  title: { show: false },
  color: ['rgb(28,119,255)'],
  grid: { top: 10, left: 30, right: 0, bottom: 0, containLabel: true },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
    },
    backgroundColor: '#fff',
    textStyle: {
      color: '#111',
    },
  },
  xAxis: {
    type: 'category',
    axisLabel: { color: '#999', fontSize: 10 },
    axisLine: { lineStyle: { width: 1, color: '#EEE' } },
    axisTick: { show: false },
    splitLine: { show: false },
    data: [],
  },
  yAxis: {
    type: 'value',
    splitLine: { show: false },
    axisLabel: { color: '#999', fontSize: 10 },
    offset: -6,
    position: 'right',
  },
  series: {
    type: 'line',
    showSymbol: false,
    lineStyle: { color: 'rgb(28,119,255)' },
    data: [],
  },
}
