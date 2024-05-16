import { type CodexView } from "@/store";

export function convertStatusKey(key: string) {
  const regex_temp = / \[temp\]/ig;
  const regex_underline = / |\.|\:|\\|\/|\'/ig;
  const regex_up = /↑/ig;
  const regex_down = /↓/ig;
  return key.toLowerCase().replaceAll(regex_temp, '')
    .replaceAll(regex_underline, '_')
    .replaceAll(regex_up, 'u')
    .replaceAll(regex_down, 'd')
}

export function parseCodexUrl(url: string) {
  const a = url.split('/');
  return { 
    category: a[2],
    id: a[5],
  } as CodexView
}

export function valueStrip(value: string) {
  const regex = /\%|\+/ig;
  return Number(value.replaceAll(regex, ''))
}