import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import eslintPlugin from 'vite-plugin-eslint'
import ElementPlus from 'unplugin-element-plus/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    target: 'es2015',
  },
  server: {
    port: 3035,
    host: true,
  },
  plugins: [
    vue(),
    vueJsx(),
    ElementPlus(),
    eslintPlugin({
      include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue', 'src/*.ts', 'src/*.tsx', 'src/*.vue'],
    }),
  ],
})
