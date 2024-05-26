const elementColor: Record<string, string> = {
  water: '#5facff',
  earthen: '#0fab0f',
  lightning: '#a59e46',
  fire: '#ff8135',
  dark: '#d900ff',
  holy: '#ddd',
  arcane: '#8e78ff',
  dragon: '#FF9800'
}

const qualityColor: Record<string, string> = {
  broken: '#985f17',
  poor: '#985f17',
  regular: '',
  superior: '#49e840',
  famed: '#4ca3ff',
  legendary: '#aa4eef',
  ornate: '#e44646',
  masterforged: '#ffe16f',
  demonforged: '#ff6f8f',
  godforged: '#ff9860'
}

const rarityAura: Record<string, string> = {
  uncommon: 'rare',
  rare: 'famed',
  storied: 'legendary',
  cryptid: 'masterforged',
  steward: 'demonforged'
}

const guideUrl = 'https://orna.guide'

export const global = {
  ornaUrl: __ORNA_URL__,
  staticUrl: __ORNA_STATIC_URL__,
  filtersVersion: __FILTERS_VERSION__,
  dataCreated: new Date(Number(__DATA_CREATED__) * 1000),
  guideUrl: guideUrl,
  guideApiUrl: `${guideUrl}/api/v1`,
  star: '★',
  elementColor: elementColor,
  qualityColor: qualityColor,
  rarityAura: rarityAura
}
