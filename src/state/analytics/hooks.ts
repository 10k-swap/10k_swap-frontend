import { onMounted, ref, Ref, watch } from 'vue'
import { getPairs, getTransactions, PairResponse, TransactionsResponse } from '../../server/analytics'
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
