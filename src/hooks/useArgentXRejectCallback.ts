import { onBeforeUnmount, onMounted } from 'vue'

export default function useArgentXRejectCallback(callback: () => void) {
  const event = (res: MessageEvent<any>) => {
    if (res.data.type === 'REJECT_ACTION') {
      return
    }
    callback && callback()
  }

  onMounted(() => {
    window.addEventListener('message', event)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('message', event)
  })
}
