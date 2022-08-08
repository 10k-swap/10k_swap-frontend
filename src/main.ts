import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueFinalModal from 'vue-final-modal'

import App from './App.vue'
import router from './router'
import i18n from './i18n'

import './styles/global.scss'

createApp(App).use(router).use(i18n).use(createPinia()).use(VueFinalModal).mount('#app')
