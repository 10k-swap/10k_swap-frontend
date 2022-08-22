<template>
  <Page class="l0k-swap-pool-wrapper" :title="t('pool.title')">
    <template v-slot:head-right>
      <Button class="my-pools" :size="'small'" :type="'secondary'" disabled>
        {{ t('pool.my_pools') }}
      </Button>
      <Button :size="'small'" :type="'primary'" @click="onShowPoolModal">
        {{ isMobile ? '+' : t('pool.new_position') }}
      </Button>
    </template>
    <div class="pools">
      <template v-if="indexs === null">
        loading...
      </template>
      <template v-else-if="!indexs">
        No Items
      </template>
      <template v-for="item in indexs" :key="item">
        <PoolItem :index="item" />
      </template>
    </div>
  </Page>
  <PoolModal />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import Page from '../../components/Page/Page.vue'
import Button from '../../components/Button/Button'
import Text from '../../components/Text/Text.vue'
import PoolModal from '../../components/PoolModal/PoolModal.vue'
import PoolItem from './PoolItem.vue'
import { usePoolModalStore } from '../../state'
import useIsMobile from '../../hooks/useIsMobile'
import { useAllPairIndexs } from '../../data/useAllPairIndexs'

export default defineComponent({
  components: {
    Page,
    Text,
    Button,
    PoolModal,
    PoolItem
  },
  setup() {
    const { t } = useI18n()
    const isMobile = useIsMobile()
    const poolModalStore = usePoolModalStore()
    const indexs = useAllPairIndexs()

    const onShowPoolModal = () => {
      poolModalStore.togglePoolModal(true)
    }

    return {
      isMobile,
      indexs,

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
