import { defineStore } from 'pinia'

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

export const useSlippageToleranceSettingsStore = defineStore<'SlippageToleranceSettings', SettingsState, {}, SettingsActions>(
  'SlippageToleranceSettings',
  {
    state: () => {
      return {
        currentSet: undefined,
        slippageTolerances: {
          swap: 20,
          addLiqiudit: 20,
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
      },
    },
  }
)
