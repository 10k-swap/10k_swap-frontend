import { createI18n } from 'vue-i18n'
import enUS from './locales/en-US'

const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  messages: {
    'en-US': enUS,
  },
})

export default i18n
