import type {
  RelayChain,
  RelayCurrency,
  RelayQuote,
  RelayStatus,
  RelayRequest,
  TokenPrice,
  MultiInputQuote,
} from './types'

const RELAY_API_BASE = 'https://api.relay.link'

export class RelayAPI {
  private baseUrl: string

  constructor(baseUrl: string = RELAY_API_BASE) {
    this.baseUrl = baseUrl
  }

  async getChains(): Promise<{ chains: RelayChain[] }> {
    const response = await fetch(`${this.baseUrl}/chains`)
    if (!response.ok) {
      throw new Error(`Failed to fetch chains: ${response.statusText}`)
    }
    return response.json()
  }

  async getCurrencies(params: {
    defaultList?: boolean
    chainIds?: number[]
    term?: string
    address?: string
    currencyId?: string
    tokens?: string[]
    verified?: boolean
    limit?: number
    includeAllChains?: boolean
    useExternalSearch?: boolean
    depositAddressOnly?: boolean
  }): Promise<RelayCurrency[]> {
    const response = await fetch(`${this.baseUrl}/currencies/v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch currencies: ${response.statusText}`)
    }
    return response.json()
  }

  async getTokenPrice(params: {
    address: string
    chainId: number
  }): Promise<TokenPrice> {
    const url = new URL(`${this.baseUrl}/currencies/token/price`)
    url.searchParams.append('address', params.address)
    url.searchParams.append('chainId', params.chainId.toString())

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`Failed to fetch token price: ${response.statusText}`)
    }
    return response.json()
  }

  async getQuote(params: {
    user: string
    originChainId: number
    destinationChainId: number
    originCurrency: string
    destinationCurrency: string
    amount: string
    tradeType: 'EXACT_INPUT' | 'EXACT_OUTPUT' | 'EXPECTED_OUTPUT'
    recipient?: string
    txs?: Array<{
      to: string
      data: string
      value?: string
    }>
    txsGasLimit?: number
    authorizationList?: Array<{
      chainId: string
      address: string
      nonce: string
      v: number
      r: string
      s: string
    }>
    refundTo?: string
    refundOnOrigin?: boolean
    topupGas?: boolean
    topupGasAmount?: string
    useReceiver?: boolean
    enableTrueExactOutput?: boolean
    explicitDeposit?: boolean
    useExternalLiquidity?: boolean
    useFallbacks?: boolean
    usePermit?: boolean
    permitExpiry?: number
    useDepositAddress?: boolean
    slippageTolerance?: string
    latePaymentSlippageTolerance?: string
    appFees?: Array<{
      recipient: string
      fee: string
    }>
    gasLimitForDepositSpecifiedTxs?: number
    forceSolverExecution?: boolean
    subsidizeFees?: boolean
    maxSubsidizationAmount?: string
    includedSwapSources?: string[]
    excludedSwapSources?: string[]
    includedOriginSwapSources?: string[]
    includedDestinationSwapSources?: string[]
    originGasOverhead?: number
    depositFeePayer?: string
    includeComputeUnitLimit?: boolean
    overridePriceImpact?: boolean
    disableOriginSwaps?: boolean
  }): Promise<RelayQuote> {
    const response = await fetch(`${this.baseUrl}/quote/v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get quote: ${error}`)
    }
    return response.json()
  }

  async getStatus(requestId: string): Promise<RelayStatus> {
    const url = new URL(`${this.baseUrl}/intents/status/v3`)
    url.searchParams.append('requestId', requestId)

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`Failed to get status: ${response.statusText}`)
    }
    return response.json()
  }

  async getRequests(params: {
    limit?: number
    continuation?: string
    user?: string
    hash?: string
    originChainId?: number
    destinationChainId?: number
    id?: string
    orderId?: string
    includeOrderData?: boolean
    startTimestamp?: number
    endTimestamp?: number
    startBlock?: number
    endBlock?: number
    chainId?: string
    referrer?: string
    sortBy?: 'createdAt' | 'updatedAt'
    sortDirection?: 'asc' | 'desc'
  }): Promise<{ requests: RelayRequest[]; continuation?: string }> {
    const url = new URL(`${this.baseUrl}/requests/v2`)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString())
      }
    })

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`Failed to get requests: ${response.statusText}`)
    }
    return response.json()
  }

  async getMultiInputQuote(params: {
    user: string
    origins: Array<{
      chainId: number
      currency: string
      amount: string
      user?: string
    }>
    destinationCurrency: string
    destinationChainId: number
    tradeType: 'EXACT_INPUT' | 'EXACT_OUTPUT'
    amount?: string
    recipient?: string
    refundTo?: string
    txs?: Array<{
      to: string
      data: string
      value?: string
    }>
    txsGasLimit?: number
    partial?: boolean
    referrer?: string
    gasLimitForDepositSpecifiedTxs?: number
    originGasOverhead?: number
    slippageTolerance?: string
  }): Promise<MultiInputQuote> {
    const response = await fetch(`${this.baseUrl}/execute/swap/multi-input`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get multi-input quote: ${error}`)
    }
    return response.json()
  }

  async executeSwap(params: {
    user: string
    originChainId: number
    destinationChainId: number
    originCurrency: string
    destinationCurrency: string
    amount: string
    tradeType: 'EXACT_INPUT' | 'EXACT_OUTPUT' | 'EXPECTED_OUTPUT'
    recipient?: string
    slippageTolerance?: string
    useExternalLiquidity?: boolean
    includedSwapSources?: string[]
  }): Promise<RelayQuote> {
    const response = await fetch(`${this.baseUrl}/execute/swap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to execute swap: ${error}`)
    }
    return response.json()
  }

  async getSwapSources(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/swap-sources`)
    if (!response.ok) {
      throw new Error(`Failed to get swap sources: ${response.statusText}`)
    }
    const data = await response.json()
    return data.sources || []
  }

  async indexTransaction(params: {
    txHashes: string[]
    chainId: number
  }): Promise<void> {
    const response = await fetch(`${this.baseUrl}/transactions/index`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
    if (!response.ok) {
      throw new Error(`Failed to index transaction: ${response.statusText}`)
    }
  }

  async indexSingleTransaction(params: {
    txHash: string
    chainId: number
  }): Promise<void> {
    const response = await fetch(`${this.baseUrl}/transactions/single`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
    if (!response.ok) {
      throw new Error(`Failed to index single transaction: ${response.statusText}`)
    }
  }
}

export const relayAPI = new RelayAPI()
