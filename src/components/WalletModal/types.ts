export type WalletProvider = {
  id: string
  name: string
  icon: string
  downloads: {
    [K in 'chrome' | 'firefox' | 'edge']?: string
  }
}
