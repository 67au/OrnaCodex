export default {
  version: import.meta.env.VITE_APP_VERSION,
  apiUrl: import.meta.env.VITE_API_URL,
  extraApiUrl: import.meta.env.VITE_EXTRA_API_URL,

  ornaUrl: import.meta.env.VITE_ORNA_URL,
  ornaStaticUrl: import.meta.env.VITE_ORNA_STATIC_URL,

  primarySort: {
    default: {
      key: 'default',
      asc: undefined,
    },
    nameAsc: {
      key: 'name',
      asc: true,
    },
    nameDesc: {
      key: 'name',
      asc: false,
    },
    tierAsc: {
      key: 'tier',
      asc: true,
    },
    tierDesc: {
      key: 'tier',
      asc: false,
    } as const,
  },

  statusColor: {
    immunities: 'blue',
    gives: 'orange',
    cures: 'green',
    causes: 'red',
    summons: 'secondary',
  } as const,
}
