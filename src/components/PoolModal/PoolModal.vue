<template>
  <Modal v-model="showModal" :top="currentTab === Actions.BURN ? '80px' : isMobile ? '30%' : '140px'">
    <template v-slot:header>
      <ModalHeader>
        <template v-slot:left>
          <BackIcon class="l0k-swap-pair-modal-icon" @click="showModal = false" />
        </template>
        <Tabs :tabs="tabs" :current="currentTab" @change="onChange" />
        <template v-slot:right>
          <SettingIcon class="l0k-swap-pair-modal-icon" @click="onSetting" />
        </template>
      </ModalHeader>
    </template>
    <div class="l0k-swap-pair-modal">
      <div v-if="currentTab === Actions.MINT">
        <AddLiquidity />
      </div>
      <div v-if="currentTab === Actions.BURN">
        <RemoveLiquidity :pair="removeLiquidityPair ?? undefined" />
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from '../Modal/Modal.vue'
import ModalHeader from '../Modal/ModalHeader.vue'
import Tabs from './Tabs.vue'
import AddLiquidity from '../AddLiquidity/AddLiquidity.vue'
import RemoveLiquidity from '../RemoveLiquidity/RemoveLiquidity.vue'
import { BackIcon, SettingIcon } from '../Svg'
import { useModalStore, useSlippageToleranceSettingsStore, usePoolModalStore, useMintStore } from '../../state'
import { Actions } from '../../state/poolModal'
import { Pair } from 'l0k_swap-sdk'
import useIsMobile from '../../hooks/useIsMobile'

export default defineComponent({
  components: {
    Modal,
    ModalHeader,
    BackIcon,
    SettingIcon,
    Tabs,
    AddLiquidity,
    RemoveLiquidity,
  },
  setup() {
    const { t } = useI18n()
    const modalStore = useModalStore()
    const isMobile = useIsMobile()
    const poolModalStore = usePoolModalStore()
    const mintStore = useMintStore()
    const slippageToleranceSettingsStore = useSlippageToleranceSettingsStore()

    const addLiquidityPair = computed(() => poolModalStore.addLiquidityPair)
    const removeLiquidityPair: ComputedRef<Pair | undefined> = computed(() => poolModalStore.removeLiquidityPair as Pair)

    watch([addLiquidityPair], () => {
      if (addLiquidityPair.value) {
        mintStore.selectToken({
          tokenA: addLiquidityPair.value?.token0,
          tokenB: addLiquidityPair.value?.token1,
        })
      }
    })

    const showModal = computed({
      get: () => poolModalStore.show,
      set(newValue) {
        if (!newValue) {
          current.value = undefined
        }
        poolModalStore.togglePoolModal(newValue)
      },
    })

    const current = ref<Actions>()
    const action = computed(() => poolModalStore.action)
    const currentTab = computed<Actions>(() => current.value ?? action.value)

    const tabs = computed(() => {
      const base: { label: string; value: Actions }[] = [{ label: t('pool_modal.add_liquidity'), value: Actions.MINT }]
      if (action.value === Actions.BURN) {
        base.push({
          label: t('pool_modal.withdraw'),
          value: Actions.BURN,
        })
      }
      return base
    })

    const onSetting = () => {
      modalStore.toggleSlippageToleranceSettingsModal(true)
      slippageToleranceSettingsStore.updateCurrentSet('liquidity')
    }
    const onChange = (tab: Actions) => {
      current.value = tab
    }

    return {
      showModal,
      tabs,
      currentTab,
      removeLiquidityPair,
      isMobile,
      Actions,

      onSetting,
      onChange,
      t,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';

.l0k-swap-pair-modal-icon {
  cursor: pointer;
}
</style>
