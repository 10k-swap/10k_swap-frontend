<template>
  <div class="l0k-swap-currency-input-panel">
    <div class="inputs">
      <input type="number" v-model="typedValue" placeholder="0.0">
      <TokenSelect class="token-select" :token="token ?? null" @select="onSelect" />
    </div>
    <div class="balance">
      <Text :color="'description-text'" :size="'mini'">
        {{ t('currency_input_panel.balance', {
            balance: selectedCurrencyBalance ===
              null ? 'loading...' : selectedCurrencyBalance?.toSignificant() ?? '-'
          })
        }}
      </Text>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { Token, TokenAmount } from '../../sdk'
import TokenSelect from '../TokenSelect/TokenSelect.vue'
import Text from '../Text/Text.vue'

export default defineComponent({
  props: {
    token: { type: Object as PropType<Token | undefined | null>, },
    value: {
      type: [String, Number]
    },
    selectedCurrencyBalance: { type: Object as PropType<TokenAmount | undefined | null>, },
  },
  components: {
    TokenSelect,
    Text
  },
  emits: ['token-select', 'input'],
  setup(props, context) {
    const { value, selectedCurrencyBalance } = toRefs(props)

    const { t } = useI18n()

    const typedValue = computed({
      get: () => value.value,
      set(newValue) {
        context.emit('input', newValue)
      }
    })

    const onSelect = (token: Token) => {
      context.emit('token-select', token)
    }

    return {
      t,
      onSelect,

      typedValue,
      selectedCurrencyBalance
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

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }

    input[type="number"] {
      -moz-appearance: textfield;
    }

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
  }

  .balance {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
  }
}
</style>