import { onMounted, onUnmounted, Ref, ref } from 'vue'

function isVisibilityStateSupported() {
  return 'visibilityState' in document
}

function isWindowVisible() {
  return !isVisibilityStateSupported() || document.visibilityState !== 'hidden'
}

/**
 * Returns whether the window is currently visible to the user.
 */
export default function useIsWindowVisible(): Ref<boolean> {
  const focused = ref<boolean>(true)

  const listener = () => {
    focused.value = isWindowVisible()
  }

  onMounted(() => {
    if (!isVisibilityStateSupported()) return
    document.addEventListener('visibilitychange', listener)
  })

  onUnmounted(() => {
    document.removeEventListener('visibilitychange', listener)
  })

  return focused
}
