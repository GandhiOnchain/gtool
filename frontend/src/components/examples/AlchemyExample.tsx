/**
 * AlchemyExample.tsx
 *
 * This file demonstrates how to use all the Alchemy SDK hooks available in the codebase.
 * It shows comprehensive examples of pricing data, token/portfolio queries, and NFT operations.
 *
 * Key features demonstrated:
 * 1. Token price queries (current and historical)
 * 2. Token balance and portfolio management across multiple chains
 * 3. NFT queries with pagination
 * 4. NFT owner lookups and metadata batch fetching
 *
 * This example is designed to show AI assistants and developers how to properly use
 * each Alchemy hook with correct typing, error handling, and user feedback.
 */

import React, { useState, useEffect, } from 'react'
import { formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import { useWallet } from '@/hooks/useWallet'
import { Button } from '@/components/ui/button'
import {HistoricalPriceInterval, NftContractOwner, NftOwnershipResponseWithMetadata} from "@/hooks/alchemy/types";
import {useHistoricalTokenPrices} from "@/hooks/alchemy/price/useHistoricalTokenPrices.ts";
import {useTokenPricesByAddress} from "@/hooks/alchemy/price/useTokenPricesByAddress.ts";
import {useTokenPricesBySymbol} from "@/hooks/alchemy/price/useTokenPricesBySymbol.ts";
import {useHistoricalTokenPricesBySymbol} from "@/hooks/alchemy/price/useHistoricalTokenPricesBySymbol.ts";
import {useTokensByOwnerOnMultipleChains} from "@/hooks/alchemy/portfolio/useTokensByOwnerOnMultipleChains.ts";
import {
    useTokenBalancesByOwnerOnMultipleChains
} from "@/hooks/alchemy/portfolio/useTokenBalancesByOwnerOnMultipleChains.ts";
import {useNftsByOwnerOnMultipleChains} from "@/hooks/alchemy/nft/useNftsByOwnerOnMultipleChains.ts";
import {useOwnersByContractOnSpecificChain} from "@/hooks/alchemy/nft/useOwnersByContractOnSpecificChain.ts";
import {
    useNftMetadataByTokenIdBatchOnSpecificChain
} from "@/hooks/alchemy/nft/useNftMetadataByTokenIdBatchOnSpecificChain.ts";

// Import all Alchemy hooks and types

// Popular tokens for examples
const POPULAR_TOKENS = [
  { symbol: 'ETH', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', chainId: 1 }, // WETH on Ethereum
  { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', chainId: 1 }, // USDC on Ethereum
  { symbol: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', chainId: 1 }, // DAI on Ethereum
]

// Popular NFT collections for examples
const POPULAR_NFT_COLLECTIONS = [
  { name: 'Bored Ape Yacht Club', address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', chainId: 1 },
  { name: 'Pudgy Penguins', address: '0xBd3531dA5CF5857e7CfAA92426877b022e612cf8', chainId: 1 },
  { name: 'Azuki', address: '0xED5AF388653567Af2F388E6224dC7C4b3241C544', chainId: 1 },
]

// Supported chains for multi-chain queries
const SUPPORTED_CHAINS = [
  { id: 1, name: 'Ethereum' },
  { id: 137, name: 'Polygon' },
  { id: 10, name: 'Optimism' },
  { id: 42161, name: 'Arbitrum' },
  { id: 8453, name: 'Base' },
]

type TabType = 'prices' | 'portfolio' | 'nfts'

export function AlchemyExample() {
  const { address: userAddress } = useAccount()

  // UI State
  const [activeTab, setActiveTab] = useState<TabType>('prices')

  // Price hooks
  const historicalPrices = useHistoricalTokenPrices()
  const tokenPricesByAddress = useTokenPricesByAddress()
  const tokenPricesBySymbol = useTokenPricesBySymbol()
  const historicalPricesBySymbol = useHistoricalTokenPricesBySymbol()

  // Portfolio hooks
  const tokensByOwner = useTokensByOwnerOnMultipleChains()
  const tokenBalancesByOwner = useTokenBalancesByOwnerOnMultipleChains()

  // NFT hooks
  const nftsByOwner = useNftsByOwnerOnMultipleChains()
  const ownersByContract = useOwnersByContractOnSpecificChain()
  const nftMetadataBatch = useNftMetadataByTokenIdBatchOnSpecificChain()

  // States for price section
  const [selectedToken, setSelectedToken] = useState(POPULAR_TOKENS[0])
  const [priceInterval, setPriceInterval] = useState<HistoricalPriceInterval>(HistoricalPriceInterval.ONE_DAY)
  const [symbolsToQuery, setSymbolsToQuery] = useState(['ETH', 'BTC', 'USDC'])

  // States for portfolio section
  const [portfolioAddress, setPortfolioAddress] = useState('')
  const [selectedChains, setSelectedChains] = useState<number[]>([1, 137, 10])

  // States for NFT section
  const [nftOwnerAddress, setNftOwnerAddress] = useState('')
  const [selectedNftChains, setSelectedNftChains] = useState<number[]>([1])
  const [selectedNftCollection, setSelectedNftCollection] = useState(POPULAR_NFT_COLLECTIONS[0])
  const [nftTokenIds, setNftTokenIds] = useState<string[]>(['1', '2', '3'])

  /**
   * PRICE SECTION FUNCTIONALITY
   */

  // Fetch current price by address when component mounts or token changes
  useEffect(() => {
    if (selectedToken) {
      tokenPricesByAddress.fetchTokenPrice({
        addresses: [{ chainId: selectedToken.chainId, address: selectedToken.address }]
      })
    }
  }, [selectedToken, tokenPricesByAddress])

  // Fetch prices by symbol
  const handleFetchPricesBySymbol = () => {
    tokenPricesBySymbol.fetchTokenPriceBySymbol({
      symbols: symbolsToQuery
    })
  }

  // Fetch historical prices for selected token
  const handleFetchHistoricalPrices = () => {
    const endTime = new Date()
    const startTime = new Date()

    // Set start time based on interval
    switch (priceInterval) {
      case HistoricalPriceInterval.FIVE_MINUTE:
        startTime.setHours(endTime.getHours() - 24) // Last 24 hours
        break
      case HistoricalPriceInterval.ONE_HOUR:
        startTime.setDate(endTime.getDate() - 7) // Last week
        break
      case HistoricalPriceInterval.ONE_DAY:
        startTime.setMonth(endTime.getMonth() - 1) // Last month
        break
    }

    historicalPrices.fetchHistoricalPrices({
      chainId: selectedToken.chainId,
      address: selectedToken.address,
      interval: priceInterval,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString()
    })
  }

  // Fetch historical prices by symbol
  const handleFetchHistoricalBySymbol = () => {
    const endTime = new Date()
    const startTime = new Date()
    startTime.setMonth(endTime.getMonth() - 1) // Last month

    historicalPricesBySymbol.fetchHistoricalPricesBySymbol({
      symbol: selectedToken.symbol,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      interval: HistoricalPriceInterval.ONE_DAY
    })
  }

  /**
   * PORTFOLIO SECTION FUNCTIONALITY
   */

  const handleFetchTokensByOwner = () => {
    const address = portfolioAddress || userAddress
    if (!address) return

    tokensByOwner.fetchTokensByOwnerOnMultipleChains({
      walletAddress: address,
      chainIds: selectedChains,
      withMetadata: true,
      withPrices: true,
      includeNativeTokens: true
    })
  }

  const handleFetchTokenBalances = () => {
    const address = portfolioAddress || userAddress
    if (!address) return

    tokenBalancesByOwner.fetchTokenBalancesByOwnerOnMultipleChains({
      walletAddress: address,
      chainIds: selectedChains,
      includeNativeTokens: true
    })
  }

  /**
   * NFT SECTION FUNCTIONALITY
   */

  const handleFetchNFTs = (pageKey?: string) => {
    const address = nftOwnerAddress || userAddress
    if (!address) return

    nftsByOwner.fetchNftsByOwnerOnMultipleChains({
      ownerAddress: address,
      chainIds: selectedNftChains,
      options: {
        pageKey: pageKey ?? undefined,
        pageSize: 20,
        withMetadata: true
      }
    })
  }

  const handleFetchNftOwners = () => {
    ownersByContract.fetchOwnersByContractOnSpecificChain({
      contractAddress: selectedNftCollection.address,
      chainId: selectedNftCollection.chainId,
      options: { withTokenBalances: true }
    })
  }

  const handleFetchNftMetadataBatch = () => {
    const tokens = nftTokenIds.map(tokenId => ({
      contractAddress: selectedNftCollection.address,
      tokenId
    }))

    nftMetadataBatch.fetchNftMetadataBatchOnSpecificChain({
      tokens,
      chainId: selectedNftCollection.chainId
    })
  }

  // Internal WalletButton component
  const WalletButton = ({ className = '' }: { className?: string }) => {
    const { address, isConnected, connect, disconnect } = useWallet()

    const formatAddress = (addr: string) => {
      return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    if (isConnected && address) {
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">{formatAddress(address)}</span>
          </div>
          <Button
            onClick={disconnect}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Disconnect
          </Button>
        </div>
      )
    }

    return (
      <Button
        onClick={connect}
        className={`${className}`}
      >
        Connect Wallet
      </Button>
    )
  }

  /**
   * UI RENDERING
   */
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-4">Alchemy SDK Hooks Example</h1>
            <p className="text-gray-600">
              This example demonstrates all available Alchemy SDK hooks for blockchain data queries
            </p>
          </div>
          <WalletButton />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('prices')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'prices'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Token Prices
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'portfolio'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Portfolio
          </button>
          <button
            onClick={() => setActiveTab('nfts')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'nfts'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            NFTs
          </button>
        </div>
      </div>

      {/* Token Prices Tab */}
      {activeTab === 'prices' && (
        <div className="space-y-6">
          {/* Current Token Price by Address */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Current Token Price by Address</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Token</label>
                <select
                  value={selectedToken.address}
                  onChange={(e) => {
                    const token = POPULAR_TOKENS.find(t => t.address === e.target.value)
                    if (token) setSelectedToken(token)
                  }}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {POPULAR_TOKENS.map(token => (
                    <option key={token.address} value={token.address}>
                      {token.symbol} on Chain {token.chainId}
                    </option>
                  ))}
                </select>
              </div>

              {tokenPricesByAddress.isLoading && (
                <div className="flex items-center gap-2 text-blue-500">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading price...
                </div>
              )}

              {tokenPricesByAddress.data?.data[0] && !tokenPricesByAddress.data.data[0].error && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold">
                    ${tokenPricesByAddress.data.data[0].prices[0]?.value || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Last updated: {tokenPricesByAddress.data.data[0].prices[0]?.lastUpdatedAt}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Historical Prices */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Historical Token Prices</h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Interval</label>
                  <select
                    value={priceInterval}
                    onChange={(e) => setPriceInterval(e.target.value as HistoricalPriceInterval)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value={HistoricalPriceInterval.FIVE_MINUTE}>5 Minutes</option>
                    <option value={HistoricalPriceInterval.ONE_HOUR}>1 Hour</option>
                    <option value={HistoricalPriceInterval.ONE_DAY}>1 Day</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleFetchHistoricalPrices}
                    disabled={historicalPrices.isLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                  >
                    {historicalPrices.isLoading ? 'Loading...' : 'Fetch Historical'}
                  </button>
                </div>
              </div>

              {historicalPrices.data && (
                <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                  <p className="font-medium mb-2">
                    {historicalPrices.data.data.length} data points
                  </p>
                  <div className="space-y-1">
                    {historicalPrices.data.data.slice(0, 10).map((point, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{new Date(point.timestamp).toLocaleString()}</span>
                        <span className="font-medium">${point.value}</span>
                      </div>
                    ))}
                    {historicalPrices.data.data.length > 10 && (
                      <p className="text-sm text-gray-500 mt-2">
                        ... and {historicalPrices.data.data.length - 10} more
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Historical Prices by Symbol */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Historical Token Prices by Symbol</h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Token Symbol</label>
                  <select
                    value={selectedToken.symbol}
                    onChange={(e) => {
                      const token = POPULAR_TOKENS.find(t => t.symbol === e.target.value)
                      if (token) setSelectedToken(token)
                    }}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {POPULAR_TOKENS.map(token => (
                      <option key={token.symbol} value={token.symbol}>
                        {token.symbol}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleFetchHistoricalBySymbol}
                    disabled={historicalPricesBySymbol.isLoading}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300"
                  >
                    {historicalPricesBySymbol.isLoading ? 'Loading...' : 'Fetch Historical by Symbol'}
                  </button>
                </div>
              </div>

              {historicalPricesBySymbol.data && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="mb-3">
                    <h3 className="font-semibold text-lg">{historicalPricesBySymbol.data.symbol}</h3>
                    <p className="text-sm text-gray-600">
                      {historicalPricesBySymbol.data.currency.toUpperCase()} · {historicalPricesBySymbol.data.data.length} data points
                    </p>
                  </div>

                  {/* Price chart visualization */}
                  <div className="mb-4">
                    <div className="h-40 bg-white rounded p-3 border">
                      <div className="h-full flex items-end justify-between gap-1">
                        {historicalPricesBySymbol.data.data.slice(-20).map((point, index) => {
                          const values = historicalPricesBySymbol.data!.data.slice(-20).map(p => parseFloat(p.value))
                          const min = Math.min(...values)
                          const max = Math.max(...values)
                          const height = ((parseFloat(point.value) - min) / (max - min)) * 100

                          return (
                            <div
                              key={index}
                              className="flex-1 bg-purple-500 hover:bg-purple-600 transition-colors rounded-t"
                              style={{ height: `${height}%` }}
                              title={`$${point.value} at ${new Date(point.timestamp).toLocaleString()}`}
                            />
                          )
                        })}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-center">Last 20 data points</p>
                  </div>

                  {/* Recent prices list */}
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {historicalPricesBySymbol.data.data.slice(-10).reverse().map((point, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{new Date(point.timestamp).toLocaleString()}</span>
                        <span className="font-medium">${parseFloat(point.value).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {historicalPricesBySymbol.error && (
                <div className="bg-red-50 p-3 rounded text-red-700 text-sm">
                  Error: {historicalPricesBySymbol.error.message}
                </div>
              )}
            </div>
          </div>

          {/* Prices by Symbol */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Token Prices by Symbol</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Token Symbols (comma separated)</label>
                <input
                  type="text"
                  value={symbolsToQuery.join(', ')}
                  onChange={(e) => setSymbolsToQuery(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  placeholder="ETH, BTC, USDC"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <button
                onClick={handleFetchPricesBySymbol}
                disabled={tokenPricesBySymbol.isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
              >
                {tokenPricesBySymbol.isLoading ? 'Loading...' : 'Fetch Prices'}
              </button>

              {tokenPricesBySymbol.data && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tokenPricesBySymbol.data.data.map((token) => (
                    <div key={token.symbol} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-bold text-lg">{token.symbol}</h3>
                      {!token.error && token.prices && token.prices.length > 0 && token.prices[0] ? (
                        <>
                          <p className="text-2xl">${token.prices[0].value}</p>
                          <p className="text-xs text-gray-600">
                            {new Date(token.prices[0].lastUpdatedAt).toLocaleString()}
                          </p>
                        </>
                      ) : (
                        <p className="text-red-500">Price unavailable</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Tab */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          {/* Wallet Connection Notice */}
          {!userAddress && !portfolioAddress && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-yellow-800">
                  Connect your wallet or enter an address to view portfolio data
                </p>
              </div>
            </div>
          )}
          {/* Portfolio Settings */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Portfolio Query Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Wallet Address (leave empty to use connected wallet)
                </label>
                <input
                  type="text"
                  value={portfolioAddress}
                  onChange={(e) => setPortfolioAddress(e.target.value)}
                  placeholder={userAddress ? `Connected: ${userAddress}` : "0x..."}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Select Chains</label>
                <div className="flex flex-wrap gap-2">
                  {SUPPORTED_CHAINS.map(chain => (
                    <label key={chain.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedChains.includes(chain.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedChains([...selectedChains, chain.id])
                          } else {
                            setSelectedChains(selectedChains.filter(id => id !== chain.id))
                          }
                        }}
                        className="rounded"
                      />
                      <span>{chain.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tokens with Metadata and Prices */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Tokens by Wallet (Full Data)</h2>
              <button
                onClick={handleFetchTokensByOwner}
                disabled={tokensByOwner.isLoading || (!portfolioAddress && !userAddress)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
              >
                {tokensByOwner.isLoading ? 'Loading...' : 'Fetch Tokens'}
              </button>
            </div>

            {tokensByOwner.data && (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {tokensByOwner.data.data.tokens.map((token, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {token.tokenMetadata?.logo && (
                        <img
                          src={token.tokenMetadata.logo}
                          alt={token.tokenMetadata.symbol || 'Token'}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-medium">
                          {token.tokenMetadata?.name || 'Unknown Token'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {token.tokenMetadata?.symbol || 'N/A'} on {token.network}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">
                        {formatUnits(BigInt(token.tokenBalance), token.tokenMetadata?.decimals ?? 18)}
                      </p>
                      {token.tokenPrices && token.tokenPrices.length > 0 && token.tokenPrices[0] && (
                        <p className="text-sm text-gray-600">
                          ${token.tokenPrices[0].value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Token Balances (Simplified) */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Token Balances (Simplified)</h2>
              <button
                onClick={handleFetchTokenBalances}
                disabled={tokenBalancesByOwner.isLoading || (!portfolioAddress && !userAddress)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300"
              >
                {tokenBalancesByOwner.isLoading ? 'Loading...' : 'Fetch Balances'}
              </button>
            </div>

            {tokenBalancesByOwner.data && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tokenBalancesByOwner.data.data.tokens.slice(0, 10).map((token, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium">
                      {token.network}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {token.tokenAddress || 'Native Token'}
                    </p>
                    <p>
                        raw amount in wei: {token.tokenBalance}
                    </p>
                    <p>
                        amount assuming decimals of 18: <span className="font-bold">{formatUnits(BigInt(token.tokenBalance), 18)}</span>
                    </p>
                  </div>
                ))}
                {tokenBalancesByOwner.data.data.tokens.length > 10 && (
                  <p className="text-sm text-gray-500 col-span-full">
                    ... and {tokenBalancesByOwner.data.data.tokens.length - 10} more tokens
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* NFTs Tab */}
      {activeTab === 'nfts' && (
        <div className="space-y-6">
          {/* Wallet Connection Notice */}
          {!userAddress && !nftOwnerAddress && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-yellow-800">
                  Connect your wallet or enter an address to view NFT data
                </p>
              </div>
            </div>
          )}
          {/* NFT Query Settings */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">NFT Query Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Wallet Address (leave empty to use connected wallet)
                </label>
                <input
                  type="text"
                  value={nftOwnerAddress}
                  onChange={(e) => setNftOwnerAddress(e.target.value)}
                  placeholder={userAddress ? `Connected: ${userAddress}` : "0x..."}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Select Chains for NFT Search</label>
                <div className="flex flex-wrap gap-2">
                  {SUPPORTED_CHAINS.map(chain => (
                    <label key={chain.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedNftChains.includes(chain.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedNftChains([...selectedNftChains, chain.id])
                          } else {
                            setSelectedNftChains(selectedNftChains.filter(id => id !== chain.id))
                          }
                        }}
                        className="rounded"
                      />
                      <span>{chain.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* NFTs by Owner with Pagination */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">NFTs Owned (Paginated)</h2>
              <button
                onClick={() => handleFetchNFTs()}
                disabled={nftsByOwner.isLoading || (!nftOwnerAddress && !userAddress)}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300"
              >
                {nftsByOwner.isLoading ? 'Loading...' : 'Fetch NFTs'}
              </button>
            </div>

            {nftsByOwner.data && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {nftsByOwner.data.data.ownedNfts.map((nft, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                      {nft.metadata?.image?.cachedUrl || nft.metadata?.image?.originalUrl || nft.metadata?.raw?.metadata?.image ? (
                        <img
                          src={nft.metadata?.image?.cachedUrl || nft.metadata?.image?.originalUrl || nft.metadata?.raw?.metadata?.image || ''}
                          alt={nft.metadata?.name || 'NFT'}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=No+Image'
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}
                      <div className="p-3">
                        <p className="font-medium text-sm truncate">
                          {nft.metadata?.name || `Token #${nft.tokenId}`}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {nft.metadata?.collection?.name || 'Unknown Collection'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {nft.network}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Total NFTs: {nftsByOwner.data.data.totalCount}
                  </p>
                  {nftsByOwner.data.data.pageKey && (
                    <button
                      onClick={() => handleFetchNFTs(nftsByOwner.data?.data.pageKey ?? undefined)}
                      disabled={nftsByOwner.isLoading}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300"
                    >
                      Load More
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* NFT Collection Owners */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">NFT Collection Owners</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select NFT Collection</label>
                <select
                  value={selectedNftCollection.address}
                  onChange={(e) => {
                    const collection = POPULAR_NFT_COLLECTIONS.find(c => c.address === e.target.value)
                    if (collection) setSelectedNftCollection(collection)
                  }}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {POPULAR_NFT_COLLECTIONS.map(collection => (
                    <option key={collection.address} value={collection.address}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleFetchNftOwners}
                disabled={ownersByContract.isLoading}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-300"
              >
                {ownersByContract.isLoading ? 'Loading...' : 'Fetch Owners'}
              </button>

                              {ownersByContract.data && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium mb-2">
                    Total Unique Owners: {ownersByContract.data.owners?.length || 0}
                  </p>
                  {ownersByContract.data.owners && (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {ownersByContract.data.owners.slice(0, 10).map((owner: NftContractOwner, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <code className="bg-gray-200 px-2 py-1 rounded">
                            {owner.ownerAddress.slice(0, 10)}...{owner.ownerAddress.slice(-8)}
                          </code>
                          {owner.tokenBalances && (
                            <div className="text-xs text-gray-500">
                              {owner.tokenBalances.length} tokens
                            </div>
                          )}
                        </div>
                      ))}
                      {ownersByContract.data.owners.length > 10 && (
                        <p className="text-sm text-gray-500 mt-2">
                          ... and {ownersByContract.data.owners.length - 10} more owners
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* NFT Metadata Batch */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">NFT Metadata Batch Fetch</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Token IDs (comma separated)
                </label>
                <input
                  type="text"
                  value={nftTokenIds.join(', ')}
                  onChange={(e) => setNftTokenIds(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  placeholder="1, 2, 3"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <button
                onClick={handleFetchNftMetadataBatch}
                disabled={nftMetadataBatch.isLoading || nftTokenIds.length === 0}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-300"
              >
                {nftMetadataBatch.isLoading ? 'Loading...' : 'Fetch Metadata'}
              </button>

              {nftMetadataBatch.data && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {nftMetadataBatch.data.nfts.map((nft: NftOwnershipResponseWithMetadata, index: number) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      {nft.image?.cachedUrl || nft.image?.originalUrl || nft.raw?.metadata?.image ? (
                        <img
                          src={nft.image?.cachedUrl || nft.image?.originalUrl || nft.raw?.metadata?.image || ''}
                          alt={nft.name || 'NFT'}
                          className="w-full h-32 object-cover rounded mb-3"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image'
                          }}
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}
                      <h3 className="font-bold">
                        {nft.name || nft.raw?.metadata?.name || `Token #${nft.tokenId}`}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {nft.description || nft.raw?.metadata?.description || 'No description'}
                      </p>
                      {nft.raw?.metadata?.attributes && nft.raw?.metadata?.attributes.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium">Attributes:</p>
                          {nft.raw?.metadata?.attributes.slice(0, 3).map((attr: { trait_type?: string; value?: string }, attrIndex: number) => (
                            <p key={attrIndex} className="text-xs text-gray-600">
                              {attr.trait_type || 'Unknown'}: {attr.value || 'Unknown'}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * SUMMARY FOR AI ASSISTANTS
 *
 * This example demonstrates comprehensive usage of all Alchemy SDK hooks:
 *
 * 1. Price Hooks:
 *    - useHistoricalTokenPrices: Fetch historical prices for a token by address
 *    - useTokenPricesByAddress: Get current prices for tokens by contract address
 *    - useTokenPricesBySymbol: Get current prices by token symbols (ETH, BTC, etc)
 *    - useHistoricalTokenPricesBySymbol: Get historical prices by symbol
 *
 * 2. Portfolio Hooks:
 *    - useTokensByOwnerOnMultipleChains: Get all tokens with metadata and prices across chains
 *    - useTokenBalancesByOwnerOnMultipleChains: Get simplified token balances across chains
 *
 * 3. NFT Hooks:
 *    - useNftsByOwnerOnMultipleChains: Get NFTs owned by address with pagination support
 *    - useOwnersByContractOnSpecificChain: Get all owners of an NFT collection
 *    - useNftMetadataByTokenIdBatchOnSpecificChain: Batch fetch NFT metadata
 *
 * Key Patterns:
 * - Always handle loading, error, and data states
 * - Provide clear user feedback with loading spinners and error messages
 * - Use pagination for NFT queries to handle large collections
 * - Support multi-chain queries where applicable
 * - Format data appropriately (addresses, decimals, timestamps)
 * - Handle edge cases like missing images or metadata gracefully
 */
