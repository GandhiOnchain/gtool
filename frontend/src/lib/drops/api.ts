import { config } from '@/config'

const DROPS_API_BASE = 'https://api.drops.bot/v1'

export interface DropsAirdrop {
  id: string
  name: string
  symbol: string
  amount: string
  amountUsd?: string
  network: string
  chainId: number
  status: 'claimable' | 'claimed' | 'expired' | 'missed'
  claimUrl?: string
  contractAddress?: string
  expiresAt?: string
  claimedAt?: string
  logo?: string
  protocol?: string
}

export interface DropsApiResponse {
  address: string
  airdrops: DropsAirdrop[]
  totalValue: number
  claimableCount: number
  claimedCount: number
  missedCount: number
}

/**
 * Check airdrops for a wallet address using Drops.bot API
 */
export async function checkAirdropsWithDrops(
  walletAddress: string
): Promise<DropsApiResponse> {
  const apiKey = config.drops.apiKey

  if (!apiKey) {
    throw new Error('Drops API key not configured')
  }

  try {
    const response = await fetch(`${DROPS_API_BASE}/airdrops/${walletAddress}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Drops API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch airdrops from Drops.bot:', error)
    throw error
  }
}

/**
 * Map Drops.bot network names to chain IDs
 */
export function getChainIdFromNetwork(network: string): number {
  const networkMap: Record<string, number> = {
    'ethereum': 1,
    'base': 8453,
    'arbitrum': 42161,
    'optimism': 10,
    'polygon': 137,
    'bnb': 56,
    'avalanche': 43114,
    'linea': 59144,
    'scroll': 534352,
    'mantle': 5000,
    'solana': 0, // Non-EVM
  }

  return networkMap[network.toLowerCase()] || 1
}

/**
 * Get chain name from chain ID
 */
export function getChainName(chainId: number): string {
  const chainNames: Record<number, string> = {
    1: 'Ethereum',
    8453: 'Base',
    42161: 'Arbitrum',
    10: 'Optimism',
    137: 'Polygon',
    56: 'BNB Chain',
    43114: 'Avalanche',
    59144: 'Linea',
    534352: 'Scroll',
    5000: 'Mantle',
  }

  return chainNames[chainId] || 'Unknown'
}
