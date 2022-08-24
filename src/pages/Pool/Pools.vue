<template>
  <div class="pools-wrapper">
    <div class="pools-head">
      <Text class="name" :size="'small'">
        {{ t('pool.name') }}
      </Text>
      <Text class="APR" :size="'small'">
        {{ t('pool.APR') }}
      </Text>
      <Text class="liquidit" :size="'small'">
        {{ t('pool.liquidit') }}
      </Text>
    </div>
    <div class="pools">
      <div class="name"></div>
      <div class="APR"></div>
      <div class="liquidit"></div>
      <div class="get"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import Text from '../../components/Text/Text.vue'

export default defineComponent({
  components: {
    Text,
  },
  setup() {
    const { t } = useI18n()

    return {
      t,
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/index.scss';

.pools-wrapper {
  padding: 0 20px 20px;

  .pools-head {
    display: grid;
    align-items: center;
    grid-template-columns: 170px 90px 170px 170px;
    background: $color-bg-secondary;
    height: 32px;

    .name,
    .APR,
    .liquidit {
      display: flex;
      justify-content: center;
    }
  }

  .pools {
    display: grid;
    grid-template-columns: 170px 90px 170px 170px;

    .APR,
    .liquidit {
      display: flex;
      justify-content: center;
    }
  }

  @include mobile {
    width: 351px;
    padding: 0;

    .pools-head {
      grid-template-columns: 108px 40px 103px 100px;
    }

    .pools {
      grid-template-columns: 108px 40px 103px 100px;
    }
  }
}
</style>
