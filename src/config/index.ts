import { mdiCloseCircleOutline, mdiMinus, mdiMinusCircle, mdiPlus, mdiPlusCircle } from '@mdi/js'

const baseStatKeys = [
  'attack',
  'magic',
  'defense',
  'resistance',
  'dexterity',
  'crit',
  'hp',
  'mana',
  'ward',
  'foresight',
  'orn_bonus',
  'exp_bonus',
  'luck_bonus',
  'gold_bonus',
  'follower_stats',
  'follower_act',
  'summon_stats',
  'view_distance',
  'adornment_slots',
  'two_handed',
]

export default {
  version: import.meta.env.VITE_APP_VERSION,
  apiUrl: import.meta.env.VITE_API_URL,
  extraApiUrl: import.meta.env.VITE_EXTRA_API_URL,
  extraDataPrefix: import.meta.env.VITE_EXTRA_DATA_PREFIX,

  ornaUrl: import.meta.env.VITE_ORNA_URL,
  ornaStaticUrl: import.meta.env.VITE_ORNA_STATIC_URL,

  primarySort: {
    default: {
      key: undefined,
      asc: undefined,
    },
    'name.asc': {
      key: 'name',
      asc: true,
    },
    'name.desc': {
      key: 'name',
      asc: false,
    },
    'tier.asc': {
      key: 'tier',
      asc: true,
    },
    'tier.desc': {
      key: 'tier',
      asc: false,
    } as const,
  },

  statusColor: {
    immunities: 'blue-lighten-2',
    gives: 'amber-lighten-2',
    cures: 'green-lighten-2',
    causes: 'red-lighten-2',
    summons: 'blue-grey-lighten-2',
  } as const,

  operators: {
    in_any: {
      icon: mdiPlus,
      color: 'secondary',
    },
    sub_any: {
      icon: mdiMinus,
      color: 'error',
    },
    in_all: {
      icon: mdiPlusCircle,
      color: 'secondary',
    },
    sub_all: {
      icon: mdiMinusCircle,
      color: 'error',
    },
    pass: {
      icon: mdiCloseCircleOutline,
      color: 'default',
    },
  } as const,

  baseStatKeys: baseStatKeys,

  baseStatMap: new Map(baseStatKeys.map((a, i) => ['stats.' + a, i])),

  followerStatKeys: [
    'debuff_rate',
    'spell_rate',
    'attack_rate',
    'buff_rate',
    'protect_chance',
    'heal_rate',
  ],

  spellStatKeys: ['costs', 'crit_chance'],

  metaKeys: [
    'category',
    'events',
    'family',
    'rarity',
    'tier',
    'exotic',
    'two_handed',
    'abilities',
    'useable_by',
    'item_type',
    'place',
    'immunities',
    'stats._follower_summon_spell',
    'gives',
    'stats._follower_summon_skill',
    'stats.element',
    'type',
    'tags',
    'causes',
    'cures',
    'stats._skill',
    'stats._spell',
    'targets',
    'spell_type',
    'summons',
  ],

  entryTranslationKeys: ['[category+id+language], language'],
  abilitiesTranslationKeys: ['[id+language], language'],

  enemySet: new Set(['bosses', 'monsters', 'raids']),
} as const
