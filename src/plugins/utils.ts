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