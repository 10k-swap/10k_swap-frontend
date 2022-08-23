import { defineStore } from 'pinia'
import { INITIAL_ALLOWED_SLIPPAGE } from '../../constants'
import SlippageStorageManager from './SlippageStorageManager'

type SetType = 'swap' | 'liqiudit'

interface SettingsState {
  currentSet: SetType | undefined
  slippageTolerances: {
    swap: number
    liqiudit: number
  }
}

interface SettingsActions {
  updateCurrentSet: (set: SetType) => void
  updateSlippageTolerance: (slippageTolerance: number) => void
}

export const RISKY_SLIPPAGE_LOW = 10
export const MAX_SLIPPAGE = 10000

export const useSlippageToleranceSettingsStore = defineStore<'SlippageToleranceSettings', SettingsState, {}, SettingsActions>(
  'SlippageToleranceSettings',
  {
    state: () => {
      const { swap, liqiudit } = SlippageStorageManager.get() ?? {}

      return {
        currentSet: undefined,
        slippageTolerances: {
          swap: swap ? swap : INITIAL_ALLOWED_SLIPPAGE,
          liqiudit: liqiudit ? liqiudit : INITIAL_ALLOWED_SLIPPAGE,
        },
      }
    },
    actions: {
      updateCurrentSet(set: SetType) {
        this.currentSet = set
      },
      updateSlippageTolerance(slippageTolerance: number) {
        const currentSet = this.currentSet
        if (!currentSet) {
          throw Error('No current set fund')
        }
        this.slippageTolerances[currentSet] = slippageTolerance
        SlippageStorageManager.set(this.slippageTolerances)
      },
    },
  }
)
