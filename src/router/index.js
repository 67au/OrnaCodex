import { store } from '@/store';
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
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    const t = document.getElementById('main');
    if (to.name === 'home') {
      if (from.name === 'home') {
        t.scrollTo({
          top: 0,
          left: 0,
          behavior: "auto",
        });
      } else {
        t.scrollTo({
          top: store.homeTop,
          left: 0,
          behavior: "auto",
        });
      }
    }
    if (to.name === 'codex') {
      if (from.name === 'codex') {
        const top = store.codexTop[`${to.params.category}/${to.params.id}`] || 0;
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
  if (from.name === 'home') {
    const t = document.getElementById('main');
    store.homeTop = t.scrollTop;
  }
  if (to.name === 'codex') {
    store.guide.cache = undefined;
    if (from.name === 'codex') {
      const t = document.getElementById('main');
      store.codexTop[`${from.params.category}/${from.params.id}`] = t.scrollTop;
    }
  }
})

export default router
