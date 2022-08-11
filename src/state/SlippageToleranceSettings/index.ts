import { defineStore } from 'pinia'
import SlippageStorageManager from './SlippageStorageManager'

type SetType = 'swap' | 'addLiqiudit'

interface SettingsState {
  currentSet: SetType | undefined
  slippageTolerances: {
    swap: number
    addLiqiudit: number
  }
}

interface SettingsActions {
  updateCurrentSet: (set: SetType) => void
  updateSlippageTolerance: (slippageTolerance: number) => void
}

export const RISKY_SLIPPAGE_LOW = 10
export const DEFAULT_SLIPPAGE = 20
export const MAX_SLIPPAGE = 10000

export const useSlippageToleranceSettingsStore = defineStore<'SlippageToleranceSettings', SettingsState, {}, SettingsActions>(
  'SlippageToleranceSettings',
  {
    state: () => {
      const { swap, addLiqiudit } = SlippageStorageManager.get() ?? {}

      return {
        currentSet: undefined,
        slippageTolerances: {
          swap: swap ? swap : DEFAULT_SLIPPAGE,
          addLiqiudit: addLiqiudit ? addLiqiudit : DEFAULT_SLIPPAGE,
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
