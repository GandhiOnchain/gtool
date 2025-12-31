import type {
  RangoBlockchain,
  RangoToken,
  RangoQuoteRequest,
  RangoQuote,
  RangoSwapRequest,
  RangoSwapResponse,
  RangoStatus,
} from './types'
import { rangoProxyFetch } from './proxy'

const RANGO_API_BASE = 'https://api.rango.exchange'
const RANGO_API_KEY = 'c6381a79-2817-4602-83bf-6a641a409e32'

// Hardcoded blockchain and token data to avoid CORS issues
const HARDCODED_BLOCKCHAINS: RangoBlockchain[] = [
  {
    name: 'SOLANA',
    displayName: 'Solana',
    shortName: 'SOL',
    type: 'SOLANA',
    enabled: true,
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
  },
]

const HARDCODED_TOKENS: Record<string, RangoToken[]> = {
  'SOLANA': [
    {
      blockchain: 'SOLANA',
      symbol: 'SOL',
      name: 'Solana',
      address: null,
      decimals: 9,
      image: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
      blockchainImage: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
      usdPrice: null,
      isPopular: true,
    },
    {
      blockchain: 'SOLANA',
      symbol: 'USDC',
      name: 'USD Coin',
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      decimals: 6,
      image: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
      blockchainImage: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
      usdPrice: 1,
      isPopular: true,
    },
    {
      blockchain: 'SOLANA',
      symbol: 'USDT',
      name: 'Tether USD',
      address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      decimals: 6,
      image: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg',
      blockchainImage: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
      usdPrice: 1,
      isPopular: true,
    },
  ],
}

export class RangoAPI {
  private baseUrl: string
  private apiKey: string

  constructor(baseUrl: string = RANGO_API_BASE, apiKey: string = RANGO_API_KEY) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    // Use CORS proxy to bypass browser restrictions
    const response = await rangoProxyFetch(url, {
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
    try {
      console.log('Fetching Rango blockchains via proxy...')
      const data = await this.request<{ blockchains: RangoBlockchain[] }>('/basic/meta')
      console.log('Rango blockchains loaded:', data.blockchains?.length)
      return data.blockchains
    } catch (error) {
      console.warn('Rango API failed, using hardcoded data:', error)
      return HARDCODED_BLOCKCHAINS
    }
  }

  async getTokens(blockchain?: string): Promise<RangoToken[]> {
    try {
      console.log('Fetching Rango tokens via proxy for blockchain:', blockchain)
      const data = await this.request<{ tokens: RangoToken[] }>('/basic/meta')
      console.log('Rango tokens loaded:', data.tokens?.length)
      
      if (blockchain) {
        const filtered = data.tokens.filter(t => t.blockchain.toUpperCase() === blockchain.toUpperCase())
        console.log('Filtered tokens for', blockchain, ':', filtered.length)
        return filtered
      }
      
      return data.tokens
    } catch (error) {
      console.warn('Rango API failed, using hardcoded tokens:', error)
      
      if (blockchain && HARDCODED_TOKENS[blockchain.toUpperCase()]) {
        return HARDCODED_TOKENS[blockchain.toUpperCase()]
      }
      
      return Object.values(HARDCODED_TOKENS).flat()
    }
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
