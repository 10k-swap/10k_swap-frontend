import { onMounted, ref, Ref, watch } from 'vue'
import { getPairs, getTransactions, getChartsData, PairResponse, TransactionsResponse, ChartsDataResponse } from '../../server/analytics'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { TransactionType } from './types'

export function useTransactions(dates: Ref<[Date, Date]>, page: Ref<number>, type: Ref<TransactionType | undefined>) {
  const transactions = ref<TransactionsResponse>()

  const {
    state: { chainId },
  } = useStarknet()

  const _getTransactions = async () => {
    if (chainId.value) {
      transactions.value = await getTransactions(chainId.value, {
        page: page.value,
        startTime: Math.trunc(dates.value[0].getTime() / 1000),
        endTime: Math.trunc(dates.value[1].getTime() / 1000),
        type: type.value,
      })
    }
  }

  onMounted(() => _getTransactions())

  watch([dates, page, type], () => _getTransactions())

  return transactions
}

export function usePairs(dates: Ref<[Date, Date]>, page: Ref<number>) {
  const pairs = ref<PairResponse>()

  const {
    state: { chainId },
  } = useStarknet()

  const _getPairs = async () => {
    if (chainId.value) {
      pairs.value = await getPairs(chainId.value, {
        page: page.value,
        startTime: Math.trunc(dates.value[0].getTime() / 1000),
        endTime: Math.trunc(dates.value[1].getTime() / 1000),
      })
    }
  }

  onMounted(() => _getPairs())

  watch([dates, page], () => _getPairs())

  return pairs
}

export function useChartsData(): [Ref<ChartsDataResponse | undefined>, Ref<boolean>] {
  const chartsData = ref<ChartsDataResponse>()
  const loading = ref(false)

  const {
    state: { chainId },
  } = useStarknet()

  const _getCharts = async () => {
    if (chainId.value) {
      loading.value = true
      chartsData.value = await getChartsData(chainId.value)
      loading.value = false
    }
  }

  onMounted(() => _getCharts())

  return [chartsData, loading]
}
