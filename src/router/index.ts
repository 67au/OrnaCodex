import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        default: () => import('@/views/HomeView.vue'),
      },
      meta: {
        title: 'title',
        keepAlive: true,
        layout: DefaultLayout,
      },
    },
    {
      path: '/codex/:category/:id/',
      name: 'entry',
      component: () => import('@/views/EntryView.vue'),
      props: true,
      meta: {
        title: 'title',
        keepAlive: false,
        layout: DefaultLayout,
      },
    },
    {
      path: '/proof',
      name: 'proof',
      component: () => import('@/views/ProofView.vue'),
      props: true,
      meta: {
        title: 'proof.title',
        keepAlive: false,
        layout: DefaultLayout,
      },
    },
    {
      path: '/assess',
      name: 'assess',
      component: () => import('@/views/AssessView.vue'),
      props: true,
      meta: {
        title: 'assess.title',
        keepAlive: false,
        layout: DefaultLayout,
      },
    },
    {
      path: '/compare',
      name: 'compare',
      component: () => import('@/views/CompareView.vue'),
      props: true,
      meta: {
        title: 'compare.title',
        keepAlive: false,
        layout: DefaultLayout,
      },
    },
    {
      path: '/tower',
      name: 'tower',
      components: {
        default: () => import('@/views/TowerView.vue'),
      },
      meta: {
        title: 'tower.title',
        keepAlive: false,
        layout: DefaultLayout,
      },
    },
    {
      path: '/enemy',
      name: 'enemy',
      components: {
        default: () => import('@/views/EnemyView.vue'),
      },
      meta: {
        title: 'enemy.title',
        keepAlive: false,
        layout: DefaultLayout,
      },
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
        top: scrollPositions.entry.get(to.path) ?? 0,
        behavior: 'auto',
      }
    }
  },
})

const scrollPositions: {
  home: number
  entry: Map<string, number>
} = {
  home: 0,
  entry: new Map(),
}

router.afterEach((to, from) => {
  if (from.name === 'home') {
    scrollPositions.home = window.scrollY
  }
  if (from.name === 'entry') {
    scrollPositions.entry.set(from.path, window.scrollY)
  }
})

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    keepAlive?: boolean
    layout: unknown
  }
}

export default router
