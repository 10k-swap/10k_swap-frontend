import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const Swap = () => import('../pages/Swap/index.vue')
const Pool = () => import('../pages/Pool/index.vue')
const Faucet = () => import('../pages/Faucet/index.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Swap',
    component: Swap,
  },
  {
    path: '/pool',
    name: 'Pool',
    component: Pool,
  },
  {
    path: '/faucet',
    name: 'Faucet',
    component: Faucet,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
