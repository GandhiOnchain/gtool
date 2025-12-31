export interface LiFiChain {
  id: number
  key: string
  name: string
  coin: string
  mainnet: boolean
  logoURI: string
  tokenlistUrl: string
  multicallAddress: string
  metamask: {
    chainId: string
    blockExplorerUrls: string[]
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    rpcUrls: string[]
  }
}

export interface LiFiToken {
  address: string
  chainId: number
  symbol: string
  decimals: number
  name: string
  coinKey: string
  logoURI: string
  priceUSD: string
}

export interface LiFiQuoteRequest {
  fromChain: number
  toChain: number
  fromToken: string
  toToken: string
  fromAmount: string
  fromAddress: string
  toAddress?: string
  slippage?: number
  integrator?: string
  allowBridges?: string[]
  allowExchanges?: string[]
}

export interface LiFiRoute {
  id: string
  fromChainId: number
  fromAmountUSD: string
  fromAmount: string
  fromToken: LiFiToken
  fromAddress: string
  toChainId: number
  toAmountUSD: string
  toAmount: string
  toAmountMin: string
  toToken: LiFiToken
  toAddress: string
  gasCostUSD: string
  steps: Array<{
    id: string
    type: 'lifi' | 'swap' | 'cross'
    tool: string
    toolDetails: {
      key: string
      name: string
      logoURI: string
    }
    action: {
      fromChainId: number
      toChainId: number
      fromToken: LiFiToken
      toToken: LiFiToken
      fromAmount: string
      toAmount: string
      slippage: number
      fromAddress: string
      toAddress: string
    }
    estimate: {
      tool: string
      fromAmount: string
      toAmount: string
      toAmountMin: string
      approvalAddress: string
      executionDuration: number
      feeCosts: Array<{
        name: string
        description: string
        token: LiFiToken
        amount: string
        amountUSD: string
        percentage: string
        included: boolean
      }>
      gasCosts: Array<{
        type: string
        price: string
        estimate: string
        limit: string
        amount: string
        amountUSD: string
        token: LiFiToken
      }>
    }
    includedSteps?: Array<{
      id: string
      type: string
      action: unknown
      estimate: unknown
    }>
    transactionRequest?: {
      from: string
      to: string
      chainId: number
      data: string
      value: string
      gasPrice?: string
      gasLimit?: string
    }
  }>
  insurance: {
    state: string
    feeAmountUsd: string
  }
  tags: string[]
}

export interface LiFiStatus {
  status: 'NOT_FOUND' | 'INVALID' | 'PENDING' | 'DONE' | 'FAILED'
  substatus?: string
  substatusMessage?: string
  sending: {
    txHash: string
    txLink: string
    amount: string
    token: LiFiToken
    chainId: number
    gasPrice: string
    gasUsed: string
    gasToken: LiFiToken
    gasAmount: string
    gasAmountUSD: string
    amountUSD: string
    value: string
    timestamp: number
  }
  receiving?: {
    txHash: string
    txLink: string
    amount: string
    token: LiFiToken
    chainId: number
    gasPrice: string
    gasUsed: string
    gasToken: LiFiToken
    gasAmount: string
    gasAmountUSD: string
    amountUSD: string
    value: string
    timestamp: number
  }
  lifiExplorerLink: string
  fromAddress: string
  toAddress: string
  tool: string
  metadata?: {
    integrator: string
  }
}
