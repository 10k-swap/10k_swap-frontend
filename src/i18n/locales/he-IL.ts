export default {
  main_network: 'רשת ראשית',
  goerli_test_network: 'גורלי',
  loading: 'טוען...',
  connect: 'חבר כרטיס אשראי',
  comingSoon: 'בקרוב',
  wrong_network_tips: `אנא 
  <span style="color:rgba(204, 16, 16, 1);">החלף</span> את הרשת ל- <span style="color:rgba(204, 16, 16, 1);">StarkNet %{network}! ורעננו את הדף. </span>`,
  warning: `זהו גרסת ALPHA, ניתן לבקש עזרה ב <a  href="https://discord.gg/T77yphUPB6" target="_blank">Discord</a> אם יש לך שאלות, ופעל לעקוב אחרינו ב <a  href="https://twitter.com/10KSwap" target="_blank">טוויטר </a> כדי לקבל עדכונים נוספים.`,
  pending: '%{n} ממתין לאישור',
  view_on_scan: 'צפה ב-STARKSCAN',
  wallet_modal: {
    title: 'חבר כרטיס אשראי',
    tips: 'על ידי התחברות כרטיס אשראי, אתה מסכים לתנאי השירות של ‏‏Labs Swap ‏‏10K  ומכיר את הבכוריות של ‏‏‏‏‎10K Swap Protocol.‎‏',
    install: 'התקן %{wallet}',
  },
  account_modal: {
    account: 'חשבון',
    tips: 'מחובר עם  %{wallet}',
    disconnect: 'התנתק',
    copy: 'העתק כתובת',
    copy_success: 'העתקה הצליחה',
  },
  connector_not_found_modal: {
    title: 'לא זוהה כרטיס אשראי',
    tips: 'אנא הורד את <span style="color:#111;">Argent X</span> בכדי להשתמש במבצע זה, שנמצא ב-StarkNet, דרך רשת ZK Rollup על שכבת Ethereum 2',
  },
  connect_reject_modal: {
    title: 'שגיאת התחברות',
    tips: 'נסיון התחברות נכשל. אנא לחץ על נסה שוב ועקוב אחר השלבים על מנת להתחבר דרך הכרטיס אשראי שלך.',
    retry: 'נסה שוב',
  },
  connecting_modal: {
    connecting: 'מתחבר...',
    tips: 'על ידי התחברות כרטיס אשראי, אתה מסכים לתנאי השירות של <span style="color:#3bc6a5;">Labs Swap ‏‏10K</span> ומכיר את   הבכוריות של <span style="color:#3bc6a5;">‏‏‎10K Swap Protocol.‎‏</span>',
  },
  slippage_tolerance_settings_modal: {
    title: 'הגדרות עסקת תשלום',
    slippage_tolerance: 'שבירת שטח',
    slippage_tolerance_desc: 'המחיר של העסקה יתהפך אם ישנעות חשובה במחיר לאורך הזמן.',
    auto: 'אוטומטי',
    confirm: 'אשר',
  },
  recent_transactions: {
    title: 'עסקאות ישנות',
    clear: 'נקה הכל',
    tips: 'בקרוב נוכל לראות כאן את העסקאות שלנו...',
  },
  currency_input_panel: {
    balance: 'מאזן: %{balance}',
    max: 'מקס',
  },
  header: {
    nav: {
      swap: 'החלפה',
      pool: 'בריכה',
      faucet: 'מזלפת',
      analytics: 'ניתוחים',
    },
    connector: {
      connect: 'חבר כרטיס אשראי',
    },
  },
  swap: {
    title: 'החלפה',
    connect: 'חבר כרטיס אשראי',
    insufficient_liquidity: 'אין מספיק נוזליות לעסקה זאת.',
    fetching: 'מקבל מחיר טוב ביותר',
    expected_output: 'הפלט המצופה',
    expected_input: 'הקלט המצופה',
    price_impact: 'השפעת מחיר',
    minimum_received: 'מינימום שקיבלת אחרי שבירת מקום (%{slippage}%)',
    maximum_received: 'מכירה מקסימאלית אחרי שבירת מקום (%{slippage}%)',
    confirm_swap: 'אשר החלפה',
    swap: 'החלפה',
    confirm: 'אשר',
  },
  transaction: {
    waitting_modal_label: 'ממתין לאישור...',
    tips: 'אמת את העסקה זו בכרטיס האשראי שלך',
    transaction_rejected: 'עסקה נדחתה',
    dismiss: 'סגור',
    transaction_submitted: 'העסקה נשלחה',
    close: 'סגור',
  },
  token_select: {
    label: 'בחר',
  },
  faucet: {
    title: 'כרנוף',
    connectTips1: 'אנו נספק מטבעות בדיקה ללא תשלום,',
    connectTips2: 'אנא התחברו לארנק למידע נוסף.',
    tips: 'הפוך לכנות לקבלת 500 TKA, 500 TKB ו-0.01 Goerli ETH במשך 30 דקות.',
    retweet: 'הפוך לכנות',
  },
  pool: {
    title: 'סקירת מחסנים',
    my_pools: 'המחסנים שלי',
    pools: 'מחסנים',
    new_position: '+ עמדה חדשה',
    name: 'שם',
    APR: 'APR',
    liquidity: 'נוזליות',
    pool_share: 'המחסן שלי',
    get: 'הוסף נוזליות',
    tips: 'התחברו לארנק כדי לבדוק את המחסנים שלכם',
    tips2: 'המצב של הנוזליות שלכם יופיע כאן',
    deposit: 'הפקד',
    add: 'הוסף',
    manage: 'נהל',
    total_pool_tokens: 'סך כל טוקנים של המחסן:',
    pooled: '%{symbol} שהופקדו:',
    your_pool_share: 'המחסן החלקי שלכם:',
    add_liquidity: '+הוסף',
    withdraw: '-משיכה',
  },
  pool_modal: {
    add_liquidity: 'הוספת נוזליות',
    withdraw: 'משיכה',
  },
  add_liquidity: {
    liquidity: 'סכום הנוזליות: %{value}',
    no_liquidity: 'אין נוזליות',
    share_of_pool: 'חלק המחסן',
    no_liquidity_tips: 'מחירי התחלה וחלק המחסן',
    deposit: 'הפקדה',
    desc: 'ספקי הנוזליות מרוויחים עמלה של 0.25% בכל העסקות במימוש יחסי לחלקם במחסן. העמלות נוספות למחסן, זמינות בזמן אמת וניתן לטעון אותם על ידי משיכת נוזליות.',
    confirm_title: 'תקבלו',
    pool_token: '%{tokens} טוקנים של המחסן',
    confirm_tips: 'פלט משוער. אם המחיר משתנה ביותר מ- %{slippage}% העסקה שלכם תתבטל',
    deposited: '%{token} הופקד',
    rates: 'שערי מטבע',
    confirm: 'אישור שזירה',
  },
  remove_liquidity: {
    tips: 'טיפ: מחיקת טוקני המחסן ממירה את העמדה שלכם בחזרה למטבעות בסיטונאיות הנוכחיות, עם יחסים לחלקכם במחסן. העמלות שצברתם כלולות בסכוי המטבעות שתקבלו.',
    approve: 'אישור',
    price: 'מחיר',
    your_position: 'העמדה שלך',
    pool_share: 'המחסן שלך',
    confirm_title: 'תקבלו',
    confirm_tips: 'פלט משוער. אם המחיר משתנה ביותר מ- %{slippage}% העסקה שלכם תתבטל',
    burned: '%{token} שרף',
    confirm: 'אישור',
    remove_amount: 'הסר הכמות',
    simple: 'פשוט',
    detailed: 'מפורט',
  },
  analytics: {
    liquidity: 'נוזליות',
    volume: 'מחזור',
    pairs: 'זוגות',
    name: 'שם',
    volume_24h: 'מחזור(24 שעות)',
    volume_7d: 'מחזור(7 ימים)',
    fees_24h: 'עמלות(24 שעות)',
    total_fees: 'סך כל העמלות',
    transactions: 'עסקות',
    total_transactions: 'סך כל העסקות',
    profit: 'רווח',
    all: 'הכל',
    swaps: 'החלפות',
    adds: 'הוספות',
    removes: 'מחיקות',
    token0: 'מטבע אפס',
    token1: 'מטבע אחד',
    account: 'חשבון',
    fees: 'עמלות',
    time: 'זמן',
  },
}
