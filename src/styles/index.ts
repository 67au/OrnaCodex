import { StyleProvider, Themes as ComponentsThemes, type StyleVars } from "@varlet/ui";
import { useLocalStorage } from "@vueuse/core";
const defaultTheme = 'md2-dark';

export const currentTheme = useLocalStorage('theme', defaultTheme);

interface Themes {
  [Key: string]: StyleVars
}

const suppoertedThemes: Themes = {
	'md2-light': {},
	'md2-dark': ComponentsThemes.dark,
	'md3-light': ComponentsThemes.md3Light,
	'md3-dark': ComponentsThemes.md3Dark,
};

function setCustomTheme(theme: string) {
	if (theme.endsWith('light')) {
		suppoertedThemes[theme]['--highlight-color'] = 'var(--highlight-color-light)';
	} else {
		suppoertedThemes[theme]['--highlight-color'] = 'var(--highlight-color-dark)';
	}
}

export function setTheme(theme: string) {
  currentTheme.value = theme;
	setCustomTheme(theme);
  StyleProvider(suppoertedThemes[currentTheme.value]);
}

export function useDark() {
	setTheme(currentTheme.value);
}