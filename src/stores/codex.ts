import { i18n } from '@/i18n'
import type { CodexId, CodexLangs, CodexMeta, Status } from '@/types'
import { defineStore } from 'pinia'
import { useFiltersState } from './filters'
import { useOptionsState } from './options'
import { valueStrip } from '@/plugins/utils'
import { useSortState } from './sort'

export const useCodexState = defineStore('codex', {
  state: () => ({
    meta: {} as CodexMeta['base'],
    langs: {} as CodexLangs,
    extra: {} as CodexMeta['extra']
  }),
  getters: {
    materials: (state) => state.extra['upgrade_materials'],
    spells: (state) => state.extra['skills'],
    offhandSkills: (state) => state.extra['offhand_skills'],
    missEntries: (state) => state.extra['miss_entries'],
    statPercentKeys: (state) => new Set(state.extra['stat_percent_keys'] as Array<string>),
    sortKeys: (state) => new Set(state.extra['sort_keys'] as Array<string>),
    assessKeysSet: () =>
      new Set([
        'hp',
        'mana',
        'attack',
        'magic',
        'defense',
        'resistance',
        'dexterity',
        'ward',
        'crit',
        'foresight'
      ]),
    icons: (state) => state.extra.icons,

    lang: (state) => state.langs[i18n.global.locale.value],

    index(state): Array<CodexId> {
      return Object.entries(state.meta).flatMap(([category, entries]) => {
        return Object.keys(entries).map((id) => {
          return {
            category: category,
            id: id
          }
        })
      })
    },

    filtered(): Array<CodexId> {
      const { search, filters, multiple } = useFiltersState()
      const optionsState = useOptionsState()
      const searchPattern = new RegExp(search, 'i')
      if (this.lang === undefined) {
        return this.index
      }
      const start = this.index.filter(({ category, id }: CodexId) => {
        return (
          searchPattern.test(this.lang[category][id].name) ||
          (this.lang[category][id]?.description &&
            searchPattern.test(this.lang[category][id].description))
        )
      })
      return Array.from(filters.values()).reduce((i, filter) => {
        return i.filter(({ category, id }: CodexId) => {
          if (filter.value === undefined) {
            return true
          }
          if (multiple && Array.isArray(filter.value) && filter.value.length === 0) {
            return true
          }

          if (optionsState.singleKeysSet.has(filter.key)) {
            const testValue: string = this.meta[category][id][filter.key]
            if (testValue === undefined) {
              return false
            }
            if (filter.key === 'exotic') {
              return testValue === filter.value
            }
            if (multiple) {
              for (const v of filter.value) {
                if (testValue === v) {
                  return true
                }
              }
              return false
            } else {
              return testValue === filter.value
            }
          }

          if (optionsState.arrayKeysSet.has(filter.key)) {
            const testValue: Array<string> = this.meta[category][id][filter.key]
            if (testValue === undefined) {
              return false
            }
            if (multiple) {
              for (const v of filter.value) {
                if (testValue.includes(v)) {
                  return true
                }
              }
              return false
            } else {
              return testValue.includes(filter.value as string)
            }
          }

          if (optionsState.statusKeysSet.has(filter.key)) {
            const statusValue: Array<Status> = this.meta[category][id][filter.key]
            if (statusValue === undefined) {
              return false
            }
            const testValue: Array<string> = statusValue.map(({ name: name }) => name)
            if (multiple) {
              for (const v of filter.value) {
                if (testValue.includes(v)) {
                  return true
                }
              }
              return false
            } else {
              return testValue.includes(filter.value as string)
            }
          }
        })
      }, start)
    },

    sortedDefault(): Array<CodexId> {
      const sortState = useSortState()
      if (sortState.default.name === 'name') {
        return [...this.filtered].sort((a, b) => {
          const x = this.lang[a.category][a.id]
          const y = this.lang[b.category][b.id]
          return (
            (x.name as string).localeCompare(y.name as string) * (sortState.default.asc ? 1 : -1)
          )
        })
      }
      if (sortState.default.name === 'tier') {
        return [...this.filtered].sort((a, b) => {
          const x = this.meta[a.category][a.id]
          const y = this.meta[b.category][b.id]
          return (x.tier - y.tier) * (sortState.default.asc ? 1 : -1)
        })
      }
      return this.filtered
    },

    sorted(): Array<CodexId> {
      const sortState = useSortState()
      const { name, asc } = sortState
      return name === undefined
        ? this.sortedDefault
        : [...this.sortedDefault].sort((a, b) => {
            const x = this.meta[a.category][a.id]
            const y = this.meta[b.category][b.id]
            if (x?.stats === undefined || x?.stats[name] === undefined) {
              return 1
            }
            if (y?.stats === undefined || y?.stats[name] === undefined) {
              return -1
            }
            if (typeof x.stats[name] === 'string') {
              return (valueStrip(x.stats[name]) - valueStrip(y.stats[name])) * (asc ? 1 : -1)
            } else {
              return typeof x.stats[name] === 'boolean' ? 1 : -1
            }
          })
    }
  }
})
