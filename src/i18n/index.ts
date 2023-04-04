import { createI18n } from 'vue-i18n'
import enUS from './locales/en-US'
import zhCN from './locales/zh-CN'
import frFR from './locales/fr-FR'
import jaJP from './locales/ja-JP'
import koKR from './locales/ko-KR'

const i18n = createI18n({
  legacy: false,
  locale: 'ko-KR',
  messages: {
    'en-US': enUS,
    'zh-CN': zhCN,
    'fr-FR': frFR,
    'ja-JP': jaJP,
    'ko-KR': koKR,
  },
})

export default i18n
