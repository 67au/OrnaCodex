import { settingsStorage } from '@/storages/settings'
import { themes } from './themes'

export const themesName: Array<string> = Object.keys(themes)

export type Theme = (typeof themesName)[number]

const storageTheme = settingsStorage.value.theme

export const defaultTheme = themesName.includes(storageTheme) ? storageTheme : themesName[0]

export async function setTheme(theme: Theme) {
  settingsStorage.value.theme = theme
}
