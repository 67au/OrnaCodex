export const PROOF_SCALE: Record<string, number> = {
  'proof-of-anguish': 1,
  'tower-shard': 200,
  coral: 20,
  'proof-of-monument': 10,
  'proof-of-felling': 20,
  'proof-of-sparring': 4,
  deepshard: 20,
  'proof-of-trials': 2,
  'proof-of-effort': 2,
  'proof-of-remembrance': 2
}

const RARITY_CODE: Record<string, number> = {
  common: 0,
  rare: 1,
  famed: 2,
  legendary: 3
}

const CAL_SCALE = 100

export const PROOF_IDS = Object.keys(PROOF_SCALE)

export function getProofRate(proofId: string, tier: number, rarity: string) {
  return PROOF_SCALE[proofId] * (tier * 10 + RARITY_CODE[rarity] * 5)
}

export function getProofs(input: number, rate: number) {
  return Math.ceil((rate * input) / CAL_SCALE)
}

export function getMaterials(input: number, rate: number) {
  return Math.floor((input * CAL_SCALE) / rate)
}
