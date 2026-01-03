import { useState, useCallback } from 'react'
import { config } from '@/config'

interface ZapperToken {
  baseToken: {
    name: string
    symbol: string
    address: string
    imgUrl: string
    network: string
  }
  balance: number
  balanceUSD: number
}

interface ZapperPortfolioResponse {
  totals: {
    total: number
  }
  tokenBalances: Array<{
    token: ZapperToken
  }>
}

const ZAPPER_NETWORK_TO_CHAIN_ID: Record<string, number> = {
  'ETHEREUM_MAINNET': 1,
  'BASE_MAINNET': 8453,
  'ARBITRUM_MAINNET': 42161,
  'POLYGON_MAINNET': 137,
  'OPTIMISM_MAINNET': 10,
  'BINANCE_SMART_CHAIN_MAINNET': 56,
}

/**
 * Hook for fetching portfolio data from Zapper
 */
export function useZapperPortfolio() {
  const [data, setData] = useState<ZapperPortfolioResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchPortfolio = useCallback(async (
    walletAddress: string
  ): Promise<ZapperPortfolioResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      const apiKey = config.zapper.apiKey
      if (!apiKey) {
        throw new Error('Zapper API key not configured')
      }

      const query = `
        query Portfolio($addresses: [Address!]!) {
          portfolio(addresses: $addresses) {
            totals {
              total
            }
            tokenBalances {
              token {
                baseToken {
                  name
                  symbol
                  address
                  imgUrl
                  network
                }
                balance
                balanceUSD
              }
            }
          }
        }
      `

      const response = await fetch('https://public.zapper.xyz/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-zapper-api-key': apiKey,
        },
        body: JSON.stringify({
          query,
          variables: {
            addresses: [walletAddress],
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Zapper API error: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.errors) {
        throw new Error(`Zapper GraphQL error: ${result.errors[0]?.message}`)
      }

      const portfolioData = result.data.portfolio

      setData(portfolioData)
      return portfolioData
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch Zapper portfolio')
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
    ZAPPER_NETWORK_TO_CHAIN_ID,
  }
}
