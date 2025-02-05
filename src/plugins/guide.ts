import { CodexEntry } from './codex'
import { global } from './global'
import type { AssessQuery, GuideData, GuideModel, Stats } from '@/types'
import { parseCodexUrl } from './utils'
import { useGuideState } from '@/stores/guide'
import localforage from 'localforage'

const apiMap: Record<string, string> = {
  items: 'item',
  monsters: 'monster',
  bosses: 'monster',
  raids: 'monster',
  followers: 'pet',
  spells: 'skill'
}

const pageMap: Record<string, string> = {
  items: 'items',
  monsters: 'monsters',
  bosses: 'monsters',
  raids: 'monsters',
  followers: 'pets',
  spells: 'skills'
}

const db = localforage.createInstance({
  name: 'guide'
})

export class GuideEntry {
  codex: CodexEntry
  constructor(entry: CodexEntry) {
    this.codex = entry
  }
  get guideApiCategory() {
    return apiMap[this.codex.category]
  }
  get guideId() {
    return this.data?.id
  }
  get data() {
    return (this.cache as GuideModel)?.data
  }
  get datetime() {
    return new Date((this.cache as GuideModel)?.datetime)
  }
  get codexName() {
    const name = this.codex.meta.name
    return name.endsWith(' (Arisen)') ? name.slice(0, -9) : name
  }

  get cache() {
    const guideState = useGuideState()
    return guideState.cache[this.codex.url]
  }
  set cache(newValue: GuideModel | undefined) {
    const guideState = useGuideState()
    if (newValue === undefined) {
      db.removeItem(this.codex.url)
      delete guideState.cache[this.codex.url]
    } else {
      guideState.cache[this.codex.url] = newValue
    }
  }

  get exist() {
    return this.cache !== undefined
  }

  get stats(): Stats {
    return this.exist && this.data.stats !== undefined ? this.data.stats : {}
  }

  get baseStats() {
    return Object.fromEntries(
      Object.entries(this.stats).map(([k, v]) => {
        return [k, v.base]
      })
    )
  }

  get pageUrl() {
    return `${global.guideUrl}/${pageMap[this.codex.category]}?show=${this.guideId}`
  }
  get assessUrl() {
    return `${global.guideUrl}/assess?item=${this.guideId}`
  }

  async searchByCodexName(category: string, name: string) {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), 10000)
    try {
      const resp = await fetch(`${global.guideApiUrl}/${category}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify({ icontains: [{ name: name }] })
      })
      const result = await resp.json()
      return result
    } catch (error) {
      return []
    }
  }

  async loadCache() {
    const entry: string | null = await db.getItem(this.codex.url)
    if (entry !== null) {
      this.cache = JSON.parse(entry)
    }
    return entry !== null
  }

  async fetchCache() {
    if (this.cache === undefined) {
      const res = await this.searchByCodexName(this.guideApiCategory, this.codexName)
      for (const r of res) {
        if (r.codex === this.codex.url) {
          this.cache = {
            data: r,
            datetime: new Date().getTime()
          }
          await db.setItem(this.codex.url, JSON.stringify(this.cache))
          break
        }
      }
    }
    return this.cache !== undefined
  }

  async assess(query: AssessQuery) {
    try {
      const resp = await fetch(`${global.guideApiUrl}/assess`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          Object.fromEntries(Object.entries(query.data).map(([k, v]) => [k, Number(v)]))
        )
      })
      return await resp.json()
    } catch (error) {
      return undefined
    }
  }

  assessQuery(): AssessQuery | undefined {
    if (this.baseStats !== undefined) {
      const query = {
        data: {
          id: this.guideId,
          level: 1
        },
        extra: {
          isBoss: this.data.boss,
          isQuality: false,
          isGuide: true,
          baseStats: this.baseStats,
          isUpgradable: true
        }
      } as AssessQuery
      for (const [key, value] of Object.entries(this.baseStats)) {
        query.data[key] = value
      }
      return query
    } else {
      return undefined
    }
  }

  static parseGuideCache(cache: any) {
    const guide = {
      statusImmunities: cache?.immune_to_status || cache?.vulnerable_to_status,
      spawns: cache?.spawns,
      category: cache?.category
    } as GuideData
    if (cache?.level) {
      guide.level = cache.level
    }
    if (cache?.codex !== undefined) {
      const codex = parseCodexUrl(cache.codex)
      if (codex.category === 'followers' && cache.cost !== undefined) {
        guide.cost = cache.cost
        guide.tier = cache.tier
      }
      if (codex.category === 'spells' && cache.element !== undefined) {
        guide.element = cache.element
      }
    }
    const elements = JSON.parse(
      JSON.stringify({
        resistance: cache?.resistant_to,
        weak: cache?.weak_to,
        immunity: cache?.immune_to
      })
    )
    if (Object.keys(elements).length > 0) {
      guide.elements = elements
    }
    return JSON.parse(JSON.stringify(guide)) as GuideData
  }
}
