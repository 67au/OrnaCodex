import { StyleProvider, Themes } from "@varlet/ui";
import { store } from "@/store";

const suppoertedThemes = {
	'md2-light': {},
	'md2-dark': Themes.dark,
	'md3-light': Themes.md3Light,
	'md3-dark': Themes.md3Dark,
};

store.state.theme = store.state.theme || 'md2-dark';

StyleProvider(suppoertedThemes[store.state.theme]);

export function setTheme(theme) {
  store.state.theme = theme
  StyleProvider(suppoertedThemes[store.state.theme]);
}