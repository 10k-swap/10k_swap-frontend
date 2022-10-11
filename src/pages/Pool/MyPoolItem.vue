<template>
  <div class="pair-wrapper">
    <div class="overview" @click="shwoMore = !shwoMore">
      <div class="pair">
        <DoubleLogo :token0="data.pair.token0" :token1="data.pair.token1" :size="20" />
        <Text class="symbol" :size="'small'" :color="'secondary-text'"> {{ data.pair.token0.symbol }}-{{ data.pair.token1.symbol }} </Text>
      </div>
      <div class="manage">
        <Text :size="'small'" :color="'blue'"> {{ t('pool.manage') }} </Text>
        <ArrowDownIcon class="arrow" :color="'blue'" width="11px" :class="{ show: shwoMore }" />
      </div>
    </div>
    <div class="position-wrapper" v-show="shwoMore">
      <div class="position">
        <div class="cell">
          <Text class="label" :size="'small'">{{ t('pool.total_pool_tokens') }}</Text>
          <Text :size="'small'" :color="'description-text'"> {{ data.balance.toSignificant() }}</Text>
        </div>
        <div class="cell">
          <Text class="label" :size="'small'">{{ t('pool.pooled', { symbol: data.pair.token0.symbol }) }}</Text>
          <Text :size="'small'" :color="'description-text'"> {{ liquidityValues[0].toSignificant() }}</Text>
        </div>
        <div class="cell">
          <Text class="label" :size="'small'">{{ t('pool.pooled', { symbol: data.pair.token1.symbol }) }}</Text>
          <Text :size="'small'" :color="'description-text'"> {{ liquidityValues[1].toSignificant() }}</Text>
        </div>
        <div class="cell">
          <Text class="label" :size="'small'">{{ t('pool.your_pool_share') }}</Text>
          <Text :size="'small'" :color="'description-text'"> {{ data.poolShareView }}%</Text>
        </div>
        <div class="btns">
          <Button :size="'small'" :type="'primary'" @click="onAdd"> {{ t('pool.add_liquidity') }} </Button>
          <Button :size="'small'" :type="'secondary'" @click="onRemove"> {{ t('pool.withdraw') }}</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
import { usePoolModalStore, UserPool } from '../../state'
import DoubleLogo from '../../components/DoubleLogo/index.vue'
import Text from '../../components/Text/Text.vue'
import { ArrowDownIcon } from '../../components/Svg'
import { useI18n } from 'vue-i18n'
import { TokenAmount } from 'l0k_swap-sdk'
import Button from '../../components/Button/Button'

export default defineComponent({
  props: {
    data: {
      required: true,
      type: Object as PropType<UserPool>,
    },
  },
  components: {
    DoubleLogo,
    ArrowDownIcon,
    Text,
    Button,
  },
  setup(props) {
    const { data } = toRefs(props)

    const poolModalStore = usePoolModalStore()
    const { t } = useI18n()

    const shwoMore = ref(false)

    const liquidityValues = computed(() => {
      const { pair, totalSupply, balance } = data.value
      const { token0, token1 } = pair

      return [
        new TokenAmount(token0, pair.getLiquidityValue(token0, totalSupply, balance, false).raw),
        new TokenAmount(token1, pair.getLiquidityValue(token1, totalSupply, balance, false).raw),
      ]
    })

    const onAdd = () => {
      poolModalStore.addLiquidity(data.value.pair)
    }
    const onRemove = () => {
      poolModalStore.withdraw(data.value.pair)
    }

    return {
      shwoMore,
      liquidityValues,

      t,
      onAdd,
      onRemove,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/index.scss';
.pair-wrapper {
  background: $color-white;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  margin-top: 12px;

  .overview {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 52px;
    padding: 0 16px;
    cursor: pointer;
    .pair {
      display: flex;
      align-items: center;
      .symbol {
        margin-left: 6px;
      }
    }
    .manage {
      display: flex;
      align-items: center;
      .arrow {
        margin-left: 4px;
        transition: all 0.3s;
        &.show {
          transform: translateY(-50%) rotate(0.5turn);
        }
      }
    }
  }

  .position-wrapper {
    padding: 0 16px 16px;
    box-sizing: border-box;
    .position {
      background: $color-bg-secondary;
      border-radius: 20px;
      padding: 16px;
      .cell {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 8px;
      }

      .btns {
        display: flex;
        justify-content: center;
        margin-top: 8px;
        button {
          width: 100px;
          &:last-child {
            margin-left: 16px;
          }
        }
      }
    }
  }
}
</style>
