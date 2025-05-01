type TowerKind = 'selene' | 'eos' | 'oceanus' | 'themis' | 'prometheus'
interface Floor {
  kind: TowerKind
  floor: number
}
type Floors = Array<Floor>

const kinds: TowerKind[] = ['selene', 'eos', 'oceanus', 'themis', 'prometheus']
const baseFloors = [35, 30, 25, 20, 15]
const baseDate = new Date(Date.UTC(2023, 11, 7, 0))

const CYCLE_DAYS = 35
const CYCLE_MINUTES = CYCLE_DAYS * 24 * 60

const CHECKPOINTS: Array<{
  hour: number
  minute: number
}> = [
  { hour: 0, minute: 0 },
  { hour: 1, minute: 0 },
  { hour: 5, minute: 0 },
  { hour: 10, minute: 0 },
  { hour: 15, minute: 0 },
  { hour: 15, minute: 36 },
  { hour: 20, minute: 0 },
] as const

function minutesIntoCycle(time: Date): number {
  const diff = time.getTime() - baseDate.getTime()
  const mod =
    ((diff % (CYCLE_MINUTES * 60 * 1000)) + CYCLE_MINUTES * 60 * 1000) % (CYCLE_MINUTES * 60 * 1000)
  return Math.floor(mod / 60000)
}

function computePoint(dayMinutes: number): number {
  const day = Math.floor(dayMinutes / (24 * 60))
  const rem = dayMinutes - day * 24 * 60
  const hour = Math.floor(rem / 60)
  const minute = rem % 60
  return CHECKPOINTS.reduce((point, event) => {
    if (event.hour === 0) {
      return point
    }
    const passed = hour > event.hour || (hour === event.hour && minute >= event.minute)
    return point + (passed ? 1 : 0)
  }, 0)
}

export function getTowerFloors(time: Date): Floors {
  const minCycle = minutesIntoCycle(time)
  const p = computePoint(minCycle)
  const day = Math.floor(minCycle / (24 * 60))

  return kinds.map((kind, i) => {
    const floor = ((Math.abs(baseFloors[i] - 15 + day * 6) + p) % CYCLE_DAYS) + 15
    return {
      kind,
      floor:
        floor >= 48 || (floor === 15 && (day % CYCLE_DAYS !== 0 || time.getUTCHours() !== 0))
          ? 50
          : floor,
    }
  })
}

function repeatArray<T>(arr: T[], point: number, n: number): T[] {
  const len = arr.length
  const start = ((point % len) + len) % len
  return Array.from({ length: n * len }, (_, idx) => {
    return arr[(start + idx) % len]
  })
}

export function getTowerFloorsInNextDays(time: Date, n: number = 2) {
  const minCycle = minutesIntoCycle(time)
  const p = computePoint(minCycle) + 1
  const day = Math.floor(minCycle / (24 * 60))

  const days = repeatArray(CHECKPOINTS, p, n)

  return days
    .map((point, index) => {
      const dayDelta = Math.floor((index + p) / 7)
      if (point.hour === 0 && (35 - (day + dayDelta)) % 35 != 0) {
        return false
      }
      const dayOne = new Date(time)
      dayOne.setUTCSeconds(0)
      dayOne.setUTCMilliseconds(0)
      dayOne.setUTCHours(point.hour + 24 * dayDelta)
      dayOne.setUTCMinutes(point.minute)
      return {
        time: dayOne,
        floors: getTowerFloors(dayOne),
      }
    })
    .filter((v) => v !== false)
}
