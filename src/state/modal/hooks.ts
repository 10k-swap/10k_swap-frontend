import { useModalStore } from '.'

export function useOpenWalletModal() {
  const store = useModalStore()

  return () => store.toggleWalletModal(true)
}
