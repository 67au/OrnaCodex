import { useGuideState } from '@/stores/guide'
import { CodexEntry } from './codex'
import { global } from './global'
import type { AssessQuery, GuideData, Stats } from '@/types'
import { parseCodexUrl } from './utils'

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

export class GuideEntry {
  codex: CodexEntry
  constructor(entry: CodexEntry) {
    this.codex = entry
  }
  get category() {
    return this.codex.category
  }
  get id() {
    return this.codex.id
  }
  get guideApiCategory() {
    return apiMap[this.category]
  }
  get guideId() {
    return this.cache?.id
  }
  get codexName() {
    const name = this.codex.meta.name
    return name.endsWith(' (Arisen)') ? name.slice(0, -9) : name
  }

  get cache() {
    const guideState = useGuideState()
    if (guideState.cache !== undefined) {
      if (guideState.cache[this.category] === undefined) {
        guideState.cache[this.category] = {}
      }
      return guideState.cache?.[this.category]?.[this.id]
    }
  }
  set cache(newValue: any) {
    const guideState = useGuideState()
    if (guideState.cache[this.category] === undefined) {
      guideState.cache[this.category] = {}
    }
    guideState.cache[this.category][this.id] = newValue
  }

  get exist() {
    return this.cache !== undefined
  }

  get stats(): Stats {
    return this.exist && this.cache.stats !== undefined ? this.cache.stats : {}
  }

  get baseStats() {
    return Object.fromEntries(
      Object.entries(this.stats).map(([k, v]) => {
        return [k, v.base]
      })
    )
  }

  get pageUrl() {
    return `${global.guideUrl}/${pageMap[this.category]}?show=${this.guideId}`
  }
  get assessUrl() {
    return `${global.guideUrl}/assess?item=${this.guideId}`
  }

  async fetchCache() {
    const guideState = useGuideState()
    if (this.cache === undefined) {
      const res = await guideState.searchByCodexName(this.guideApiCategory, this.codexName)
      for (const r of res) {
        if (r.codex === this.codex.url) {
          this.cache = r
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
          isBoss: this.cache.boss,
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
