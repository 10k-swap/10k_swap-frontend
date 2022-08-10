import { onMounted, ref, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { MOBILE_SIZE } from '../constants'

export default function useIsMobile() {
  const isMobile = ref(false)

  const { width } = useWindowSize()

  const setIsMobile = () => {
    isMobile.value = width.value < MOBILE_SIZE ? true : false
  }

  watch(width, setIsMobile)
  onMounted(setIsMobile)

  return isMobile
}
