export interface RangoBlockchain {
  name: string
  displayName: string
  shortName: string
  type: 'EVM' | 'SOLANA' | 'COSMOS' | 'UTXO' | 'TRON' | 'STARKNET'
  chainId?: string
  enabled: boolean
  logo: string
}

export interface RangoToken {
  blockchain: string
  symbol: string
  name: string
  address: string | null
  decimals: number
  image: string
  blockchainImage: string
  usdPrice: number | null
  isPopular?: boolean
}

export interface RangoQuoteRequest {
  from: {
    blockchain: string
    symbol: string
    address: string | null
  }
  to: {
    blockchain: string
    symbol: string
    address: string | null
  }
  amount: string
  fromAddress: string
  toAddress?: string
  slippage?: number
  disableEstimate?: boolean
}

export interface RangoQuote {
  requestId: string
  route: {
    from: RangoToken
    to: RangoToken
    outputAmount: string
    outputAmountUsd: string | null
    swapper: {
      id: string
      title: string
      logo: string
    }
    path: Array<{
      from: RangoToken
      to: RangoToken
      swapper: {
        id: string
        title: string
      }
      expectedOutput: string
    }>
  }
  fee: Array<{
    name: string
    token: RangoToken
    amount: string
    expenseType: string
  }>
  estimatedTimeInSeconds: number
}

export interface RangoSwapRequest {
  requestId: string
  step: number
  userSettings: {
    slippage: string
    infiniteApprove: boolean
  }
  validations?: {
    balance: boolean
    fee: boolean
  }
}

export interface RangoSwapResponse {
  transaction: {
    type: 'EVM' | 'SOLANA' | 'COSMOS' | 'TRANSFER'
    blockChain: string
    from: string
    to: string
    data?: string
    value?: string
    gasLimit?: string
    gasPrice?: string
    maxFeePerGas?: string
    maxPriorityFeePerGas?: string
  } | null
  ok: boolean
  error?: string
}

export interface RangoStatus {
  status: 'running' | 'success' | 'failed'
  timestamp: number
  explorerUrl: Array<{
    url: string
    description: string
  }>
  bridgeData?: {
    srcChainId: string
    destChainId: string
    srcTxHash: string
    destTxHash?: string
  }
}
