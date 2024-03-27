import { useScrollTopState } from '@/store';
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        keepAlive: true
      },
    },
    {
      path: '/codex/:category/:id/',
      name: 'codex',
      component: () => import('@/views/CodexView.vue'),
      meta: {
        keepAlive: false,
      },
    },
  ],
  scrollBehavior(to, from) {
    const scrollTopState = useScrollTopState();
    const t = document.getElementById('main');
    if (t === null) {
      return
    }
    if (to.name === 'home') {
      if (from.name === 'home') {
        t.scrollTo({
          top: 0,
          left: 0,
          behavior: "auto",
        });
      } else {
        t.scrollTo({
          top: scrollTopState.home,
          left: 0,
          behavior: "auto",
        });
      }
    }
    if (to.name === 'codex') {
      if (from.name === 'codex') {
        const top = scrollTopState.getCodexTop(to.params.category as string, to.params.id as string);
        t.scrollTo({
          top: top,
          left: 0,
          behavior: 'auto',
        });
        return { el: t, top: top, left: 0 }
      } else {
        t.scrollTo({
          top: 0,
          left: 0,
          behavior: 'auto',
        });
        return { el: t, top: 0, left: 0 }
      }
    }
  }
});

router.afterEach((to, from) => {
  const scrollTopState = useScrollTopState();
  if (from.name === 'home') {
    const t = document.getElementById('main');
    if (t === null) {
      return
    }
    scrollTopState.home = t.scrollTop;
  }
  if (to.name === 'codex') {
    if (from.name === 'codex') {
      const t = document.getElementById('main');
      if (t === null) {
        return
      }
      scrollTopState.setCodexTop(from.params.category as string, from.params.id as string, t.scrollTop);
    }
  }
})

export default router
