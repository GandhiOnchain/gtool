import type {
  LiFiChain,
  LiFiToken,
  LiFiQuoteRequest,
  LiFiRoute,
  LiFiStatus,
} from './types'

const LIFI_API_BASE = 'https://li.quest/v1'

export class LiFiAPI {
  private baseUrl: string

  constructor(baseUrl: string = LIFI_API_BASE) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`LI.FI API error: ${error}`)
    }

    return response.json()
  }

  async getChains(): Promise<LiFiChain[]> {
    const data = await this.request<{ chains: LiFiChain[] }>('/chains')
    return data.chains
  }

  async getTokens(params?: { chains?: number[] }): Promise<{ tokens: Record<string, LiFiToken[]> }> {
    const queryParams = new URLSearchParams()
    if (params?.chains) {
      queryParams.append('chains', params.chains.join(','))
    }
    
    return this.request<{ tokens: Record<string, LiFiToken[]> }>(`/tokens?${queryParams}`)
  }

  async getQuote(request: LiFiQuoteRequest): Promise<LiFiRoute> {
    console.log('LI.FI quote request:', request)
    
    const params = new URLSearchParams({
      fromChain: request.fromChain.toString(),
      toChain: request.toChain.toString(),
      fromToken: request.fromToken,
      toToken: request.toToken,
      fromAmount: request.fromAmount,
      fromAddress: request.fromAddress,
      integrator: request.integrator || 'vie-swap',
    })

    if (request.toAddress) {
      params.append('toAddress', request.toAddress)
    }
    if (request.slippage) {
      params.append('slippage', (request.slippage / 100).toString())
    }
    if (request.allowBridges) {
      params.append('allowBridges', request.allowBridges.join(','))
    }
    if (request.allowExchanges) {
      params.append('allowExchanges', request.allowExchanges.join(','))
    }

    const response = await this.request<LiFiRoute>(`/quote?${params}`)
    console.log('LI.FI quote response:', response)
    return response
  }

  async getRoutes(request: LiFiQuoteRequest): Promise<{ routes: LiFiRoute[] }> {
    console.log('LI.FI routes request:', request)
    
    const response = await this.request<{ routes: LiFiRoute[] }>('/advanced/routes', {
      method: 'POST',
      body: JSON.stringify({
        ...request,
        options: {
          slippage: request.slippage ? request.slippage / 100 : 0.03,
          integrator: request.integrator || 'vie-swap',
          allowBridges: request.allowBridges,
          allowExchanges: request.allowExchanges,
        },
      }),
    })

    console.log('LI.FI routes response:', response)
    return response
  }

  async getStatus(params: { txHash: string; bridge: string; fromChain: number; toChain: number }): Promise<LiFiStatus> {
    const queryParams = new URLSearchParams({
      txHash: params.txHash,
      bridge: params.bridge,
      fromChain: params.fromChain.toString(),
      toChain: params.toChain.toString(),
    })

    return this.request<LiFiStatus>(`/status?${queryParams}`)
  }
}

export const lifiAPI = new LiFiAPI()
