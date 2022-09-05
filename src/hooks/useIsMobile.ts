import { onMounted, ref, watch } from 'vue'
import { useThrottle, useWindowSize } from '@vueuse/core'
import { MOBILE_SIZE } from '../constants'

export default function useIsMobile() {
  const isMobile = ref(false)

  const { width } = useWindowSize()
  const throttledWidth = useThrottle(width, 200)

  const setIsMobile = () => {
    if (width.value < MOBILE_SIZE === isMobile.value) {
      return
    }
    isMobile.value = width.value < MOBILE_SIZE ? true : false
  }

  watch(throttledWidth, setIsMobile)
  onMounted(setIsMobile)

  return isMobile
}
