import { onMounted, ref } from 'vue'
import { getUSD } from '../../server/getUSD'

export function useUSDPrice() {
  const rates = ref<{ [symbol: string]: string }>()
  const loading = ref(false)

  const _getCharts = async () => {
    loading.value = true

    rates.value = await getUSD()

    loading.value = false
  }

  onMounted(() => _getCharts())

  return [rates, loading] as const
}
