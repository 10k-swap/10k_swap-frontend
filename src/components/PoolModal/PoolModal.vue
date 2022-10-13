<template>
  <Modal v-model="showModal" :top="currentNav === Actions.BURN ? '80px' : isMobile ? '30%' : '140px'">
    <template v-slot:header>
      <ModalHeader>
        <template v-slot:left>
          <BackIcon class="l0k-swap-pair-modal-icon" @click="showModal = false" />
        </template>
        <Tabs :tabs="tabs" :current="currentNav" @change="onChange" />
        <template v-slot:right>
          <SettingIcon class="l0k-swap-pair-modal-icon" @click="onSetting" />
        </template>
      </ModalHeader>
    </template>
    <div class="l0k-swap-pair-modal">
      <div v-if="currentNav === Actions.MINT">
        <AddLiquidity />
      </div>
      <div v-if="currentNav === Actions.BURN">
        <RemoveLiquidity :pair="removeLiquidityPair ?? undefined" />
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, watch } from 'vue'
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
        poolModalStore.togglePoolModal(newValue)
      },
    })

    const tabs = computed(() => poolModalStore.tabs)
    const currentNav = computed(() => poolModalStore.currentNav)

    const onSetting = () => {
      modalStore.toggleSlippageToleranceSettingsModal(true)
      slippageToleranceSettingsStore.updateCurrentSet('liquidity')
    }
    const onChange = (tab: Actions) => {
      poolModalStore.updateNav(tab)
    }

    return {
      showModal,
      tabs,
      currentNav,
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
