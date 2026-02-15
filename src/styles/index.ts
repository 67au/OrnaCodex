import { useSettingsStore } from "@/stores/settings";
import { themes } from "./themes";

export const themesName: Array<string> = Object.keys(themes);

export type Theme = (typeof themesName)[number];

const settingsStore = useSettingsStore();

export const defaultTheme = themesName.includes(settingsStore.value.theme)
  ? settingsStore.value.theme
  : themesName[0];

export function setTheme(theme: Theme) {
  settingsStore.value.theme = theme;
}
