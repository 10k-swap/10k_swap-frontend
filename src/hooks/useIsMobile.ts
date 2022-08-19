import { onMounted, ref, watch } from 'vue'
import { useThrottle, useWindowSize } from '@vueuse/core'
import { MOBILE_SIZE } from '../constants'

export default function useIsMobile() {
  const isMobile = ref(false)

  const { width } = useWindowSize()
  const throttledWidth = useThrottle(width, 300)

  const setIsMobile = () => {
    isMobile.value = width.value < MOBILE_SIZE ? true : false
  }

  watch(throttledWidth, setIsMobile)
  onMounted(setIsMobile)

  return isMobile
}
