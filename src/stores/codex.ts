import { i18n } from '@/i18n'
import type { CodexCategory, CodexId, CodexLangs, CodexMeta, Status } from '@/types'
import { defineStore } from 'pinia'
import { useFiltersState } from './filters'
import { valueStrip } from '@/plugins/utils'
import { useSortState } from './sort'
import { CodexEntry } from '@/plugins/codex'
import { getFilterResult } from '@/plugins/filters'

export const useCodexState = defineStore('codex', {
  state: () => ({
    meta: {} as CodexMeta['meta'],
    langs: {} as CodexLangs,
    extra: {} as CodexMeta['extra']
  }),
  getters: {
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

    lang: (state) => state.langs[i18n.global.locale.value].base,
    abilities: (state) => state.langs[i18n.global.locale.value].abilities,
    miss: (state) => state.langs[i18n.global.locale.value].miss,

    index(state): Array<CodexId> {
      return Object.entries(state.meta).flatMap(([category, entries]) => {
        return Object.keys(entries).map((id) => {
          return {
            category: category as CodexCategory,
            id: id
          }
        })
      })
    },

    filtered(): Array<CodexId> {
      const { search, filters, multiple } = useFiltersState()
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
      return Array.from(filters.entries()).reduce((i, [key, filter]) => {
        return i.filter(({ category, id }: CodexId) => {
          if (filter.value === undefined) {
            return true
          }
          if (multiple && Array.isArray(filter.value) && filter.value.length === 0) {
            return true
          }

          return getFilterResult(this.meta[category][id], key, filter, multiple)
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
      const { nameTuple, asc } = sortState
      return nameTuple === undefined
        ? this.sortedDefault
        : [...this.sortedDefault]
            .filter((x) => {
              const [k, v] = nameTuple as [string, string]
              if (x.category !== k.split('.')[0]) {
                return false
              } else {
                return true
              }
            })
            .sort((a, b) => {
              const [k, v] = nameTuple as [string, string]
              let x = this.meta[a.category][a.id].stats?.[v]
              let y = this.meta[b.category][b.id].stats?.[v]
              if (k === 'raids') {
                x = this.meta[a.category][a.id][v]
                y = this.meta[b.category][b.id][v]
              }
              if (x === undefined || y === undefined) {
                return x === undefined ? 1 : -1
              }
              if (typeof x === 'string') {
                return (valueStrip(x) - valueStrip(y)) * (asc ? 1 : -1)
              } else {
                return typeof x === 'boolean' ? 1 : -1
              }
            })
    }
  },
  actions: {
    getIcon(name: string) {
      return this.icons[name]
    }
  }
})
