export interface RelayCurrency {
  chainId: number
  address: string
  symbol: string
  name: string
  decimals: number
  vmType?: string
  metadata?: {
    logoURI?: string
    verified?: boolean
    isNative?: boolean
  }
}

export interface RelayChain {
  id: number
  name: string
  displayName: string
  httpRpcUrl: string
  wsRpcUrl?: string
  explorerUrl: string
  explorerName: string
  depositEnabled: boolean
  tokenSupport: string
  disabled: boolean
  currency: {
    id: string
    symbol: string
    name: string
    address: string
    decimals: number
    supportsBridging: boolean
  }
  featuredTokens?: RelayCurrency[]
  erc20Currencies?: RelayCurrency[]
  iconUrl?: string
  logoUrl?: string
  brandColor?: string
  vmType?: string
}

export interface RelayAmount {
  currency: RelayCurrency
  amount: string
  amountFormatted: string
  amountUsd: string
  minimumAmount?: string
}

export interface RelayQuoteStep {
  id: string
  action: string
  description: string
  kind: string
  requestId?: string
  items: Array<{
    status: string
    data: {
      from: string
      to: string
      data: string
      value: string
      maxFeePerGas?: string
      maxPriorityFeePerGas?: string
      chainId: number
    }
    check?: {
      endpoint: string
      method: string
    }
  }>
}

export interface RelayQuote {
  steps: RelayQuoteStep[]
  fees: {
    gas?: RelayAmount
    relayer?: RelayAmount
    relayerGas?: RelayAmount
    relayerService?: RelayAmount
    app?: RelayAmount
    subsidized?: RelayAmount
  }
  details: {
    operation?: string
    sender?: string
    recipient?: string
    currencyIn?: RelayAmount
    currencyOut?: RelayAmount
    refundCurrency?: RelayAmount
    currencyGasTopup?: RelayAmount
    totalImpact?: {
      usd: string
      percent: string
    }
    swapImpact?: {
      usd: string
      percent: string
    }
    rate?: string
    slippageTolerance?: {
      origin?: {
        usd: string
        value: string
        percent: string
      }
      destination?: {
        usd: string
        value: string
        percent: string
      }
    }
    timeEstimate?: number
    userBalance?: string
    isFixedRate?: boolean
    route?: {
      origin?: {
        inputCurrency: RelayAmount
        outputCurrency: RelayAmount
        router?: string
        includedSwapSources?: string[]
      }
      destination?: {
        inputCurrency: RelayAmount
        outputCurrency: RelayAmount
        router?: string
        includedSwapSources?: string[]
      }
    }
  }
  protocol?: {
    v2?: {
      orderId: string
      orderData: unknown
      paymentDetails: {
        chainId: string
        depository: string
        currency: string
        amount: string
      }
    }
  }
}

export interface RelayStatus {
  status: 'waiting' | 'pending' | 'submitted' | 'success' | 'delayed' | 'refunded' | 'failure'
  details?: string
  inTxHashes?: string[]
  txHashes?: string[]
  updatedAt?: number
  originChainId?: number
  destinationChainId?: number
}

export interface RelayRequest {
  id: string
  status: string
  user: string
  recipient: string
  data: {
    subsidizedRequest: boolean
    fees: {
      gas: string
      fixed: string
      price: string
    }
    feesUsd: {
      gas: string
      fixed: string
      price: string
    }
    inTxs: Array<{
      fee: string
      data: {
        to: string
        data: string
        from: string
        value: string
      }
      hash: string
      type: string
      chainId: number
      timestamp: number
    }>
    currency: string
    price: string
    usesExternalLiquidity: boolean
    outTxs: Array<{
      fee: string
      data: {
        to: string
        data: string
        from: string
        value: string
      }
      hash: string
      type: string
      chainId: number
      timestamp: number
    }>
  }
  createdAt: string
  updatedAt: string
}

export interface TokenPrice {
  price: number
}

export interface MultiInputQuote extends RelayQuote {
  breakdown: Array<{
    value: string
    timeEstimate: number
  }>
  balances: {
    userBalance: string
    requiredToSolve: string
  }
}
