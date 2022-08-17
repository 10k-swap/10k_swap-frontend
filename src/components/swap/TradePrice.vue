<template>
  <div class="trade-price" v-show="show" @click="setShowInverted">
    <Text :color="'description-text'" :size="'mini'">
      {{ label }}
    </Text>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
import { Price } from '../../sdk'
import Text from '../Text/Text.vue'

export default defineComponent({
  props: {
    price: {
      type: Object as PropType<Price>,
    }
  },
  components: { Text },
  setup(props) {
    const { price } = toRefs(props)
    const showInverted = ref(false)
    const show = computed(() => Boolean(price.value?.baseCurrency && price.value?.quoteCurrency))
    const label = computed(() => {
      return showInverted.value
        ? `1 ${price.value?.quoteCurrency?.symbol} = ${price.value?.invert()?.toSignificant(6)} ${price.value?.baseCurrency?.symbol}`
        : `1 ${price.value?.baseCurrency?.symbol} = ${price.value?.toSignificant(6)} ${price.value?.quoteCurrency?.symbol}`
    })

    const setShowInverted = () => {
      showInverted.value = !showInverted.value
    }

    return {
      label,
      show,

      setShowInverted
    };
  }
})
</script>

<style lang="scss">
.trade-price {
  cursor: pointer;
}
</style>