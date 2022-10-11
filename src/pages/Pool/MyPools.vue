<template>
  <div class="my-pools-wrapper">
    <div class="tips-wrap" v-if="!account || loading || !userPairs.length">
      <Text class="tips" v-if="!account" :color="'description-text'">
        {{ t('pool.tips') }}
      </Text>
      <div class="loading" v-else-if="loading">
        <LoadingIcon />
      </div>
      <template v-else>
        <Text class="tips" :color="'description-text'">
          {{ t('pool.tips2') }}
        </Text>
        <Button class="deposit" plain bold @click="onDeposit"> {{ t('pool.deposit') }}</Button>
      </template>
    </div>
    <template v-else>
      <div class="my-pools">
        <template v-for="item in userPairs" :key="item.pair.liquidityToken.address">
          <MyPoolItem :data="item" />
        </template>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import Text from '../../components/Text/Text.vue'
import Button from '../../components/Button/Button'
import useIsMobile from '../../hooks/useIsMobile'
import MyPoolItem from './MyPoolItem.vue'
import { LoadingIcon } from '../../components/Svg'
import { useIsLoadingUserPairs, useUserPairs } from '../../state/pool/hooks'
import { usePoolModalStore } from '../../state'
import { useStarknet } from '../../starknet-vue/providers/starknet'

export default defineComponent({
  components: {
    Text,
    Button,
    LoadingIcon,
    MyPoolItem,
  },
  setup() {
    const { t } = useI18n()
    const {
      state: { account },
    } = useStarknet()

    const isMobile = useIsMobile()
    const userPairs = useUserPairs()
    const loading = useIsLoadingUserPairs()
    const poolModalStore = usePoolModalStore()

    const onDeposit = () => {
      poolModalStore.newPosition()
    }

    return {
      userPairs,
      isMobile,
      account,
      loading,

      t,
      onDeposit,
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/index.scss';

.my-pools-wrapper {
  padding: 0 20px 20px;
  overflow-x: auto;
  .tips-wrap {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 80px;
    min-height: 200px;
    .deposit {
      margin-top: 35px;
    }
  }
}
</style>
