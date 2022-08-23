<template>
  <Popper :interactive="false" @close:popper="show = false" @open:popper="show = true">
    <div class="l0k-swap-select-token--button" role="button">
      <template v-if="current">
        <TokenLogo class="l0k-swap-select-token--button-logo" :token="current" />
        <Text bold class="text"> {{ current?.symbol }} </Text>
      </template>
      <template v-else>
        <Text class="select">{{ t('token_select.label') }}</Text>
      </template>
      <ArrowDownIcon class="arrow" :class="{ show: show }" width="11px" />
    </div>
    <template #content>
      <div class="l0k-swap-select-token--tokens">
        <div class="l0k-swap-select-token--token" :class="{ 'active': current && token.equals(current) }"
          v-for="token in tokens" :key="token.address" @click="onSelect(token)">
          <TokenLogo class="l0k-swap-select-token--token-logo" :token="token" />
          <Text class="text"> {{ token.symbol }} </Text>
        </div>
      </div>
    </template>
  </Popper>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
import Popper from 'vue3-popper'
import TokenLogo from '../TokenLogo/TokenLogo'
import tokensList from '../../constants/tokens'
import Text from '../Text/Text.vue'
import { ArrowDownIcon } from '../Svg'
import { Token } from '../../sdk'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  props: {
    token: {
      type: Object as PropType<Token | null>,
    }
  },
  components: {
    Popper,
    TokenLogo,
    Text,
    ArrowDownIcon
  },
  emits: ['select'],
  setup(props, { emit }) {
    const { token } = toRefs(props)
    const { state: { chainId } } = useStarknet()
    const { t } = useI18n()

    const show = ref(false)

    const tokens = computed(() => chainId.value ? tokensList[chainId.value] : [])

    const current = computed({
      get: () => token.value,
      set(newValue) {
        emit('select', newValue)
      }
    })

    const onSelect = (selected: Token) => {
      current.value = selected
    }

    return {
      current,
      tokens,
      show,

      t,
      onSelect
    }
  }
})
</script>

<style lang="scss">
@import '../../styles/index.scss';

.l0k-swap-select-token--button {
  display: flex;
  align-items: center;
  position: relative;
  width: 120px;
  height: 40px;
  background: $color-white;
  border-radius: 20px;
  padding: 0 30px 0 8px;
  cursor: pointer;
  box-sizing: border-box;

  .l0k-swap-select-token--button-logo {
    margin-right: 8px;
  }

  .select {
    margin-left: 10px
  }

  .text {
    @include no-wrap;
  }

  .arrow {
    position: absolute;
    right: 13px;
    top: 50%;
    transform: translateY(-50%);
    transition: all .3s;

    &.show {
      transform: translateY(-50%) rotate(0.5turn);
    }
  }
}

.l0k-swap-select-token--tokens {
  width: 136px;
  max-height: 264px;
  background: $color-white;
  box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.16);
  border-radius: 20px;
  overflow-y: scroll;
  padding: 12px 8px;
  @include no-scrollbar;

  .l0k-swap-select-token--token {
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 20px;
    cursor: pointer;

    &.active {
      background: $color-bg-secondary;
    }

    &:hover:not(.active) {
      background: rgba($color: $color-bg-secondary, $alpha: 0.7);
    }

    .text {
      @include no-wrap;
    }

    .l0k-swap-select-token--token-logo {
      margin-right: 8px;
    }
  }
}
</style>