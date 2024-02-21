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
    if (to['name'] === 'home') {
      t.scrollTo({
        top: store.homeTop,
        left: 0,
        behavior: "auto",
      });
    }
    if (to['name'] === 'codex') {
      t.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      });
      return { el: t, top: 0, left: 0 }
    }
  }
});

router.afterEach((to, from) => {
  if (from['name'] === 'home') {
    const t = document.getElementById('main');
    store.homeTop = t.scrollTop;
  }
})

export default router
