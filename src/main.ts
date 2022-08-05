import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

import './styles/global.scss'

createApp(App).use(router).use(i18n).use(createPinia()).mount('#app')
