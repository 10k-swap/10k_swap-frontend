<template>
  <Page class="l0k-swap-pool-wrapper" :title="t('pool.title')">
    <template v-slot:head-right>
      <Button class="my-pools" :size="'small'" :type="'secondary'" disabled>
        {{ t('pool.my_pools') }}
      </Button>
      <Button :size="'small'" :type="'primary'" @click="onShowPoolModal">
        {{ t('pool.new_position') }}
      </Button>
    </template>
  </Page>
  <PoolModal />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import Page from '../../components/Page/Page.vue'
import Button from '../../components/Button/Button'
import PoolModal from '../../components/PoolModal/PoolModal.vue'
import { usePoolModalStore } from '../../state'

export default defineComponent({
  components: {
    Page,
    Button,
    PoolModal
  },
  setup() {
    const { t } = useI18n()
    const poolModalStore = usePoolModalStore()

    const onShowPoolModal = () => {
      poolModalStore.togglePoolModal(true)
    }

    return {

      onShowPoolModal,
      t
    }
  },
})
</script>

<style lang="scss" scoped>
.l0k-swap-pool-wrapper {
  margin-top: 28px;

  .my-pools {
    margin-right: 8px;
  }
}
</style>
