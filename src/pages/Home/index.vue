<template>
  <div class="card">
    <button type="button">count is</button>
    <Text color="red">
      123
    </Text>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
      {{ t('test') }}
      {{ test }}
    </p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStarknet } from '../../starknet-vue/providers/starknet'
import { useStore } from '../../state/index'
import Text from '../../components/Text/index.vue'

export default defineComponent({
  components: {
    Text
  },
  setup() {
    const { t } = useI18n()
    const { state: { library } } = useStarknet()
    const store = useStore()

    onMounted(() => {
      console.log(toRaw(library.value))
    })

    return {
      t,
      test: computed(() => store.test)
    }
  },
})
</script>

<style lang="scss" scoped>
.card {
  background-color: aqua;

  .read-the-docs {
    color: #888;
  }
}
</style>
