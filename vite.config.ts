import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import eslintPlugin from 'vite-plugin-eslint'
import ElementPlus from 'unplugin-element-plus/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    target: 'esnext', // you can also use 'es2020' here
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext', // you can also use 'es2020' here
    },
  },
  define: {
    global: {},
  },
  server: {
    port: 3035,
    host: true,
    proxy: {
      '/api/wallet/get_latest_version': {
        target: 'https://api.10kx.com',
        changeOrigin: true,
        secure: false,
      },
    },
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
