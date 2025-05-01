export const setParams = (url: string) =>
  url + '?' + new URLSearchParams({ t: String(new Date().getTime()) }).toString()
