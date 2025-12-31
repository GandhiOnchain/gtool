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
    try {
      const data = await this.request<{ blockchains: RangoBlockchain[] }>('/basic/meta')
      return data.blockchains
    } catch (error) {
      console.warn('Rango API blocked by CORS, using hardcoded data')
      return HARDCODED_BLOCKCHAINS
    }
  }

  async getTokens(blockchain?: string): Promise<RangoToken[]> {
    try {
      const data = await this.request<{ tokens: RangoToken[] }>('/basic/meta')
      
      if (blockchain) {
        return data.tokens.filter(t => t.blockchain.toUpperCase() === blockchain.toUpperCase())
      }
      
      return data.tokens
    } catch (error) {
      console.warn('Rango API blocked by CORS, using hardcoded tokens')
      
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
