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
}

export function parseGuideCache(cache: any) {
  const guide = {
    statusImmunities: cache?.immune_to_status || cache?.vulnerable_to_status,
    spawns: cache?.spawns,
    element: cache?.element,
    category: cache?.category,
  } as Guide;
  const elements = JSON.parse(JSON.stringify({
    resistance: cache?.resistant_to,
    weak: cache?.weak_to,
    immunity: cache?.immune_to,
  }))
  if (Object.keys(elements).length > 0) {guide.elements = elements};
  return JSON.parse(JSON.stringify(guide)) as Guide;
}