<template>
  <Modal v-model="showModal">
    <template v-slot:header>
      <ModalHeader>
        <template v-slot:left>
          <BackIcon class="l0k-swap-pair-modal-icon" @click="showModal = false" />
        </template>
        <Tabs :tabs="tabs" :current="current" @change="onChange" />
        <template v-slot:right>
          <SettingIcon class="l0k-swap-pair-modal-icon" @click="onSetting" />
        </template>
      </ModalHeader>
    </template>
    <div class="l0k-swap-pair-modal">
      <AddLiqiudit :token0="token0" :token1="token1" />
    </div>
  </Modal>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from '../Modal/Modal.vue'
import ModalHeader from '../Modal/ModalHeader.vue'
import Text from '../Text/Text.vue'
import Tabs from './Tabs.vue'
import AddLiqiudit from '../AddLiqiudit/AddLiqiudit.vue'
import { BackIcon, SettingIcon } from '../Svg'
import { useModalStore, useSlippageToleranceSettingsStore, usePoolModalStore } from '../../state'
import { useTokenBalances } from '../../hooks/Balances'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { ZERO } from '../../sdk/constants'
import { Action } from './type'

export default defineComponent({
  components: {
    Modal,
    ModalHeader,
    BackIcon,
    SettingIcon,
    Text,
    Tabs,
    AddLiqiudit
  },
  setup() {
    const { t } = useI18n()
    const modalStore = useModalStore()
    const poolModalStore = usePoolModalStore()
    const slippageToleranceSettingsStore = useSlippageToleranceSettingsStore()

    const { state: { account } } = useStarknet()

    const liquidityToken = computed(() => poolModalStore.pair?.liquidityToken)
    const liquidityTokenBalances = useTokenBalances(account, liquidityToken)

    const showModal = computed({
      get: () => poolModalStore.show,
      set(newValue) {
        poolModalStore.togglePoolModal(newValue)
      }
    })

    const current = ref<Action>('mint')
    const fromWithdraw = computed(() => poolModalStore.fromWithdraw)
    watch(fromWithdraw, () => current.value = 'burn')
    const tabs = computed(() => {
      const base: { label: string; value: Action }[] = [{ label: t('poolModal.addLiqiudit'), value: 'mint' }]
      if (liquidityTokenBalances.value?.greaterThan(ZERO) || fromWithdraw.value) {
        base.push({
          label: t('poolModal.withdraw'),
          value: 'burn'
        })
      }
      return base
    })

    const onSetting = () => {
      modalStore.toggleSlippageToleranceSettingsModal(true)
      slippageToleranceSettingsStore.updateCurrentSet('addLiqiudit')
    }
    const onChange = (tab: Action) => {
      current.value = tab
    }

    return {
      showModal,
      tabs,
      current,
      token0: computed(() => poolModalStore.pair?.token0),
      token1: computed(() => poolModalStore.pair?.token1),

      onSetting,
      onChange,
      t,
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';

.l0k-swap-pair-modal-icon {
  cursor: pointer;
}

.l0k-swap-pair-modal {}
</style>