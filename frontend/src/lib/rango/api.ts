import type {
  RangoBlockchain,
  RangoToken,
  RangoQuoteRequest,
  RangoQuote,
  RangoSwapRequest,
  RangoSwapResponse,
  RangoStatus,
} from './types'

const RANGO_API_BASE = 'https://api.rango.exchange'
const RANGO_API_KEY = 'c6381a79-2817-4602-83bf-6a641a409e32'

export class RangoAPI {
  private baseUrl: string
  private apiKey: string

  constructor(baseUrl: string = RANGO_API_BASE, apiKey: string = RANGO_API_KEY) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'API-KEY': this.apiKey,
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Rango API error: ${error}`)
    }

    return response.json()
  }

  async getBlockchains(): Promise<RangoBlockchain[]> {
    const data = await this.request<{ blockchains: RangoBlockchain[] }>('/basic/meta')
    return data.blockchains
  }

  async getTokens(blockchain?: string): Promise<RangoToken[]> {
    const params = new URLSearchParams()
    if (blockchain) {
      params.append('blockchain', blockchain)
    }
    
    const data = await this.request<{ tokens: RangoToken[] }>(`/basic/meta?${params}`)
    return data.tokens
  }

  async getQuote(request: RangoQuoteRequest): Promise<RangoQuote> {
    console.log('Rango quote request:', request)
    
    const response = await this.request<{ result: RangoQuote }>('/basic/quote', {
      method: 'POST',
      body: JSON.stringify(request),
    })

    console.log('Rango quote response:', response)
    return response.result
  }

  async createSwap(request: RangoSwapRequest): Promise<RangoSwapResponse> {
    console.log('Rango swap request:', request)
    
    const response = await this.request<RangoSwapResponse>('/basic/swap', {
      method: 'POST',
      body: JSON.stringify(request),
    })

    console.log('Rango swap response:', response)
    return response
  }

  async getStatus(requestId: string, txId?: string): Promise<RangoStatus> {
    const params = new URLSearchParams({ requestId })
    if (txId) {
      params.append('txId', txId)
    }

    return this.request<RangoStatus>(`/basic/status?${params}`)
  }
}

export const rangoAPI = new RangoAPI()
