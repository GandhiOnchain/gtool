import { useState, useCallback } from 'react'
import { config } from '@/config'

interface MoralisToken {
  token_address: string
  symbol: string
  name: string
  logo: string | null
  thumbnail: string | null
  decimals: number
  balance: string
  possible_spam: boolean
  verified_contract: boolean
  balance_formatted?: string
  usd_price?: number
  usd_value?: number
  chainId?: number
}

interface MoralisPortfolioResponse {
  tokens: MoralisToken[]
  totalValueUsd: number
}

const MORALIS_CHAIN_MAP: Record<number, string> = {
  1: 'eth',
  8453: 'base',
  42161: 'arbitrum',
  137: 'polygon',
  10: 'optimism',
}

/**
 * Hook for fetching portfolio data from Moralis
 */
export function useMoralisPortfolio() {
  const [data, setData] = useState<MoralisPortfolioResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchPortfolio = useCallback(async (
    walletAddress: string,
    chainIds: number[]
  ): Promise<MoralisPortfolioResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      const apiKey = config.moralis.apiKey
      if (!apiKey) {
        throw new Error('Moralis API key not configured')
      }

      const allTokens: MoralisToken[] = []
      let totalValueUsd = 0

      // Fetch tokens for each chain
      for (const chainId of chainIds) {
        const chain = MORALIS_CHAIN_MAP[chainId]
        if (!chain) {
          console.warn(`Chain ${chainId} not supported by Moralis`)
          continue
        }

        try {
          const url = `https://deep-index.moralis.io/api/v2.2/${walletAddress}/erc20?chain=${chain}`
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'accept': 'application/json',
              'X-API-Key': apiKey,
            },
          })

          if (!response.ok) {
            console.error(`Failed to fetch tokens for chain ${chain}:`, response.statusText)
            continue
          }

          const tokens: MoralisToken[] = await response.json()
          
          // Filter out spam tokens and add chain info
          const validTokens = tokens
            .filter(token => !token.possible_spam)
            .map(token => {
              const balance = parseFloat(token.balance) / Math.pow(10, token.decimals)
              const balanceFormatted = balance.toFixed(6)
              const usdValue = token.usd_price ? balance * token.usd_price : 0
              
              if (usdValue > 0) {
                totalValueUsd += usdValue
              }

              return {
                ...token,
                balance_formatted: balanceFormatted,
                usd_value: usdValue,
                chainId, // Add chain ID to each token
              }
            })

          allTokens.push(...validTokens)
        } catch (err) {
          console.error(`Error fetching tokens for chain ${chain}:`, err)
        }
      }

      // Fetch native token balances
      for (const chainId of chainIds) {
        const chain = MORALIS_CHAIN_MAP[chainId]
        if (!chain) continue

        try {
          const url = `https://deep-index.moralis.io/api/v2.2/${walletAddress}/balance?chain=${chain}`
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'accept': 'application/json',
              'X-API-Key': apiKey,
            },
          })

          if (!response.ok) {
            console.error(`Failed to fetch native balance for chain ${chain}:`, response.statusText)
            continue
          }

          const data = await response.json()
          const balance = parseFloat(data.balance) / 1e18
          
          if (balance > 0) {
            // Get native token info
            const nativeTokens: Record<string, { symbol: string; name: string }> = {
              'eth': { symbol: 'ETH', name: 'Ethereum' },
              'base': { symbol: 'ETH', name: 'Ethereum' },
              'arbitrum': { symbol: 'ETH', name: 'Ethereum' },
              'polygon': { symbol: 'MATIC', name: 'Polygon' },
              'optimism': { symbol: 'ETH', name: 'Ethereum' },
            }

            const nativeInfo = nativeTokens[chain] || { symbol: 'ETH', name: 'Ethereum' }
            
            allTokens.push({
              token_address: 'native',
              symbol: nativeInfo.symbol,
              name: nativeInfo.name,
              logo: null,
              thumbnail: null,
              decimals: 18,
              balance: data.balance,
              possible_spam: false,
              verified_contract: true,
              balance_formatted: balance.toFixed(6),
              usd_price: 0, // Would need price API
              usd_value: 0,
              chainId, // Add chain ID
            })
          }
        } catch (err) {
          console.error(`Error fetching native balance for chain ${chain}:`, err)
        }
      }

      const result = {
        tokens: allTokens,
        totalValueUsd,
      }

      setData(result)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch portfolio')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    data,
    isLoading,
    error,
    fetchPortfolio,
  }
}
