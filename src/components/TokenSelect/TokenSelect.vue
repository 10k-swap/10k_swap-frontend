<template>
  <Popper :interactive="false">
    <div class="l0k-swap-select-token--button" role="button">
      <TokenLogo class="l0k-swap-select-token--button-logo" :token="current" />
      <Text bold class="text"> {{ current?.symbol }} </Text>
      <ArrowDownIcon class="arrow" width="11px" />
    </div>
    <template #content>
      <div class="l0k-swap-select-token--tokens">
        <div class="l0k-swap-select-token--token" :class="{ 'active': current.equals(token) }" v-for="token in tokens"
          :key="token.address" @click="onSelect(token)">
          <TokenLogo class="l0k-swap-select-token--token-logo" :token="token" />
          <Text class="text"> {{ token.symbol }} </Text>
        </div>
      </div>
    </template>
  </Popper>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue'
import Popper from 'vue3-popper'
import TokenLogo from '../TokenLogo/TokenLogo'
import Text from '../Text/Text.vue'
import { ArrowDownIcon } from '../Svg'
import { ChainId, Token } from '../../sdk'

const tokens = [
  new Token(ChainId.TESTNET, '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', 18, 'tes3tEth'),
  new Token(ChainId.TESTNET, '0x049d36570d4e46f48e99674bd3fcc84664ddd6b96f7c741b1562b82f9e004dc7', 18, 'testE5th'), new Token(ChainId.TESTNET, '0x049d36570d4e46f48e99674bd3fcc34644ddd6b96f7c741b1562b82f9e004dc7', 18, 'test3Eth'),
  new Token(ChainId.TESTNET, '0x049d36570d4e46f48e99674bd3fcc84648ddd6b96f7c741b1562b82f9e004dc7', 18, 'testEt5h'),
]

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<Token>,
      required: true,
    }
  },
  components: {
    Popper,
    TokenLogo,
    Text,
    ArrowDownIcon
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { modelValue } = toRefs(props)

    const current = computed({
      get: () => modelValue.value,
      set(newValue) {
        emit('update:modelValue', newValue)
      }
    })

    const onSelect = (selected: Token) => {
      current.value = selected
    }

    return {
      current,
      tokens,

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
  height: 40px;
  width: 120px;
  background: $color-white;
  border-radius: 20px;
  padding: 0 30px 0 8px;
  cursor: pointer;

  .l0k-swap-select-token--button-logo {
    margin-right: 8px;
  }

  .text {
    @include no-wrap;
  }

  .arrow {
    position: absolute;
    right: 13px;
    top: 50%;
    transform: translateY(-50%);
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