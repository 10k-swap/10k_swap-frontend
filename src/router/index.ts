import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const SwapWrap = () => import('../pages/Swap/index.vue')
const Swap = () => import('../pages/Swap/Swap/index.vue')
const Pool = () => import('../pages/Swap/Pool/index.vue')
const Faucet = () => import('../pages/Swap/Faucet/index.vue')
const Analytics = () => import('../pages/Swap/Analytics/index.vue')
const Rewards = () => import('../pages/Swap/Rewards/index.vue')

const Wallet = () => import('../pages/Wallet/index.vue')

const swaps = [
  { path: '/swap', name: 'Swap', component: Swap },
  { path: '/pool', name: 'Pool', component: Pool },
  { path: '/faucet', name: 'Faucet', component: Faucet },
  { path: '/analytics', name: 'Analytics', component: Analytics },
  { path: '/rewards', name: 'Rewards', component: Rewards },
]

const routes: Array<RouteRecordRaw> = [
  // swap
  {
    path: '/',
    component: SwapWrap,
    children: swaps,
    redirect() {
      return '/swap'
    },
  },
  // wallet
  { path: '/wallet', name: 'Wallet', component: Wallet },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
