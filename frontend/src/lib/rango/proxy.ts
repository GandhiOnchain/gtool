// Since Rango API has CORS issues, we'll use a public CORS proxy
const CORS_PROXY = 'https://corsproxy.io/?'

export async function rangoProxyFetch(url: string, options?: RequestInit): Promise<Response> {
  const proxiedUrl = CORS_PROXY + encodeURIComponent(url)
  return fetch(proxiedUrl, options)
}
