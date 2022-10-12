<template>
  <div class="l0k-swap-currency-input-panel" :class="classes">
    <div class="inputs">
      <input type="text" :value="typedValue" @input="onInput" placeholder="0.0" pattern="^[0-9]*[.,]?[0-9]*$" />
      <TokenSelector v-if="selector" class="token-select" :token="token ?? null" :otherToken="otherToken ?? null" @select="onSelect" />
      <div class="token" v-else>
        <template v-if="slots.token">
          <slot name="token"></slot>
        </template>
        <template v-else>
          <TokenLogo :token="token" />
          <Text class="symbol" bold> {{ token?.symbol }} </Text>
        </template>
      </div>
    </div>
    <div class="balance">
      <Text :color="'description-text'" :size="'mini'">
        {{
          t('currency_input_panel.balance', {
            balance: currencyBalance === null ? 'loading...' : currencyBalance?.toSignificant() ?? '-',
          })
        }}
      </Text>
      <span class="max" @click="() => onMax && onMax(currencyBalance ?? undefined)" v-if="onMax && currencyBalance">
        {{ t('currency_input_panel.max') }}
      </span>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { Token, TokenAmount } from 'l0k_swap-sdk'
import TokenSelector from '../TokenSelector/TokenSelector.vue'
import TokenLogo from '../TokenLogo/TokenLogo'
import Text from '../Text/Text.vue'

export default defineComponent({
  props: {
    selectorDisabled: Boolean,
    token: { type: Object as PropType<Token | undefined | null> },
    otherToken: { type: Object as PropType<Token | undefined | null> },
    currencyBalance: { type: Object as PropType<TokenAmount | undefined | null> },
    value: {
      type: [String, Number],
    },
    selector: {
      default: true,
      type: Boolean,
    },
    size: {
      default: 'normal',
      type: String as PropType<'small' | 'normal'>,
    },
    onMax: {
      type: Function as PropType<(amount: TokenAmount | undefined) => void>,
    },
  },
  components: {
    TokenSelector,
    TokenLogo,
    Text,
  },
  emits: ['token-select', 'input'],
  setup(props, context) {
    const { value, currencyBalance, size } = toRefs(props)

    const { t } = useI18n()

    const typedValue = computed({
      get: () => value.value,
      set(newValue) {
        context.emit('input', newValue)
      },
    })

    const onInput = (e: InputEvent) => {
      const nextUserInput = (e.target as HTMLInputElement).value.replace(/,/g, '.') ?? ''

      if (!new RegExp(/^[0-9]*[.,]?[0-9]*$/).test(nextUserInput) && nextUserInput !== '') {
        ;(e.target as HTMLInputElement).value = ''
        typedValue.value = ''
        return
      }

      typedValue.value = nextUserInput
    }

    const onSelect = (token: Token) => {
      context.emit('token-select', token)
    }

    return {
      t,
      onSelect,
      onInput,

      slots: context.slots,
      typedValue,
      classes: computed(() => ({
        'l0k-swap-currency-input-panel-small': size.value === 'small',
      })),
      currencyBalance,
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/index.scss';

.l0k-swap-currency-input-panel {
  border-radius: 20px;
  background: $color-bg-secondary;
  padding: 16px 16px 10px 16px;

  .inputs {
    display: flex;
    justify-content: space-between;

    input {
      width: 50%;
      background: transparent;
      border: 0;
      font-weight: 700;
      font-size: 28px;
      margin-right: 10px;
      outline: none;

      &::placeholder {
        color: rgba($color: $color-transparent-text, $alpha: 1);
      }

      &:hover {
        border: 0;
      }
    }

    .token-select {
      width: 120px;
    }

    .token {
      display: flex;
      align-items: center;

      .symbol {
        margin-left: 8px;
      }
    }
  }

  .balance {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 8px;
    .max {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 35px;
      height: 18px;
      margin-left: 8px;
      border-radius: 9px;
      background: $color-primary;
      font-size: $font-size-mini;
      color: $color-white;
      cursor: pointer;
    }
  }

  &-small {
    padding: 8px 10px;

    .inputs {
      input {
        width: 40%;
      }
    }

    .balance {
      margin-top: 4px;
    }
  }
}
</style>
