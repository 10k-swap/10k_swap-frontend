<template>
  <div class="card">
    <button type="button">count is</button>
    <Text color="red">
      123
    </Text>
    <Button type="primary">
      1214
    </Button>
    <Button type="primary" size="large">
      1214
    </Button>
    <Button plain>
      1214
    </Button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <AddIcon :style="{ width: '30px' }" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import Text from '../../components/Text/Text.vue'
import Button from '../../components/Button/Button'
import { AddIcon } from '../../components/Svg/index'

export default defineComponent({
  components: {
    Text,
    Button,
    AddIcon
  },
  setup() {
    const { t } = useI18n()
    const { state: { library } } = useStarknet()

    onMounted(() => {
      console.log(toRaw(library.value))
    })

    return {
      t,
    }
  },
})
</script>

<style lang="scss" scoped>
.card {
  .read-the-docs {
    color: #888;
  }
}
</style>
