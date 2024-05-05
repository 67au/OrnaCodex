import { parseCodexUrl } from "./utils";

export interface Guide {
  statusImmunities?: Array<string>,
  elements?: {
    resistance?: Array<string>,
    weak?: Array<string>,
    immunity?: Array<string>,
  },
  spawns?: Array<string>,
  element?: string,
  category?: string,
  level?: string,
  cost?: number,
  tier?: number,
}

export function parseGuideCache(cache: any) {
  const guide = {
    statusImmunities: cache?.immune_to_status || cache?.vulnerable_to_status,
    spawns: cache?.spawns,
    category: cache?.category,
  } as Guide;
  if (cache?.level) { guide.level = cache.level }
  if (cache?.codex !== undefined) {
    const codex = parseCodexUrl(cache.codex);
    if (codex.category === 'followers' && cache.cost !== undefined) {
      guide.cost = cache.cost;
      guide.tier = cache.tier;
    }
    if (codex.category === 'spells' && cache.element !== undefined) {
      guide.element = cache.element;
    }
  }
  const elements = JSON.parse(JSON.stringify({
    resistance: cache?.resistant_to,
    weak: cache?.weak_to,
    immunity: cache?.immune_to,
  }))
  if (Object.keys(elements).length > 0) { guide.elements = elements }
  return JSON.parse(JSON.stringify(guide)) as Guide;
}