import { useScrollTopState } from '@/stores/scrollTop'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/codex/:category/:id/',
      name: 'codex',
      component: () => import('@/views/CodexView.vue'),
      meta: {
        keepAlive: false
      }
    }
  ],
  scrollBehavior(to, from) {
    const scrollTopState = useScrollTopState()
    if (to.name === 'home') {
      if (from.name === 'home') {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'auto'
        })
      } else {
        window.scrollTo({
          top: scrollTopState.home,
          left: 0,
          behavior: 'auto'
        })
      }
    }
    if (to.name === 'codex') {
      if (from.name === 'codex') {
        const top = scrollTopState.getCodexTop(to.params.category as string, to.params.id as string)
        window.scrollTo({
          top: top,
          left: 0,
          behavior: 'auto'
        })
        return { top: top, left: 0 }
      } else {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'auto'
        })
        return { top: 0, left: 0 }
      }
    }
  }
})

router.afterEach((to, from) => {
  const scrollTopState = useScrollTopState()
  if (from.name === 'home') {
    scrollTopState.home = window.scrollY
  }
  if (to.name === 'codex') {
    if (from.name === 'codex') {
      scrollTopState.setCodexTop(
        from.params.category as string,
        from.params.id as string,
        window.scrollY
      )
    }
  }
})

export default router
