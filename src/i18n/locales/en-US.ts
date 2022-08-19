export default {
  main_network: 'Main',
  goerli_test_network: 'Goerli',
  loading: 'loading...',
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
    insufficient_liquidity: 'Insufficient liquidity for this trade.',
    fetching: 'Fetching best price',
    expected_output: 'Expected Output',
    expected_input: 'Expected Input',
    price_impact: 'Price Impact',
    minimun_received: 'Minimun received after slippage (%{slippage}%)',
    maximum_received: 'Maximum sold after slippage (%{slippage}%)',
    confirm_swap: 'Confirm Swap',
    swap: 'Swap',
    confirm: 'Confirm',
  },
  transaction: {
    waitting_modal_label: 'Waiting For Confirmation...',
    tips: 'Confirm this transaction in your wallet',
    transaction_rejected: 'Transaction Rejected',
    dismiss: 'Dismiss',
    transaction_submitted: 'Transaction Submitted',
    close: 'Close',
    view_on_scan: 'View on Voyage',
  },
  token_select: {
    label: 'Select',
  },
  pool: {
    title: 'Pools Overview',
    my_pools: 'My pools',
    new_position: '+ New position',
  },
  poolModal: {
    addLiqiudit: 'Add liqiudit',
    withdraw: 'Withdraw',
  },
  add_liqiudit: {
    liqiudity: 'Liqiudity: %{value}',
    no_liqiudity: 'No Liqiudity',
    share_of_pool: 'Share of Pool',
    no_liqiudity_tips: 'Initial prices and pool share',
  },
}
