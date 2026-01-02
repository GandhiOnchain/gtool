export interface AirdropConfig {
  tokenAddress: string
  tokenSymbol: string
  tokenName: string
  tokenDecimals: number
  chainId: number
  chainName: string
  totalSupply: string
  eligibilityCriteria: {
    minEthBalance?: string
    minTokenBalance?: string
    snapshotBlock?: number
    customCriteria?: string
  }
  merkleRoot?: string
  claimContractAddress?: string
}

export interface AirdropEligibility {
  isEligible: boolean
  amount: string
  amountFormatted: string
  proof?: string[]
  reason?: string
  alreadyClaimed?: boolean
}

export interface ClaimStatus {
  status: 'idle' | 'checking' | 'claiming' | 'success' | 'error'
  message?: string
  txHash?: string
}
