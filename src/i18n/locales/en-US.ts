export default {
  main_network: 'Main',
  goerli_test_network: 'Goerli',
  account_modal: {
    account: 'Account',
    tips: 'Connected with %{wallet}',
    disconnect: 'Disconnect',
    copy: 'Copy Address',
    copy_success: 'Copy Success',
  },
  connector_not_found_modal: {
    title: 'No Wallet Detected',
    tips: 'Please download <span style="color:#111;">Argent X</span> to use this dapp,which runs on StarkNet,a ZK Rollup network on Ethereum Layer 2.',
  },
  connect_reject_modal: {
    title: 'Error Connectir',
    tips: 'The connection attempt failed.Please click try again and follow the steps to connect in your wallet.',
    retry: 'Try Again',
  },
  connecting_modal: {
    connecting: 'Connecting...',
    tips: 'By connecting a wallet，you agree to <span style="color:#3bc6a5;">10K Swap Labs’ Terms of sevice</span> and acknowledge that you have read and understand the <span style="color:#3bc6a5;">10K Swap Protocl Disclaimer.</span>',
  },
  slippage_tolerance_settings_modal: {
    title: 'Transaction Settings',
    slippage_tolerance: 'Slippage tolerance',
    slippage_tolerance_desc: 'Your transaction will revert if the price changes unfavorably by more than this percentage.',
    auto: 'Auto',
    confirm: 'Confirm',
  },
  recent_transactions: {
    title: 'Recent Transactions',
    clear: 'Clear All',
    tips: 'your transaction will appear here...',
  },
  currency_input_panel: {
    balance: 'balance: %{balance}',
  },
  header: {
    nav: {
      swap: 'Swap',
      pool: 'Pool',
      faucet: 'Faucet',
    },
    connector: {
      connect: 'Connect Wallet',
    },
  },
  swap: {
    title: 'Swap',
    connect: 'Connect Wallet',
    insufficient_liquidity: "Insufficient liquidity for this trade."
  },
}
