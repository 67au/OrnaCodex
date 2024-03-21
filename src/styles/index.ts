import { StyleProvider, Themes as ComponentsThemes, type StyleVars } from "@varlet/ui";
import { store } from "@/store";

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
  store.state.theme = theme;
	setCustomTheme(theme);
  StyleProvider(suppoertedThemes[store.state.theme]);
}

export function useDark() {
	setTheme(store.state.theme || 'md2-dark');
}