export type SwapProvider = 'relay' | 'rango' | 'lifi'

export interface UnifiedChain {
  id: number | string
  name: string
  displayName: string
  vmType: 'evm' | 'svm' | 'cosmos' | 'utxo' | 'tron' | 'starknet'
  iconUrl?: string
  nativeCurrency: {
    symbol: string
    decimals: number
  }
}

export interface UnifiedToken {
  address: string
  symbol: string
  name: string
  decimals: number
  chainId: number | string
  logoURI?: string
  priceUSD?: number
}

export interface UnifiedQuoteRequest {
  fromChain: UnifiedChain
  toChain: UnifiedChain
  fromToken: UnifiedToken
  toToken: UnifiedToken
  fromAmount: string
  fromAddress: string
  toAddress?: string
  slippage?: number
}

export interface UnifiedQuote {
  provider: SwapProvider
  fromAmount: string
  toAmount: string
  toAmountMin: string
  estimatedGas: string
  estimatedTime: number
  route: {
    steps: Array<{
      tool: string
      fromChain: string
      toChain: string
      fromToken: string
      toToken: string
    }>
  }
  fees: {
    gas?: string
    protocol?: string
    total?: string
  }
  rawQuote: unknown
}

export interface UnifiedSwapTransaction {
  provider: SwapProvider
  chainId: number
  to: string
  data: string
  value: string
  from: string
  gasLimit?: string
  gasPrice?: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
}
