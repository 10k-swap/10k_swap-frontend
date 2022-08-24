<template>
  <div class="my-pools-wrapper">
    <div class="my-pools-head">
      <Text class="name" :size="'small'">
        {{ t('pool.name') }}
      </Text>
      <Text class="APR" :size="'small'">
        {{ t('pool.APR') }}
      </Text>
      <Text class="liquidit" :size="'small'">
        {{ t('pool.liquidit') }}
      </Text>
      <Text class="pool-share" :size="'small'">
        {{ t('pool.pool_share') }}
      </Text>
    </div>
    <div class="my-pools">
      <div class="name"></div>
      <div class="APR"></div>
      <div class="liquidit"></div>
      <div class="pool-share"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import Text from '../../components/Text/Text.vue'

export default defineComponent({
  components: {
    Text
  },
  setup() {
    const { t } = useI18n()

    return {
      t
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/index.scss';

.my-pools-wrapper {
  padding: 0 20px 20px;

  .my-pools-head {
    display: grid;
    align-items: center;
    grid-template-columns: 155px 90px 155px 200px;
    background: $color-bg-secondary;
    height: 32px;

    .name,
    .APR,
    .liquidit {
      display: flex;
      justify-content: center;
    }
  }

  .my-pools {
    display: grid;
    grid-template-columns: 155px 90px 155px 200px;

    .APR,
    .liquidit {
      display: flex;
      justify-content: center;
    }
  }

  @include mobile {
    width: 351px;
    padding: 0;

    .my-pools-head {
      grid-template-columns: 76px 44px 103px 128px;
    }

    .my-pools {
      grid-template-columns: 76px 44px 103px 128px;
    }
  }
}
</style>