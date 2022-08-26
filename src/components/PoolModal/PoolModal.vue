<template>
  <Modal v-model="showModal">
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
        <AddLiqiudit :token0="tokens[0]" :token1="tokens[1]" />
      </div>
      <div v-if="currentTab === Actions.BURN">
        <RemoveLiqiudit :pair="removeLiqiuditPair ?? undefined" />
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from '../Modal/Modal.vue'
import ModalHeader from '../Modal/ModalHeader.vue'
import Tabs from './Tabs.vue'
import AddLiqiudit from '../AddLiqiudit/AddLiqiudit.vue'
import RemoveLiqiudit from '../RemoveLiqiudit/RemoveLiqiudit.vue'
import { BackIcon, SettingIcon } from '../Svg'
import { useModalStore, useSlippageToleranceSettingsStore, usePoolModalStore } from '../../state'
import { Actions } from '../../state/poolModal'
import { Pair } from '../../sdk'

export default defineComponent({
  components: {
    Modal,
    ModalHeader,
    BackIcon,
    SettingIcon,
    Tabs,
    AddLiqiudit,
    RemoveLiqiudit,
  },
  setup() {
    const { t } = useI18n()
    const modalStore = useModalStore()
    const poolModalStore = usePoolModalStore()
    const slippageToleranceSettingsStore = useSlippageToleranceSettingsStore()

    const addLiqiuditPair = computed(() => poolModalStore.addLiqiuditPair)
    const tokens = computed(() => [addLiqiuditPair.value?.token0, addLiqiuditPair.value?.token1])
    const removeLiqiuditPair: ComputedRef<Pair | undefined> = computed(() => poolModalStore.removeLiqiuditPair as Pair)

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
      const base: { label: string; value: Actions }[] = [{ label: t('poolModal.addLiqiudit'), value: Actions.MINT }]
      if (action.value === Actions.BURN) {
        base.push({
          label: t('poolModal.withdraw'),
          value: Actions.BURN,
        })
      }
      return base
    })

    const onSetting = () => {
      modalStore.toggleSlippageToleranceSettingsModal(true)
      slippageToleranceSettingsStore.updateCurrentSet('liqiudit')
    }
    const onChange = (tab: Actions) => {
      current.value = tab
    }

    return {
      showModal,
      tabs,
      currentTab,
      removeLiqiuditPair,
      tokens,
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
