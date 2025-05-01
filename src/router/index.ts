import { createRouter, createWebHashHistory } from 'vue-router'

const scrollPositions: {
  home: number
  entry: Record<string, number>
} = {
  home: 0,
  entry: {},
}

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        default: () => import('@/views/HomeView.vue'),
      },
    },
    {
      path: '/codex',
      redirect: '/',
    },
    {
      path: '/codex/:category/:id/',
      name: 'entry',
      component: () => import('@/views/EntryView.vue'),
      props: true,
    },
    {
      path: '/assess',
      name: 'assess',
      component: () => import('@/views/AssessView.vue'),
    },
    {
      path: '/proof',
      name: 'proof',
      component: () => import('@/views/ProofView.vue'),
    },
    {
      path: '/tower',
      name: 'tower',
      component: () => import('@/views/TowerView.vue'),
    },
    {
      path: '/compare',
      name: 'compare',
      component: () => import('@/views/CompareView.vue'),
    },
  ],
  scrollBehavior(to, from) {
    if (to.name === 'home') {
      return {
        top: from.name === 'home' ? 0 : scrollPositions.home,
        behavior: 'auto',
      }
    }
    if (to.name === 'entry') {
      return {
        top: scrollPositions.entry[to.path] ?? 0,
        behavior: 'auto',
      }
    }
  },
})

router.afterEach((to, from) => {
  if (from.name === 'home') {
    scrollPositions.home = window.scrollY
  }
  if (from.name === 'entry') {
    scrollPositions.entry[from.path] = window.scrollY
  }
})

export default router
