import { useStorage } from '@vueuse/core'
import { reactive, computed } from 'vue'

import router from '@/router'

const ornaUrl = 'https://playorna.com';
const guideUrl = 'https://orna.guide';
const languageBased = 'en';

const elementColor = {
  Water: '#5facff',
  Earthen: '#0fab0f',
  Lightning: '#a59e46',
  Fire: "#ff8135",
  Dark: "#d900ff",
  Holy: "#ddd",
  Arcane: "#8e78ff",
  Dragon: "#FF9800",
}

export const global = {
  ornaUrl: ornaUrl,
  staticUrl: `${ornaUrl}/static`,
  guideUrl: guideUrl,
  guideApiUrl: `${guideUrl}/api/v1`,
  star: '★',
  languageBased: languageBased,
  elementColor: elementColor,
}

export const store = reactive({
  lang: null,
  homeTop: 0,
  state: useStorage('vueuse', {
    language: null,
    theme: null,
  }),
  codexPage: {
    category: undefined,
    id: undefined,
  },
  codex: {
    data: undefined,
    materials: computed(() => new Set(Object.keys(store.codex.data['upgrade_materials']))),
    spells: computed(() => new Set(Object.keys(store.codex.data['skills']))),
    isMaterial: () => store.codex.materials.has(store.codexPage.id),
    isSkill: () => store.codex.spells.has(store.codexPage.id),
    based: computed(() => store.codex.data['codex'][languageBased]),
    basedItem: computed(() => store.codex.based[store.codexPage.category][store.codexPage.id]),
    used: computed(() => store.codex.data['codex'][store.lang]),
    usedItem: computed(() => store.codex.used[store.codexPage.category][store.codexPage.id]),
    url: computed(() => `/codex/${store.codexPage.category}/${store.codexPage.id}/`),
  },
  guide: {
    cache: undefined,
  },
  enterCodex(category, id) {
    router.push({
      path: `/codex/${category}/${id}/`
    });
  },
})