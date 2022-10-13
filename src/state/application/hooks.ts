import { computed } from 'vue'
import { useApplicationStore } from '.'

export function useActivePopup() {
  const store = useApplicationStore()

  return computed(() => store.popupList.filter((item) => item.show))
}

export function useAddPopup() {
  const store = useApplicationStore()

  return store.addPopup
}

export function useRemovePopup() {
  const store = useApplicationStore()

  return store.removePopup
}
