import { StyleProvider, Themes as ComponentsThemes, type StyleVars } from '@varlet/ui'
import { useLocalStorage } from '@vueuse/core'

const defaultTheme = 'md2-dark'

export const currentTheme = useLocalStorage('theme', defaultTheme)

const suppoertedThemes: Record<string, StyleVars> = {
  'md2-dark': ComponentsThemes.dark,
  'md3-dark': ComponentsThemes.md3Dark
}

export function setTheme(theme: string) {
  currentTheme.value = theme
  StyleProvider(suppoertedThemes[currentTheme.value])
}

export function useDark() {
  if (suppoertedThemes[currentTheme.value] === undefined) {
    currentTheme.value = defaultTheme
  }
  setTheme(currentTheme.value)
}
