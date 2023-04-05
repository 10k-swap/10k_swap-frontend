import { createI18n } from 'vue-i18n'
import enUS from './locales/en-US'
import zhCN from './locales/zh-CN'
import zhTW from './locales/zh-TW'
import frFR from './locales/fr-FR'
import jaJP from './locales/ja-JP'
import koKR from './locales/ko-KR'
import heIL from './locales/he-IL'

const i18n = createI18n({
  legacy: false,
  locale: 'he-IL',
  messages: {
    'en-US': enUS,
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'fr-FR': frFR,
    'ja-JP': jaJP,
    'ko-KR': koKR,
    'he-IL': heIL,
  },
})

export default i18n
