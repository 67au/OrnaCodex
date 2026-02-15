export const setParams = (url: string) =>
  url + '?' + new URLSearchParams({ t: String(new Date().getTime()) }).toString()

export const useFetch = (url: string) =>
  createFetch({
    baseUrl: url,
    options: {
      onFetchError(ctx) {
        return ctx
      },
    },
  })
