import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt, useConnect, useSwitchChain, useDisconnect } from 'wagmi'
import { useWallet } from '@/hooks/useWallet'
import { parseUnits, formatUnits, createPublicClient, http, defineChain, parseAbiItem } from 'viem'
import { relayAPI } from '@/lib/relay/api'
import type { RelayChain, RelayCurrency, RelayQuote } from '@/lib/relay/types'
import { alchemy, getAlchemyNetwork, alchemySettings } from '@/lib/alchemy/config'
import { config } from '@/config'
import { Network as AlchemyNetwork } from 'alchemy-sdk'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { ArrowDownUp, TrendingUp, Trophy, Share2, Flame, X, ChevronDown, Wallet, Settings, Gift } from 'lucide-react'
import { secureStorage } from '@/lib/security/storage'
import { validateAmount, validateSlippage, sanitizeInput } from '@/lib/security/validation'
import { quoteRateLimiter } from '@/lib/security/rateLimit'

interface TrendingToken {
  address: string
  chainId: number
  symbol: string
  name: string
  logoURI?: string
  volume24h?: number
  priceChange24h?: number
}

interface SwapHistory {
  id: string
  type: 'swap' | 'bridge' | 'batch'
  fromToken: string
  fromTokenSymbol: string
  fromTokenDecimals: number
  fromTokenLogo?: string
  toToken: string
  toTokenSymbol: string
  toTokenDecimals: number
  toTokenLogo?: string
  fromAmount: string
  toAmount: string
  fromChain: string
  fromChainId: number
  fromChainIcon?: string
  toChain: string
  toChainId: number
  toChainIcon?: string
  status: string
  timestamp: number
  completedAt?: number
  txHash?: string
  inTxHash?: string
  batchTokens?: Array<{
    symbol: string
    amount: string
    logo?: string
    address: string
    usdValue?: string
  }>
  fromAmountUsd?: string
  toAmountUsd?: string
}

interface UserStreak {
  currentStreak: number
  lastSwapTimestamp: number
  totalSwaps: number
}

interface LeaderboardEntry {
  address: string
  swapCount: number
  volume: string
  rank: number
}

interface WalletToken {
  token: RelayCurrency
  balance: string
  balanceFormatted: string
  balanceUsd?: string
}

const STREAK_MESSAGES = [
  "🔥 Streak alive! Keep it going!",
  "💪 You're on fire! Streak extended!",
  "⚡ Unstoppable! Streak continues!",
  "🎯 Perfect timing! Streak maintained!",
  "🌟 Amazing! Your streak grows!",
  "🚀 To the moon! Streak extended!",
  "💎 Diamond hands! Streak alive!",
  "🎊 Fantastic! Keep the momentum!",
  "🏆 Champion move! Streak continues!",
  "✨ Brilliant! Your streak shines!",
]

export default function RelaySwap() {
  const { address, isConnected, chainId: connectedChainId, connector } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect: wagmiDisconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const [chains, setChains] = useState<RelayChain[]>([])
  const [fromChain, setFromChain] = useState<RelayChain | null>(null)
  const [toChain, setToChain] = useState<RelayChain | null>(null)
  const [fromToken, setFromToken] = useState<RelayCurrency | null>(null)
  const [toToken, setToToken] = useState<RelayCurrency | null>(null)
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [quote, setQuote] = useState<RelayQuote | null>(null)
  const [isLoadingQuote, setIsLoadingQuote] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)
  const [slippage, setSlippage] = useState('0.1')
  const [searchTerm, setSearchTerm] = useState('')
  const [tokenSearchTerm, setTokenSearchTerm] = useState('')
  const [isChainSelectOpen, setIsChainSelectOpen] = useState(false)
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false)
  const [selectingFor, setSelectingFor] = useState<'from' | 'to' | 'batch' | 'revoke'>('from')
  const [currencies, setCurrencies] = useState<RelayCurrency[]>([])
  const [fromCurrencies, setFromCurrencies] = useState<RelayCurrency[]>([])
  const [toCurrencies, setToCurrencies] = useState<RelayCurrency[]>([])
  const [trendingTokens, setTrendingTokens] = useState<TrendingToken[]>([])
  const [swapHistory, setSwapHistory] = useState<SwapHistory[]>([])
  const [userStreak, setUserStreak] = useState<UserStreak>({ currentStreak: 0, lastSwapTimestamp: 0, totalSwaps: 0 })
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAirdrops, setShowAirdrops] = useState(false)
  const [batchTokens, setBatchTokens] = useState<WalletToken[]>([])
  const [walletTokens, setWalletTokens] = useState<WalletToken[]>([])
  const [contractAddressSearch, setContractAddressSearch] = useState('')
  const [swapSources, setSwapSources] = useState<string[]>([])
  const [enabledSources, setEnabledSources] = useState<Record<string, boolean>>({})
  const [isLoadingBatchTokens, setIsLoadingBatchTokens] = useState(false)
  const [batchChain, setBatchChain] = useState<RelayChain | null>(null)
  const [recipientAddress, setRecipientAddress] = useState('')
  const [fromTokenPrice, setFromTokenPrice] = useState<number>(0)
  const [toTokenPrice, setToTokenPrice] = useState<number>(0)
  const [currentSwapRequestId, setCurrentSwapRequestId] = useState<string | null>(null)
  const [currentSwapChainId, setCurrentSwapChainId] = useState<number | null>(null)
  const [solanaAddress, setSolanaAddress] = useState<string | null>(null)
  const [customBalances, setCustomBalances] = useState<{
    from?: { value: bigint; decimals: number; symbol: string }
    to?: { value: bigint; decimals: number; symbol: string }
  }>({})
  const [inputMode, setInputMode] = useState<'token' | 'usd'>('token')
  const [usdAmount, setUsdAmount] = useState('')
  const [activeTab, setActiveTab] = useState('swap')
  const [batchQuote, setBatchQuote] = useState<RelayQuote | null>(null)
  const [isLoadingBatchQuote, setIsLoadingBatchQuote] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [externalSearchResults, setExternalSearchResults] = useState<RelayCurrency[]>([])
  const [isSearchingExternal, setIsSearchingExternal] = useState(false)
  const [revokeChain, setRevokeChain] = useState<RelayChain | null>(null)
  const [approvals, setApprovals] = useState<Array<{
    token: RelayCurrency
    spender: string
    spenderName?: string
    allowance: string
    allowanceFormatted: string
    riskLevel?: 'high' | 'medium' | 'low'
  }>>([])
  const [isLoadingApprovals, setIsLoadingApprovals] = useState(false)
  const [isRevoking, setIsRevoking] = useState(false)
  const [selectedApprovals, setSelectedApprovals] = useState<Set<number>>(new Set())
  const [debugInfo, setDebugInfo] = useState<string>('')
  const [airdrops, setAirdrops] = useState<Array<{
    id: string
    name: string
    description: string
    protocol: string
    chainId: number
    chainName: string
    tokenSymbol: string
    amount: string
    amountUsd?: string
    claimUrl?: string
    contractAddress?: string
    isEligible: boolean
    isClaimed: boolean
    claimDeadline?: number
    logo?: string
    type: 'standard' | 'clanker' | 'farcaster'
  }>>([])
  const [isLoadingAirdrops, setIsLoadingAirdrops] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [portfolioData, setPortfolioData] = useState<{
    totalValueUsd: number
    chains: Array<{
      chainId: number
      chainName: string
      valueUsd: number
      tokens: Array<{
        address: string
        symbol: string
        name: string
        balance: string
        balanceFormatted: string
        valueUsd: number
        priceUsd: number
        logo?: string
      }>
    }>
  } | null>(null)
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(false)
  const [portfolioPnl, setPortfolioPnl] = useState<{
    total: number
    percentage: number
    tokens: Array<{ symbol: string; pnl: number; percentage: number }>
  } | null>(null)

  const { sendTransaction, data: txHash, isPending: isTxPending, error: txError } = useSendTransaction()
  const { isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  // EVM balance hooks - only used for EVM chains
  const { data: evmFromBalance, refetch: refetchFromBalance } = useBalance({
    address: address as `0x${string}` | undefined,
    chainId: fromChain?.id,
    token: fromToken?.address !== '0x0000000000000000000000000000000000000000' ? fromToken?.address as `0x${string}` : undefined,
    query: {
      enabled: fromChain?.vmType === 'evm' || !fromChain?.vmType,
    },
  })

  const { data: evmToBalance, refetch: refetchToBalance } = useBalance({
    address: address as `0x${string}` | undefined,
    chainId: toChain?.id,
    token: toToken?.address !== '0x0000000000000000000000000000000000000000' ? toToken?.address as `0x${string}` : undefined,
    query: {
      enabled: toChain?.vmType === 'evm' || !toChain?.vmType,
    },
  })

  // Use EVM balance or custom balance based on chain type
  const fromBalance = (fromChain?.vmType === 'evm' || !fromChain?.vmType) ? evmFromBalance : customBalances.from
  const toBalance = (toChain?.vmType === 'evm' || !toChain?.vmType) ? evmToBalance : customBalances.to

  useEffect(() => {
    sdk.actions.ready().catch(() => {})
  }, [])

  // Detect Solana wallet
  useEffect(() => {
    const detectSolanaWallet = async () => {
      try {
        // Check if window.solana exists (Phantom, Solflare, etc.)
        interface SolanaWindow extends Window {
          solana?: {
            isConnected: boolean
            publicKey?: { toString: () => string }
            connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>
          }
        }
        
        const solanaWallet = (window as SolanaWindow).solana
        
        if (solanaWallet) {
          // Check if already connected
          if (solanaWallet.isConnected && solanaWallet.publicKey) {
            const pubKey = solanaWallet.publicKey.toString()
            console.log('Solana wallet detected:', pubKey)
            setSolanaAddress(pubKey)
          } else {
            // Try to connect silently
            try {
              const response = await solanaWallet.connect({ onlyIfTrusted: true })
              if (response.publicKey) {
                const pubKey = response.publicKey.toString()
                console.log('Solana wallet connected:', pubKey)
                setSolanaAddress(pubKey)
              }
            } catch (err) {
              // User hasn't approved this site yet
              console.log('Solana wallet not connected yet')
            }
          }
        }
      } catch (error) {
        console.error('Error detecting Solana wallet:', error)
      }
    }

    detectSolanaWallet()
  }, [])

  useEffect(() => {
    loadChains()
    loadUserData()
    loadTrendingTokens()
    loadSwapSources()
  }, [])

  useEffect(() => {
    if (chains.length > 0 && !batchChain) {
      const baseChain = chains.find(c => c.id === 8453) || chains[0]
      setBatchChain(baseChain)
    }
  }, [chains])

  useEffect(() => {
    if (fromToken && fromChain) {
      fetchTokenPrice(fromToken.address, fromChain.id, 'from')
    }
  }, [fromToken, fromChain])

  // Update USD amount when price changes
  useEffect(() => {
    if (inputMode === 'usd' && usdAmount && fromTokenPrice > 0) {
      setFromAmount((parseFloat(usdAmount) / fromTokenPrice).toString())
    } else if (inputMode === 'token' && fromAmount && fromTokenPrice > 0) {
      setUsdAmount((parseFloat(fromAmount) * fromTokenPrice).toFixed(2))
    }
  }, [fromTokenPrice])

  useEffect(() => {
    if (toToken && toChain) {
      fetchTokenPrice(toToken.address, toChain.id, 'to')
    }
  }, [toToken, toChain])

  useEffect(() => {
    if (fromChain) {
      // Clear fromToken if it doesn't belong to the new chain
      if (fromToken && fromToken.chainId !== fromChain.id) {
        setFromToken(null)
      }
      loadCurrencies(fromChain.id, 'from')
    }
  }, [fromChain])

  useEffect(() => {
    if (toChain) {
      // Clear toToken if it doesn't belong to the new chain
      if (toToken && toToken.chainId !== toChain.id) {
        setToToken(null)
      }
      loadCurrencies(toChain.id, 'to')
    }
  }, [toChain])

  useEffect(() => {
    if (fromToken && toToken && fromAmount && fromChain && toChain && address) {
      const debounce = setTimeout(() => {
        fetchQuote()
      }, 500)
      return () => clearTimeout(debounce)
    }
  }, [fromToken, toToken, fromAmount, fromChain, toChain, address])

  useEffect(() => {
    if (address && chains.length > 0) {
      loadSwapHistory()
      loadUserStreak()
      checkAirdrops()
      registerForNotifications()
      
      // Check for new airdrops every 5 minutes
      const airdropInterval = setInterval(() => {
        checkAirdrops()
      }, 5 * 60 * 1000)
      
      return () => clearInterval(airdropInterval)
    }
  }, [address, chains])

  const registerForNotifications = async () => {
    if (!address) return
    
    try {
      // Get Farcaster FID if available
      let fid: string | undefined
      try {
        const context = await sdk.context
        fid = context?.user?.fid?.toString()
      } catch (error) {
        console.log('Not in Farcaster context')
      }
      
      // Register user for airdrop notifications
      const response = await fetch('/api/register-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          fid,
        }),
      })
      
      if (response.ok) {
        console.log('Registered for airdrop notifications')
      }
    } catch (error) {
      console.error('Failed to register for notifications:', error)
    }
  }

  useEffect(() => {
    loadLeaderboard()
  }, [])

  useEffect(() => {
    if (address && fromChain && isConnected) {
      loadWalletTokens()
    }
  }, [address, fromChain, isConnected])

  useEffect(() => {
    if (batchChain) {
      const vmType = batchChain.vmType || 'evm'
      // For EVM chains, need EVM wallet connected
      // For Solana chains, need Solana wallet connected
      const hasRequiredWallet = (vmType === 'svm' && solanaAddress) || 
                                ((vmType === 'evm' || vmType === 'hypevm') && address && isConnected)
      
      if (hasRequiredWallet) {
        loadBatchWalletTokens()
      }
    }
  }, [address, batchChain, isConnected, solanaAddress])

  // Fetch batch quote when batch tokens or destination changes
  useEffect(() => {
    if (batchTokens.length > 0 && toToken && toChain && batchChain && address) {
      const debounce = setTimeout(() => {
        fetchBatchQuote()
      }, 500)
      return () => clearTimeout(debounce)
    } else {
      setBatchQuote(null)
    }
  }, [batchTokens, toToken, toChain, batchChain, address])

  // Load approvals when revoke chain changes
  useEffect(() => {
    if (revokeChain && address && isConnected) {
      loadApprovals()
    } else {
      setApprovals([])
    }
  }, [revokeChain, address, isConnected])

  // Load portfolio when tab changes to portfolio
  useEffect(() => {
    if (activeTab === 'portfolio' && address && isConnected) {
      loadPortfolio()
    }
  }, [activeTab, address, isConnected])

  // External token search when contract address is pasted
  useEffect(() => {
    const searchExternally = async () => {
      // Check if the search term looks like a contract address (0x followed by 40 hex chars)
      const isContractAddress = /^0x[a-fA-F0-9]{40}$/.test(tokenSearchTerm.trim())
      
      if (isContractAddress && tokenSearchTerm.trim().length === 42) {
        setIsSearchingExternal(true)
        try {
          const chainId = selectingFor === 'from' 
            ? fromChain?.id 
            : selectingFor === 'to' 
            ? toChain?.id 
            : batchChain?.id
          
          if (!chainId) {
            console.log('No chain selected for external search')
            setIsSearchingExternal(false)
            return
          }
          
          console.log('Searching externally for token:', tokenSearchTerm, 'on chain:', chainId)
          
          const results = await relayAPI.getCurrencies({
            address: tokenSearchTerm.trim(),
            chainIds: [chainId],
            useExternalSearch: true,
            limit: 10,
          })
          
          console.log('External search results:', results)
          setExternalSearchResults(results)
        } catch (error) {
          console.error('External search failed:', error)
          setExternalSearchResults([])
        } finally {
          setIsSearchingExternal(false)
        }
      } else {
        setExternalSearchResults([])
      }
    }
    
    const debounce = setTimeout(searchExternally, 300)
    return () => clearTimeout(debounce)
  }, [tokenSearchTerm, selectingFor, fromChain, toChain, batchChain])

  // Fetch Solana balance for from chain
  useEffect(() => {
    if (fromChain && fromToken && fromChain.vmType === 'svm' && solanaAddress) {
      fetchSolanaBalance(fromToken.address, fromToken.decimals, fromToken.symbol, 'from')
    }
  }, [fromChain, fromToken, solanaAddress])

  // Fetch Solana balance for to chain
  useEffect(() => {
    if (toChain && toToken && toChain.vmType === 'svm' && solanaAddress) {
      fetchSolanaBalance(toToken.address, toToken.decimals, toToken.symbol, 'to')
    }
  }, [toChain, toToken, solanaAddress])

  // Load currencies for batch chain
  useEffect(() => {
    const loadBatchChainCurrencies = async () => {
      if (batchChain) {
        try {
          console.log('Loading currencies for batch chain:', batchChain.displayName)
          const fetchedCurrencies = await relayAPI.getCurrencies({
            chainIds: [batchChain.id],
            defaultList: true,
            limit: 100,
          })
          console.log('Loaded', fetchedCurrencies.length, 'currencies for batch chain')
          setCurrencies(fetchedCurrencies)
        } catch (error) {
          console.error('Failed to load batch chain currencies:', error)
        }
      }
    }
    
    loadBatchChainCurrencies()
  }, [batchChain])

  // Handle transaction confirmation and indexing
  useEffect(() => {
    const handleTransactionConfirmation = async () => {
      if (isTxSuccess && txHash && currentSwapRequestId && currentSwapChainId) {
        console.log('Transaction confirmed on-chain:', txHash)
        toast.success('Transaction confirmed')
        
        // Refetch balances immediately after transaction confirmation
        setTimeout(() => {
          refetchBalances()
        }, 1000) // Wait 1 second for blockchain state to update
        
        // Index the transaction with Relay after confirmation
        try {
          console.log('Indexing confirmed transaction with Relay:', txHash, 'on chain', currentSwapChainId)
          await relayAPI.indexSingleTransaction({
            txHash,
            chainId: currentSwapChainId,
          })
          console.log('Transaction indexed successfully')
        } catch (indexError) {
          console.error('Failed to index transaction:', indexError)
          // Continue anyway - Relay may auto-detect the transaction
        }
        
        // Start monitoring the swap status
        console.log('Starting swap status monitoring with requestId:', currentSwapRequestId)
        monitorSwapStatus(currentSwapRequestId)
        
        // Clear the current swap state
        setCurrentSwapRequestId(null)
        setCurrentSwapChainId(null)
      }
    }
    
    handleTransactionConfirmation()
  }, [isTxSuccess, txHash, currentSwapRequestId, currentSwapChainId])

  const refetchBalances = async () => {
    console.log('Refetching balances after swap...')
    
    // Refetch EVM balances
    if (fromChain?.vmType === 'evm' || !fromChain?.vmType) {
      await refetchFromBalance()
    }
    if (toChain?.vmType === 'evm' || !toChain?.vmType) {
      await refetchToBalance()
    }
    
    // Refetch Solana balances
    if (fromChain?.vmType === 'svm' && fromToken && solanaAddress) {
      await fetchSolanaBalance(fromToken.address, fromToken.decimals, fromToken.symbol, 'from')
    }
    if (toChain?.vmType === 'svm' && toToken && solanaAddress) {
      await fetchSolanaBalance(toToken.address, toToken.decimals, toToken.symbol, 'to')
    }
    
    console.log('Balances refetched')
  }

  const fetchSolanaBalance = async (tokenAddress: string, decimals: number, symbol: string, type: 'from' | 'to') => {
    if (!solanaAddress) {
      console.log('No Solana address available')
      return
    }

    try {
      // Use Solana RPC to fetch balance
      const solanaRpcUrl = 'https://api.mainnet-beta.solana.com'
      
      // For native SOL
      if (tokenAddress === '0x0000000000000000000000000000000000000000' || tokenAddress.toLowerCase() === 'sol') {
        const response = await fetch(solanaRpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getBalance',
            params: [solanaAddress]
          })
        })
        
        const data = await response.json()
        if (data.result && data.result.value !== undefined) {
          const balance = BigInt(data.result.value)
          setCustomBalances(prev => ({
            ...prev,
            [type]: { value: balance, decimals: 9, symbol: 'SOL' }
          }))
          console.log(`Solana ${type} balance:`, balance.toString())
        }
      } else {
        // For SPL tokens, we need to get token account balance
        // This requires the token account address, which we can derive
        const response = await fetch(solanaRpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getTokenAccountsByOwner',
            params: [
              solanaAddress,
              { mint: tokenAddress },
              { encoding: 'jsonParsed' }
            ]
          })
        })
        
        const data = await response.json()
        if (data.result && data.result.value && data.result.value.length > 0) {
          const tokenAccount = data.result.value[0]
          const balance = BigInt(tokenAccount.account.data.parsed.info.tokenAmount.amount)
          const tokenDecimals = tokenAccount.account.data.parsed.info.tokenAmount.decimals
          
          setCustomBalances(prev => ({
            ...prev,
            [type]: { value: balance, decimals: tokenDecimals, symbol }
          }))
          console.log(`Solana ${type} token balance:`, balance.toString())
        } else {
          // No token account found, balance is 0
          setCustomBalances(prev => ({
            ...prev,
            [type]: { value: 0n, decimals, symbol }
          }))
        }
      }
    } catch (error) {
      console.error('Error fetching Solana balance:', error)
      // Set balance to undefined on error
      setCustomBalances(prev => ({
        ...prev,
        [type]: undefined
      }))
    }
  }

  const loadChains = async () => {
    try {
      const { chains: fetchedChains } = await relayAPI.getChains()
      const activeChains = fetchedChains.filter(c => !c.disabled)
      setChains(activeChains)
      if (activeChains.length > 0) {
        const baseChain = activeChains.find(c => c.id === 8453) || activeChains[0]
        setFromChain(baseChain)
        setToChain(activeChains.find(c => c.id !== baseChain.id) || activeChains[1])
      }
    } catch (error) {
      console.error('Failed to load chains:', error)
      toast.error('Failed to load chains')
    }
  }

  const fetchTokenPrice = async (tokenAddress: string, chainId: number, type: 'from' | 'to') => {
    try {
      const priceData = await relayAPI.getTokenPrice({ address: tokenAddress, chainId })
      if (type === 'from') {
        setFromTokenPrice(priceData.price)
      } else {
        setToTokenPrice(priceData.price)
      }
    } catch (error) {
      console.error('Failed to fetch token price:', error)
    }
  }

  const loadCurrencies = async (chainId: number, type: 'from' | 'to') => {
    try {
      console.log('Loading currencies for chain:', chainId, 'type:', type)
      const fetchedCurrencies = await relayAPI.getCurrencies({
        chainIds: [chainId],
        defaultList: true,
        limit: 100,
      })
      console.log('Fetched currencies:', fetchedCurrencies.length, 'for chain', chainId)
      console.log('First few tokens:', fetchedCurrencies.slice(0, 5).map(c => c.symbol))
      
      if (type === 'from') {
        setFromCurrencies(fetchedCurrencies)
        setCurrencies(fetchedCurrencies)
      } else {
        setToCurrencies(fetchedCurrencies)
        setCurrencies(fetchedCurrencies)
      }
      
      if (fetchedCurrencies.length > 0) {
        const nativeToken = fetchedCurrencies.find(c => c.metadata?.isNative)
        const defaultToken = nativeToken || fetchedCurrencies[0]
        console.log('Setting default token:', defaultToken.symbol, 'for', type)
        if (type === 'from') {
          setFromToken(defaultToken)
        } else {
          // For 'to' token, ensure it's different from 'from' token if on same chain
          let selectedToken = defaultToken
          
          // If chains are the same and we have a fromToken, make sure toToken is different
          if (fromChain && toChain && fromChain.id === toChain.id && fromToken) {
            const differentToken = fetchedCurrencies.find(
              c => c.address.toLowerCase() !== fromToken.address.toLowerCase()
            )
            if (differentToken) {
              selectedToken = differentToken
              console.log('Same chain detected, selecting different token:', differentToken.symbol)
            }
          }
          
          setToToken(selectedToken)
        }
      } else {
        console.warn('No currencies found for chain:', chainId)
        toast.error('No tokens found for this chain')
      }
    } catch (error) {
      console.error('Failed to load currencies:', error)
      toast.error('Failed to load tokens')
    }
  }

  const loadWalletTokens = async () => {
    if (!address || !fromChain) return
    
    const chain = fromChain
    const isEVM = chain.vmType === 'evm' || !chain.vmType
    
    if (!isEVM) {
      return
    }

    try {
      const fetchedCurrencies = await relayAPI.getCurrencies({
        chainIds: [chain.id],
        defaultList: true,
        limit: 50,
      })
      
      setCurrencies(fetchedCurrencies)
    } catch (error) {
      console.error('Failed to load wallet tokens:', error)
    }
  }

  const loadBatchWalletTokens = async () => {
    console.log('=== loadBatchWalletTokens called ===')
    console.log('address:', address)
    console.log('solanaAddress:', solanaAddress)
    console.log('batchChain:', batchChain)
    console.log('isConnected:', isConnected)
    
    if (!batchChain) {
      console.log('Missing batchChain, returning early')
      return
    }
    
    const chain = batchChain
    const vmType = chain.vmType || 'evm'
    
    console.log('Loading batch tokens for chain:', chain.displayName, 'vmType:', vmType)
    
    // Check if we have the appropriate wallet for this VM type
    if (vmType === 'svm' && !solanaAddress) {
      toast.error('Please connect your Solana wallet to detect tokens')
      return
    }
    
    if ((vmType === 'evm' || vmType === 'hypevm') && !address) {
      toast.error('Please connect your wallet to detect tokens')
      return
    }
    
    setIsLoadingBatchTokens(true)
    try {
      console.log('Fetching currencies for chain:', chain.id)
      
      // Fetch popular tokens that are more likely to have balances
      const fetchedCurrencies = await relayAPI.getCurrencies({
        chainIds: [chain.id],
        defaultList: true,
        limit: 100, // Reduced from 250 to avoid rate limits
      })
      
      console.log('Fetched currencies:', fetchedCurrencies.length)
      
      if (fetchedCurrencies.length === 0) {
        toast.info('No tokens available for this chain')
        return
      }
      
      const tokensWithBalances: WalletToken[] = []
      
      // Handle different VM types
      if (vmType === 'evm' || vmType === 'hypevm') {
        // EVM-based chains
        console.log('Fetching EVM token balances...')
        const { createPublicClient, http, defineChain } = await import('viem')
        
        const chainConfig = defineChain({
          id: chain.id,
          name: chain.displayName,
          nativeCurrency: {
            name: chain.currency.name,
            symbol: chain.currency.symbol,
            decimals: chain.currency.decimals,
          },
          rpcUrls: {
            default: { http: [chain.httpRpcUrl] },
          },
        })
        
        const publicClient = createPublicClient({
          chain: chainConfig,
          transport: http(chain.httpRpcUrl),
        })
        
        const batchSize = 5
        for (let i = 0; i < fetchedCurrencies.length; i += batchSize) {
          const batch = fetchedCurrencies.slice(i, i + batchSize)
          
          const balancePromises = batch.map(async (currency) => {
            try {
              let balance = BigInt(0)
              
              if (currency.metadata?.isNative) {
                balance = await publicClient.getBalance({
                  address: address as `0x${string}`,
                })
              } else {
                balance = await publicClient.readContract({
                  address: currency.address as `0x${string}`,
                  abi: [{
                    name: 'balanceOf',
                    type: 'function',
                    stateMutability: 'view',
                    inputs: [{ name: 'account', type: 'address' }],
                    outputs: [{ name: 'balance', type: 'uint256' }],
                  }],
                  functionName: 'balanceOf',
                  args: [address as `0x${string}`],
                })
              }
              
              const balanceFormatted = formatUnits(balance, currency.decimals)
              
              if (parseFloat(balanceFormatted) > 0.00000001) {
                return {
                  token: currency,
                  balance: balance.toString(),
                  balanceFormatted,
                }
              }
              return null
            } catch (e) {
              return null
            }
          })
          
          const batchResults = await Promise.all(balancePromises)
          const validTokens = batchResults.filter((t): t is WalletToken => t !== null)
          tokensWithBalances.push(...validTokens)
          
          if (tokensWithBalances.length > 0) {
            const sorted = [...tokensWithBalances].sort((a, b) => parseFloat(b.balanceFormatted) - parseFloat(a.balanceFormatted))
            setWalletTokens(sorted)
            setBatchTokens(sorted.slice(0, 10))
          }
        }
      } else if (vmType === 'svm') {
        // Solana-based chains
        console.log('Fetching Solana token balances for address:', solanaAddress)
        
        if (!solanaAddress) {
          throw new Error('Solana wallet not connected')
        }
        
        const solanaRpcUrl = chain.httpRpcUrl
        
        for (const currency of fetchedCurrencies) {
          try {
            let balance = BigInt(0)
            
            if (currency.metadata?.isNative || currency.address === '0x0000000000000000000000000000000000000000') {
              // Native SOL balance
              const response = await fetch(solanaRpcUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  jsonrpc: '2.0',
                  id: 1,
                  method: 'getBalance',
                  params: [solanaAddress]
                })
              })
              
              const data = await response.json()
              if (data.result && data.result.value !== undefined) {
                balance = BigInt(data.result.value)
              }
            } else {
              // SPL token balance
              const response = await fetch(solanaRpcUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  jsonrpc: '2.0',
                  id: 1,
                  method: 'getTokenAccountsByOwner',
                  params: [
                    solanaAddress,
                    { mint: currency.address },
                    { encoding: 'jsonParsed' }
                  ]
                })
              })
              
              const data = await response.json()
              if (data.result && data.result.value && data.result.value.length > 0) {
                const tokenAccount = data.result.value[0]
                balance = BigInt(tokenAccount.account.data.parsed.info.tokenAmount.amount)
              }
            }
            
            const balanceFormatted = formatUnits(balance, currency.decimals)
            
            if (parseFloat(balanceFormatted) > 0.00000001) {
              tokensWithBalances.push({
                token: currency,
                balance: balance.toString(),
                balanceFormatted,
              })
            }
          } catch (e) {
            console.error(`Failed to fetch Solana balance for ${currency.symbol}:`, e)
          }
        }
        
        if (tokensWithBalances.length > 0) {
          const sorted = tokensWithBalances.sort((a, b) => parseFloat(b.balanceFormatted) - parseFloat(a.balanceFormatted))
          setWalletTokens(sorted)
          setBatchTokens(sorted.slice(0, 10))
        }
      } else {
        // Unsupported VM type (bvm, tvm, etc.)
        console.log(`VM type ${vmType} not yet supported for batch token detection`)
        toast.info(`Batch swap for ${chain.displayName} (${vmType}) requires manual token selection`)
        setIsLoadingBatchTokens(false)
        return
      }
      
      console.log('Tokens with balances found:', tokensWithBalances.length)
      
      const sorted = tokensWithBalances.sort((a, b) => parseFloat(b.balanceFormatted) - parseFloat(a.balanceFormatted))
      
      setWalletTokens(sorted)
      setBatchTokens(sorted.slice(0, 10))
      
      if (activeTab === 'batch') {
        if (tokensWithBalances.length > 0) {
          toast.success(`Found ${tokensWithBalances.length} tokens with balance`)
        } else {
          toast.info('No tokens with balance found. Try a different chain or add tokens manually.')
        }
      }
    } catch (error) {
      console.error('=== Failed to load wallet tokens ===')
      console.error('Error details:', error)
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
      console.error('Chain:', chain.displayName, 'ID:', chain.id)
      console.error('Address:', address)
      console.error('====================================')
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error(`Failed to load wallet tokens: ${errorMessage}`)
    } finally {
      setIsLoadingBatchTokens(false)
    }
  }

  const searchTokenByContract = async (contractAddress: string) => {
    if (!contractAddress) {
      toast.error('Please enter a contract address')
      return
    }
    
    if (!batchChain) {
      toast.error('Please select a chain first')
      return
    }
    
    try {
      console.log('Searching for token:', contractAddress, 'on chain:', batchChain.id)
      
      const results = await relayAPI.getCurrencies({
        address: contractAddress,
        chainIds: [batchChain.id],
        useExternalSearch: true,
        limit: 10,
      })
      
      console.log('Search results:', results)
      
      if (results.length > 0) {
        const foundToken = results[0]
        
        // Check if already added
        const alreadyAdded = batchTokens.some(
          wt => wt.token.address.toLowerCase() === foundToken.address.toLowerCase() &&
                wt.token.chainId === foundToken.chainId
        )
        
        if (alreadyAdded) {
          toast.info(`${foundToken.symbol} already added to batch`)
          setContractAddressSearch('')
          return
        }
        
        // Add token to batch with balance of 0 (will be fetched when executing)
        const newToken: WalletToken = {
          token: foundToken,
          balance: '0',
          balanceFormatted: '0',
        }
        
        setBatchTokens([...batchTokens, newToken])
        toast.success(`Added ${foundToken.symbol} to batch swap`)
        setContractAddressSearch('')
      } else {
        toast.error(`Token not found on ${batchChain.displayName}`)
      }
    } catch (error) {
      console.error('Failed to search token:', error)
      toast.error('Failed to search token')
    }
  }

  const fetchQuote = async () => {
    if (!fromToken || !toToken || !fromAmount || !fromChain || !toChain || !address) return

    if (fromChain.id === toChain.id && fromToken.address.toLowerCase() === toToken.address.toLowerCase()) {
      setQuote(null)
      setToAmount('')
      return
    }

    if (!quoteRateLimiter.check('quote')) {
      toast.error('Too many quote requests. Please wait a moment.')
      return
    }

    setIsLoadingQuote(true)
    try {
      const amountInWei = parseUnits(fromAmount, fromToken.decimals)
      const slippageBps = Math.floor(parseFloat(slippage) * 100).toString()
      
      const includedSources = Object.entries(enabledSources)
        .filter(([_, enabled]) => enabled)
        .map(([source]) => source)
      
      const fromVMType = fromChain.vmType || 'evm'
      const toVMType = toChain.vmType || 'evm'
      const isCrossVM = fromVMType !== toVMType
      
      // Use the appropriate address based on the origin chain type
      const userAddress = fromVMType === 'svm' ? solanaAddress : address
      
      if (!userAddress) {
        toast.error(`Please connect your ${fromVMType === 'svm' ? 'Solana' : 'EVM'} wallet`)
        setIsLoadingQuote(false)
        return
      }
      
      const quoteParams = {
        user: userAddress,
        originChainId: fromChain.id,
        destinationChainId: toChain.id,
        originCurrency: fromToken.address,
        destinationCurrency: toToken.address,
        amount: amountInWei.toString(),
        tradeType: 'EXACT_INPUT' as const,
        slippageTolerance: slippageBps,
        recipient: isCrossVM && recipientAddress ? recipientAddress : undefined,
        includedSwapSources: includedSources.length > 0 ? includedSources : undefined,
        useExternalLiquidity: isCrossVM ? true : undefined,
      }
      
      const quoteData = await relayAPI.getQuote(quoteParams)
      
      setQuote(quoteData)
      if (quoteData.details.currencyOut) {
        setToAmount(quoteData.details.currencyOut.amountFormatted)
      }
    } catch (error) {
      console.error('Failed to fetch quote:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to get quote'
      toast.error(errorMessage)
      setQuote(null)
    } finally {
      setIsLoadingQuote(false)
    }
  }

  const executeSwap = async () => {
    if (!quote || !quote.steps || quote.steps.length === 0) {
      toast.error('No quote available')
      return
    }

    if (!isConnected || !address) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!fromToken || !toToken || !fromAmount || !fromChain || !toChain) {
      toast.error('Missing swap parameters')
      return
    }

    // Validate that token chainIds match selected chains
    if (fromToken.chainId !== fromChain.id) {
      console.error('Token chainId mismatch:', {
        fromTokenChainId: fromToken.chainId,
        fromChainId: fromChain.id,
        fromToken: fromToken.symbol
      })
      toast.error(`${fromToken.symbol} is not available on ${fromChain.displayName}. Please select a different token.`)
      return
    }

    if (toToken.chainId !== toChain.id) {
      console.error('Token chainId mismatch:', {
        toTokenChainId: toToken.chainId,
        toChainId: toChain.id,
        toToken: toToken.symbol
      })
      toast.error(`${toToken.symbol} is not available on ${toChain.displayName}. Please select a different token.`)
      return
    }

    // Check if trying to swap same token on same chain
    if (fromChain.id === toChain.id && fromToken.address.toLowerCase() === toToken.address.toLowerCase()) {
      toast.error('Cannot swap the same token to itself')
      return
    }

    // Check for cross-VM swap recipient requirement
    const fromVMType = fromChain.vmType || 'evm'
    const toVMType = toChain.vmType || 'evm'
    const isCrossVM = fromVMType !== toVMType
    
    if (isCrossVM && !recipientAddress) {
      toast.error(`Recipient address required for ${toChain.displayName}`)
      return
    }

    setIsSwapping(true)

    try {
      // Get a fresh quote right before executing to ensure transaction data is current
      console.log('Getting fresh quote for execution...')
      const amountInWei = parseUnits(fromAmount, fromToken.decimals)
      const slippageBps = Math.floor(parseFloat(slippage) * 100).toString()
      
      const includedSources = Object.entries(enabledSources)
        .filter(([_, enabled]) => enabled)
        .map(([source]) => source)
      
      // Use the appropriate address based on the origin chain type
      const fromVMType = fromChain.vmType || 'evm'
      const userAddress = fromVMType === 'svm' ? solanaAddress : address
      
      if (!userAddress) {
        toast.error(`Please connect your ${fromVMType === 'svm' ? 'Solana' : 'EVM'} wallet`)
        setIsSwapping(false)
        return
      }
      
      const quoteParams = {
        user: userAddress,
        originChainId: fromChain.id,
        destinationChainId: toChain.id,
        originCurrency: fromToken.address,
        destinationCurrency: toToken.address,
        amount: amountInWei.toString(),
        tradeType: 'EXACT_INPUT' as const,
        slippageTolerance: slippageBps,
        recipient: isCrossVM && recipientAddress ? recipientAddress : undefined,
        includedSwapSources: includedSources.length > 0 ? includedSources : undefined,
        useExternalLiquidity: isCrossVM ? true : undefined,
      }
      
      console.log('=== EXECUTE SWAP DEBUG ===')
      console.log('From Chain:', fromChain.displayName, 'ID:', fromChain.id, 'vmType:', fromChain.vmType)
      console.log('To Chain:', toChain.displayName, 'ID:', toChain.id, 'vmType:', toChain.vmType)
      console.log('From Token:', fromToken.symbol, 'Address:', fromToken.address, 'ChainId:', fromToken.chainId)
      console.log('To Token:', toToken.symbol, 'Address:', toToken.address, 'ChainId:', toToken.chainId)
      console.log('ChainId Match Check:')
      console.log('  - fromToken.chainId === fromChain.id?', fromToken.chainId === fromChain.id)
      console.log('  - toToken.chainId === toChain.id?', toToken.chainId === toChain.id)
      console.log('Recipient:', recipientAddress)
      console.log('Is Cross-VM:', isCrossVM)
      console.log('Quote Params:', JSON.stringify(quoteParams, null, 2))
      console.log('=========================')
      
      const freshQuote = await relayAPI.getQuote(quoteParams)
      console.log('Fresh quote received:', freshQuote)

      // For same-chain swaps, look for 'swap' step; for cross-chain, look for 'deposit' step
      const isSameChain = fromChain.id === toChain.id
      const executionStep = freshQuote.steps.find(s => 
        s.id === 'deposit' || s.id === 'swap' || s.kind === 'transaction'
      )
      
      if (!executionStep || !executionStep.items || executionStep.items.length === 0) {
        console.error('No execution step found in quote. Available steps:', freshQuote.steps.map(s => ({ id: s.id, kind: s.kind })))
        throw new Error(`No ${isSameChain ? 'swap' : 'deposit'} step found in quote`)
      }
      
      console.log('Using execution step:', executionStep.id, 'kind:', executionStep.kind)

      const txData = executionStep.items[0].data
      
      console.log('Executing swap transaction:', {
        from: txData.from,
        to: txData.to,
        value: txData.value,
        data: txData.data?.slice(0, 20) + '...',
        chainId: txData.chainId,
        connectedChainId,
        recipientAddress,
        requestId: executionStep.requestId,
      })
      
      // CRITICAL: Verify the transaction 'from' address matches the connected wallet
      // Relay will refund if these don't match
      if (txData.from.toLowerCase() !== address.toLowerCase()) {
        console.error('Address mismatch!', {
          txDataFrom: txData.from,
          connectedAddress: address,
        })
        toast.error('Wallet address mismatch. Please ensure you are using the same wallet that requested the quote.')
        setIsSwapping(false)
        return
      }

      // Check if we need to switch chains
      if (connectedChainId !== txData.chainId) {
        console.log('Switching chain from', connectedChainId, 'to', txData.chainId)
        try {
          await switchChain({ chainId: txData.chainId })
          toast.success('Chain switched successfully')
          await new Promise(resolve => setTimeout(resolve, 500))
        } catch (switchError) {
          console.error('Failed to switch chain:', switchError)
          toast.error('Please switch to the correct network in your wallet')
          setIsSwapping(false)
          return
        }
      }

      // Prepare transaction with all fields from the quote
      // Note: wagmi's sendTransaction automatically uses the connected wallet as 'from'
      // We've already verified above that txData.from matches the connected address
      const txParams = {
        to: txData.to as `0x${string}`,
        data: txData.data as `0x${string}`,
        value: BigInt(txData.value),
        ...(txData.maxFeePerGas && { maxFeePerGas: BigInt(txData.maxFeePerGas) }),
        ...(txData.maxPriorityFeePerGas && { maxPriorityFeePerGas: BigInt(txData.maxPriorityFeePerGas) }),
      }
      
      console.log('=== TRANSACTION VALIDATION ===')
      console.log('Quote requested by:', address)
      console.log('Transaction from (in quote):', txData.from)
      console.log('Transaction to:', txData.to)
       console.log('Transaction value (expected):', txData.value)
       console.log('Transaction value (sending):', txParams.value.toString())
       console.log('Transaction data match:', txData.data === txParams.data)
       console.log('Amount in quote params:', amountInWei.toString())
       console.log('RequestId:', executionStep.requestId)
       console.log('============================')
       
       console.log('Sending transaction with params:', {
         from: address, // This will be used by wagmi automatically
         ...txParams,
         value: txParams.value.toString(),
         maxFeePerGas: txParams.maxFeePerGas?.toString(),
         maxPriorityFeePerGas: txParams.maxPriorityFeePerGas?.toString(),
       })
       
       sendTransaction(txParams, {
         onSuccess: (hash) => {
           console.log('Transaction submitted successfully:', hash)
           toast.success('Transaction submitted - waiting for confirmation...')
           
           // Store the requestId and chainId to use after transaction confirmation
           // The useEffect will handle indexing and monitoring after the tx is confirmed
           if (executionStep.requestId) {
             setCurrentSwapRequestId(executionStep.requestId)
             setCurrentSwapChainId(txData.chainId)
           } else {
             console.warn('No requestId found in execution step')
             setIsSwapping(false)
           }
         },
        onError: (error) => {
          console.error('Transaction failed:', error)
          const errorMessage = error instanceof Error ? error.message : 'Transaction failed'
          toast.error(errorMessage)
          setIsSwapping(false)
        }
      })
    } catch (error) {
      console.error('Swap execution failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to execute swap'
      toast.error(errorMessage)
      setIsSwapping(false)
    }
  }

  const monitorSwapStatus = async (requestId: string) => {
    const maxAttempts = 60
    let attempts = 0
    let lastStatus = ''

    const checkStatus = async () => {
      try {
        const status = await relayAPI.getStatus(requestId)
        
        console.log(`Swap status check ${attempts + 1}/${maxAttempts}:`, {
          status: status.status,
          details: status.details,
          inTxHashes: status.inTxHashes,
          txHashes: status.txHashes,
        })

        // Show status updates to user
        if (status.status !== lastStatus) {
          lastStatus = status.status
          
          if (status.status === 'waiting') {
            toast.info('Waiting for transaction confirmation...')
          } else if (status.status === 'pending') {
            toast.info('Processing swap...')
          } else if (status.status === 'submitted') {
            toast.info('Swap submitted to destination chain...')
          } else if (status.status === 'delayed') {
            toast.warning('Swap is taking longer than expected...')
          }
        }
        
        if (status.status === 'success') {
          toast.success('Swap completed successfully!')
          setIsSwapping(false)
          loadSwapHistory()
          updateUserStreak()
          updateLeaderboard()
          setFromAmount('')
          setToAmount('')
          setUsdAmount('')
          
          // Refetch balances to show updated amounts
          refetchBalances()
          
          return
        } else if (status.status === 'failure') {
          toast.error(`Swap failed: ${status.details || 'Unknown error'}`)
          console.error('Swap failure details:', status)
          setIsSwapping(false)
          return
        } else if (status.status === 'refunded') {
          toast.error(`Swap was refunded: ${status.details || 'Transaction could not be completed'}`)
          console.error('Swap refund details:', status)
          setIsSwapping(false)
          return
        }

        attempts++
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 2000)
        } else {
          toast.error('Swap status check timeout - please check your transaction history')
          setIsSwapping(false)
        }
      } catch (error) {
        console.error('Failed to check status:', error)
        attempts++
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 2000)
        } else {
          toast.error('Failed to monitor swap status')
          setIsSwapping(false)
        }
      }
    }

    checkStatus()
  }

  const fetchBatchQuote = async () => {
    if (!toToken || !toChain || !address || batchTokens.length === 0 || !batchChain) {
      return
    }

    setIsLoadingBatchQuote(true)
    try {
      const origins = batchTokens
        .filter(bt => parseFloat(bt.balanceFormatted) > 0)
        .map(bt => ({
          chainId: batchChain.id,
          currency: bt.token.address,
          amount: bt.balance,
        }))

      if (origins.length === 0) {
        setBatchQuote(null)
        setIsLoadingBatchQuote(false)
        return
      }

      console.log('Getting batch swap quote for', origins.length, 'tokens')

      const multiQuote = await relayAPI.getMultiInputQuote({
        user: address,
        origins,
        destinationCurrency: toToken.address,
        destinationChainId: toChain.id,
        tradeType: 'EXACT_INPUT',
      })

      console.log('Batch quote received:', multiQuote)
      setBatchQuote(multiQuote)
    } catch (error) {
      console.error('Failed to fetch batch quote:', error)
      setBatchQuote(null)
    } finally {
      setIsLoadingBatchQuote(false)
    }
  }

  const executeBatchSwap = async () => {
    if (!toToken || !toChain || !address || batchTokens.length === 0 || !batchChain) {
      toast.error('Please select chain and tokens to swap')
      return
    }

    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    // Check if we need to switch chains
    if (connectedChainId !== batchChain.id) {
      console.log('Switching chain from', connectedChainId, 'to', batchChain.id)
      try {
        await switchChain({ chainId: batchChain.id })
        toast.success('Chain switched successfully')
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (switchError) {
        console.error('Failed to switch chain:', switchError)
        toast.error('Please switch to the correct network in your wallet')
        return
      }
    }

    setIsSwapping(true)
    try {
      // Get a fresh quote for execution
      const origins = batchTokens
        .filter(bt => parseFloat(bt.balanceFormatted) > 0)
        .map(bt => ({
          chainId: batchChain.id,
          currency: bt.token.address,
          amount: bt.balance,
        }))

      if (origins.length === 0) {
        toast.error('No tokens with balance selected')
        setIsSwapping(false)
        return
      }

      console.log('Getting fresh batch swap quote for execution:', origins.length, 'tokens')

      const multiQuote = await relayAPI.getMultiInputQuote({
        user: address,
        origins,
        destinationCurrency: toToken.address,
        destinationChainId: toChain.id,
        tradeType: 'EXACT_INPUT',
      })

      console.log('Fresh batch quote received:', multiQuote)
      console.log('Steps in quote:', multiQuote.steps.map(s => ({ id: s.id, itemCount: s.items?.length })))

      // Collect all transactions to execute
      const transactions: Array<{
        to: `0x${string}`
        data: `0x${string}`
        value: bigint
        maxFeePerGas?: bigint
        maxPriorityFeePerGas?: bigint
        requestId?: string
      }> = []
      
      for (const step of multiQuote.steps) {
        console.log('Processing step:', step.id, 'items:', step.items?.length)
        
        // Multi-input quotes might use different step IDs
        if ((step.id === 'deposit' || step.id === 'swap' || step.kind === 'transaction') && step.items) {
          for (const item of step.items) {
            const txData = item.data
            console.log('Adding transaction:', {
              to: txData.to,
              value: txData.value,
              stepId: step.id,
            })
            
            transactions.push({
              to: txData.to as `0x${string}`,
              data: txData.data as `0x${string}`,
              value: BigInt(txData.value),
              ...(txData.maxFeePerGas && { maxFeePerGas: BigInt(txData.maxFeePerGas) }),
              ...(txData.maxPriorityFeePerGas && { maxPriorityFeePerGas: BigInt(txData.maxPriorityFeePerGas) }),
              requestId: step.requestId,
            })
          }
        }
      }

      console.log('Total transactions to execute:', transactions.length)

      if (transactions.length === 0) {
        console.error('No transactions found in quote steps')
        toast.error('No transactions to execute. The quote may not have generated valid transactions.')
        setIsSwapping(false)
        return
      }

      console.log(`Executing ${transactions.length} batch swap transactions...`)
      toast.info(`Submitting ${transactions.length} transaction(s)...`)
      
      // Execute transactions sequentially and wait for each to complete
      let successCount = 0
      let confirmedCount = 0
      const failedTxs: string[] = []
      const submittedHashes: string[] = []
      
      for (let i = 0; i < transactions.length; i++) {
        const tx = transactions[i]
        console.log(`Executing transaction ${i + 1}/${transactions.length}`)
        
        try {
          // Submit transaction and get hash
          const hash = await new Promise<string>((resolve, reject) => {
            sendTransaction(tx, {
              onSuccess: (hash) => {
                console.log(`Transaction ${i + 1} submitted:`, hash)
                successCount++
                resolve(hash)
              },
              onError: (error) => {
                console.error(`Transaction ${i + 1} failed:`, error)
                failedTxs.push(`Transaction ${i + 1}`)
                reject(error)
              }
            })
          })
          
          submittedHashes.push(hash)
          toast.info(`Transaction ${i + 1}/${transactions.length} submitted, waiting for confirmation...`)
          
          // Wait a bit between transactions
          if (i < transactions.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000))
          }
        } catch (error) {
          console.error(`Failed to execute transaction ${i + 1}:`, error)
          // Continue with next transaction even if one fails
        }
      }

      // Wait for all submitted transactions to be confirmed
      if (submittedHashes.length > 0) {
        toast.info(`Waiting for ${submittedHashes.length} transaction(s) to confirm...`)
        
        for (let i = 0; i < submittedHashes.length; i++) {
          try {
            // Wait for transaction receipt
            const { waitForTransactionReceipt } = await import('wagmi/actions')
            const { wagmiConfig } = await import('@/lib/blockchain/wagmi')
            
            await waitForTransactionReceipt(wagmiConfig, {
              hash: submittedHashes[i] as `0x${string}`,
            })
            
            confirmedCount++
            console.log(`Transaction ${i + 1} confirmed`)
          } catch (error) {
            console.error(`Transaction ${i + 1} confirmation failed:`, error)
          }
        }
      }

      // Only update streak and clear tokens if at least one transaction confirmed
      if (confirmedCount > 0) {
        toast.success(`Batch swap completed: ${confirmedCount}/${transactions.length} transaction(s) confirmed`)
        updateUserStreak()
        updateLeaderboard()
        loadSwapHistory()
        setBatchTokens([])
        setBatchQuote(null)
        
        // Refetch balances to show updated amounts
        refetchBalances()
        
        // Reload batch wallet tokens to update the list
        if (batchChain) {
          setTimeout(() => {
            loadBatchWalletTokens()
          }, 2000)
        }
      } else if (successCount > 0) {
        toast.warning(`${successCount} transaction(s) submitted but none confirmed yet`)
      } else {
        toast.error('All batch swap transactions failed')
      }
      
      if (failedTxs.length > 0) {
        toast.warning(`${failedTxs.length} transaction(s) failed to submit`)
      }
    } catch (error) {
      console.error('Batch swap failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Batch swap failed'
      toast.error(errorMessage)
    } finally {
      setIsSwapping(false)
    }
  }

  const loadTrendingTokens = async () => {
    try {
      const response = await fetch('https://api.warpcast.com/v2/trending-tokens')
      if (response.ok) {
        const data = await response.json()
        if (data.result?.tokens) {
          setTrendingTokens(data.result.tokens.slice(0, 10))
        }
      }
    } catch (error) {
      console.error('Failed to load trending tokens:', error)
    }
  }

  const loadSwapHistory = async () => {
    if (!address) return
    
    if (chains.length === 0) {
      console.warn('Chains not loaded yet, skipping history load')
      return
    }
    
    setIsLoadingHistory(true)
    try {
      console.log('Loading swap history with', chains.length, 'chains available')
      
      const { requests } = await relayAPI.getRequests({
        user: address,
        limit: 20,
        sortBy: 'createdAt',
        sortDirection: 'desc',
      })
      
      console.log('Received', requests.length, 'requests')
      
      const history: SwapHistory[] = await Promise.all(requests.map(async req => {
        console.log('=== Processing request:', req.id)
        console.log('Full request object:', req)
        console.log('Request data:', {
          inTxs: req.data.inTxs,
          outTxs: req.data.outTxs,
          currency: req.data.currency,
          fees: req.data.fees,
          feesUsd: req.data.feesUsd
        })
        console.log('Number of inTxs:', req.data.inTxs?.length)
        console.log('Number of outTxs:', req.data.outTxs?.length)
        
        // Get chain IDs from transactions
        const originChainId = req.data.inTxs?.[0]?.chainId
        const destChainId = req.data.outTxs?.[0]?.chainId
        
        console.log('Chain IDs:', { originChainId, destChainId })
        console.log('Available chains:', chains.length, chains.map(c => c.id))
        
        const originChain = chains.find(c => c.id === originChainId)
        const destChain = chains.find(c => c.id === destChainId)
        
        console.log('Found chains:', { 
          originChain: originChain?.displayName, 
          originChainIcon: originChain?.iconUrl,
          destChain: destChain?.displayName,
          destChainIcon: destChain?.iconUrl,
          originChainId,
          destChainId
        })
        
        // Get amounts from transaction data
        let fromAmount = '0'
        let toAmount = '0'
        let fromDecimals = 18
        let toDecimals = 18
        let fromSymbol = 'Unknown'
        let toSymbol = 'Unknown'
        let fromTokenAddress = '0x0'
        let toTokenAddress = '0x0'
        let fromTokenLogo: string | undefined
        let toTokenLogo: string | undefined
        
        // Determine transaction type
        const isSameChain = originChainId === destChainId
        const hasMultipleInputs = req.data.inTxs && req.data.inTxs.length > 1
        
        let transactionType: 'swap' | 'bridge' | 'batch' = 'swap'
        if (hasMultipleInputs) {
          transactionType = 'batch'
        } else if (!isSameChain) {
          transactionType = 'bridge'
        }
        
        console.log('Transaction type:', transactionType, { isSameChain, hasMultipleInputs, inTxsCount: req.data.inTxs?.length })
        
        // The currency field in req.data contains the token address
        const currencyAddress = req.data.currency
        
        console.log('Currency address from request:', currencyAddress)
        
        // Try to fetch currency details for both chains
        let fromCurrency: RelayCurrency | null = null
        let toCurrency: RelayCurrency | null = null
        
        // If currency address is native (0x0000...), use chain's native currency
        const isNativeCurrency = !currencyAddress || 
          currencyAddress === '0x0000000000000000000000000000000000000000' ||
          currencyAddress === '0x0000000000000000000000000000000000000001'
        
        if (isNativeCurrency) {
          console.log('Using native currency for both chains')
          
          if (originChain) {
            fromCurrency = {
              address: '0x0000000000000000000000000000000000000000',
              symbol: originChain.currency.symbol,
              name: originChain.currency.name,
              decimals: originChain.currency.decimals,
              chainId: originChainId!,
            }
          }
          
          if (destChain) {
            toCurrency = {
              address: '0x0000000000000000000000000000000000000000',
              symbol: destChain.currency.symbol,
              name: destChain.currency.name,
              decimals: destChain.currency.decimals,
              chainId: destChainId!,
            }
          }
        } else {
          // Fetch ERC-20 token details
          try {
            if (currencyAddress && originChainId) {
              console.log('Fetching from currency for:', currencyAddress, 'on chain:', originChainId)
              const currencies = await relayAPI.getCurrencies({
                address: currencyAddress,
                chainIds: [originChainId],
                limit: 1,
              })
              fromCurrency = currencies[0] || null
              console.log('From currency fetched:', {
                symbol: fromCurrency?.symbol,
                address: fromCurrency?.address,
                decimals: fromCurrency?.decimals,
                hasLogo: !!fromCurrency?.metadata?.logoURI,
                logo: fromCurrency?.metadata?.logoURI
              })
            }
          } catch (e) {
            console.error('Failed to fetch from currency:', e)
          }
          
          try {
            if (currencyAddress && destChainId) {
              console.log('Fetching to currency for:', currencyAddress, 'on chain:', destChainId)
              const currencies = await relayAPI.getCurrencies({
                address: currencyAddress,
                chainIds: [destChainId],
                limit: 1,
              })
              toCurrency = currencies[0] || null
              console.log('To currency fetched:', {
                symbol: toCurrency?.symbol,
                address: toCurrency?.address,
                decimals: toCurrency?.decimals,
                hasLogo: !!toCurrency?.metadata?.logoURI,
                logo: toCurrency?.metadata?.logoURI
              })
            }
          } catch (e) {
            console.error('Failed to fetch to currency:', e)
          }
        }
        
        // For batch swaps, collect all input tokens
        // Note: For batch swaps, all tokens are typically the same (currencyAddress)
        // but with different amounts per transaction
        let batchTokens: Array<{ symbol: string; amount: string; logo?: string; address: string; usdValue?: string }> = []
        if (transactionType === 'batch' && req.data.inTxs && req.data.inTxs.length > 1) {
          console.log('Processing batch swap with', req.data.inTxs.length, 'input transactions')
          console.log('Currency address:', currencyAddress)
          
          // Fetch the token info once for all batch transactions (they're all the same token)
          let batchTokenCurrency: RelayCurrency | null = null
          if (currencyAddress && originChainId) {
            try {
              const currencies = await relayAPI.getCurrencies({
                address: currencyAddress,
                chainIds: [originChainId],
                limit: 1,
              })
              batchTokenCurrency = currencies[0] || null
              console.log('Batch token currency:', batchTokenCurrency?.symbol, batchTokenCurrency?.address)
            } catch (e) {
              console.error('Failed to fetch batch token currency:', e)
            }
          }
          
          const tokenDecimals = batchTokenCurrency?.decimals || originChain?.currency?.decimals || 18
          const tokenSymbol = batchTokenCurrency?.symbol || originChain?.currency?.symbol || 'Unknown'
          const tokenLogo = batchTokenCurrency?.metadata?.logoURI
          const tokenAddr = batchTokenCurrency?.address || currencyAddress || '0x0'
          
          // Fetch token price for USD values
          let tokenPrice = 0
          try {
            if (tokenAddr && originChainId) {
              const priceData = await relayAPI.getTokenPrice({ 
                address: tokenAddr, 
                chainId: originChainId 
              })
              tokenPrice = priceData.price
              console.log('Batch token price:', tokenPrice, 'USD')
            }
          } catch (e) {
            console.log('Could not fetch batch token price:', e)
          }
          
          // Process each transaction to get the amount
          for (let i = 0; i < req.data.inTxs.length; i++) {
            const inTx = req.data.inTxs[i]
            try {
              let rawAmount = inTx.data?.value || '0'
              
              console.log(`=== Batch tx ${i} ===`)
              console.log('Full inTx object:', inTx)
              console.log('inTx.data:', inTx.data)
              console.log('Batch tx details:', {
                to: inTx.data?.to,
                value: rawAmount,
                dataLength: inTx.data?.data?.length,
                dataPrefix: inTx.data?.data?.substring(0, 10),
                fee: inTx.fee,
                type: inTx.type,
                chainId: inTx.chainId
              })
              
              // If value is 0, try to decode from data
              if (rawAmount === '0' && inTx.data?.data && inTx.data.data.length > 10) {
                const txData = inTx.data.data
                
                console.log('Full transaction data:', txData)
                
                try {
                  // Try standard ERC-20 transfer/approve
                  if (txData.startsWith('0xa9059cbb') || txData.startsWith('0x095ea7b3')) {
                    const amountHex = '0x' + txData.slice(-64)
                    rawAmount = BigInt(amountHex).toString()
                    console.log('Decoded from standard transfer:', rawAmount)
                  }
                  // Try multiple positions for complex calls
                  else if (txData.length >= 200) {
                    console.log('Trying to decode from complex transaction, length:', txData.length)
                    
                    // Try multiple positions where amount might be encoded
                    const positions = [
                      { name: 'position 1 (offset 10)', start: 10, end: 74 },
                      { name: 'position 2 (offset 74)', start: 74, end: 138 },
                      { name: 'position 3 (offset 138)', start: 138, end: 202 },
                      { name: 'position 4 (offset 202)', start: 202, end: 266 },
                      { name: 'last 64 chars', start: txData.length - 64, end: txData.length },
                    ]
                    
                    for (const pos of positions) {
                      try {
                        if (txData.length >= pos.end) {
                          const amountHex = '0x' + txData.substring(pos.start, pos.end)
                          const decodedAmount = BigInt(amountHex)
                          
                          console.log(`Trying ${pos.name}:`, amountHex, '=', decodedAmount.toString())
                          
                          // Check if this looks like a reasonable amount
                          if (decodedAmount > 0n && decodedAmount < BigInt('1000000000000000000000000')) {
                            // CRITICAL: Convert BigInt to string properly
                            rawAmount = decodedAmount.toString()
                            console.log(`✓ Decoded from ${pos.name}:`, rawAmount, 'type:', typeof rawAmount)
                            break
                          }
                        }
                      } catch (e) {
                        console.log(`Failed at ${pos.name}:`, e)
                      }
                    }
                  }
                } catch (e) {
                  console.error('Error decoding amount:', e)
                }
              }
              
              // Format the amount
              let amount = '0'
              console.log('About to format amount:', { 
                rawAmount, 
                rawAmountType: typeof rawAmount,
                rawAmountString: String(rawAmount),
                tokenDecimals, 
                tokenSymbol 
              })
              
              if (rawAmount && rawAmount !== '0') {
                try {
                  // Ensure rawAmount is a string
                  const rawAmountStr = String(rawAmount)
                  console.log('Converting to BigInt:', rawAmountStr)
                  const bigIntAmount = BigInt(rawAmountStr)
                  console.log('BigInt created:', bigIntAmount.toString())
                  amount = parseFloat(formatUnits(bigIntAmount, tokenDecimals)).toFixed(6)
                  console.log('Formatted amount:', amount, tokenSymbol)
                } catch (e) {
                  console.error('Error formatting amount:', e, 'rawAmount:', rawAmount, 'type:', typeof rawAmount)
                }
              } else {
                console.warn('Raw amount is zero or missing for batch tx', i)
              }
              
              console.log('Checking if amount > 0:', { amount, parsed: parseFloat(amount), isGreaterThanZero: parseFloat(amount) > 0 })
              
              // Only add if we have a valid amount
              if (parseFloat(amount) > 0) {
                const usdValue = tokenPrice > 0 
                  ? (parseFloat(amount) * tokenPrice).toFixed(2)
                  : undefined
                
                batchTokens.push({ 
                  symbol: tokenSymbol, 
                  amount, 
                  logo: tokenLogo, 
                  address: tokenAddr,
                  usdValue
                })
                console.log('Added batch token with USD:', { symbol: tokenSymbol, amount, usdValue })
              } else {
                console.warn('Skipping batch token - amount is zero:', { symbol: tokenSymbol, amount, rawAmount })
              }
            } catch (e) {
              console.error('Error processing batch tx:', e)
            }
          }
          
          console.log('Final batch tokens:', batchTokens.length, 'tokens')
          console.log('Batch tokens detail:', batchTokens)
        }
        
        // Process input transaction - fetch actual transaction to get real amounts
        if (req.data.inTxs?.[0]) {
          const inTx = req.data.inTxs[0]
          
          // Set token info
          if (fromCurrency) {
            fromDecimals = fromCurrency.decimals
            fromSymbol = fromCurrency.symbol
            fromTokenAddress = fromCurrency.address
            fromTokenLogo = fromCurrency.metadata?.logoURI || getNativeTokenLogo(fromCurrency.symbol)
          } else if (originChain) {
            fromDecimals = originChain.currency.decimals
            fromSymbol = originChain.currency.symbol
            fromTokenAddress = originChain.currency.address
            fromTokenLogo = getNativeTokenLogo(originChain.currency.symbol)
          }
          
          let rawAmount = inTx.data?.value || '0'
          
          // If we have a transaction hash, fetch the actual transaction to get precise amounts
          if (inTx.hash && rawAmount === '0' && originChain) {
            try {
              const txChainConfig = defineChain({
                id: originChainId!,
                name: originChain.displayName,
                nativeCurrency: {
                  name: originChain.currency.name,
                  symbol: originChain.currency.symbol,
                  decimals: originChain.currency.decimals,
                },
                rpcUrls: {
                  default: { http: [originChain.httpRpcUrl] },
                },
              })
              
              const txClient = createPublicClient({
                chain: txChainConfig,
                transport: http(originChain.httpRpcUrl),
              })
              
              const receipt = await txClient.getTransactionReceipt({ hash: inTx.hash as `0x${string}` })
              
              // Parse Transfer events to get actual amount
              for (const log of receipt.logs) {
                // Transfer event signature: Transfer(address,address,uint256)
                if (log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') {
                  // topics[1] = from, topics[2] = to, data = amount
                  if (log.data && log.data !== '0x') {
                    rawAmount = BigInt(log.data).toString()
                    console.log('✓ Got amount from Transfer event:', rawAmount)
                    break
                  }
                }
              }
            } catch (e) {
              console.log('Could not fetch transaction receipt:', e)
            }
          }
          
          // Fallback: decode from calldata
          if (rawAmount === '0' && inTx.data?.data && inTx.data.data.length >= 138) {
            try {
              const amountHex = '0x' + inTx.data.data.substring(74, 138)
              const decoded = BigInt(amountHex)
              if (decoded > 0n && decoded < BigInt('10000000000000000000000000000')) {
                rawAmount = decoded.toString()
                console.log('✓ Decoded from calldata:', rawAmount)
              }
            } catch (e) {
              console.log('Calldata decode failed')
            }
          }
          
          // Format amount
          if (rawAmount && rawAmount !== '0') {
            try {
              fromAmount = parseFloat(formatUnits(BigInt(rawAmount), fromDecimals)).toFixed(6)
              console.log('✓ From:', fromAmount, fromSymbol)
            } catch (e) {
              console.error('Format error:', e)
              fromAmount = '0'
            }
          }
        }
        
        // Process output transaction - fetch actual transaction to get real amounts
        if (req.data.outTxs?.[0]) {
          const outTx = req.data.outTxs[0]
          
          // Set token info
          if (toCurrency) {
            toDecimals = toCurrency.decimals
            toSymbol = toCurrency.symbol
            toTokenAddress = toCurrency.address
            toTokenLogo = toCurrency.metadata?.logoURI || getNativeTokenLogo(toCurrency.symbol)
          } else if (destChain) {
            toDecimals = destChain.currency.decimals
            toSymbol = destChain.currency.symbol
            toTokenAddress = destChain.currency.address
            toTokenLogo = getNativeTokenLogo(destChain.currency.symbol)
          }
          
          let rawAmount = outTx.data?.value || '0'
          
          // If we have a transaction hash, fetch the actual transaction to get precise amounts
          if (outTx.hash && rawAmount === '0' && destChain) {
            try {
              const txChainConfig = defineChain({
                id: destChainId!,
                name: destChain.displayName,
                nativeCurrency: {
                  name: destChain.currency.name,
                  symbol: destChain.currency.symbol,
                  decimals: destChain.currency.decimals,
                },
                rpcUrls: {
                  default: { http: [destChain.httpRpcUrl] },
                },
              })
              
              const txClient = createPublicClient({
                chain: txChainConfig,
                transport: http(destChain.httpRpcUrl),
              })
              
              const receipt = await txClient.getTransactionReceipt({ hash: outTx.hash as `0x${string}` })
              
              // Parse Transfer events to get actual amount
              for (const log of receipt.logs) {
                if (log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') {
                  if (log.data && log.data !== '0x') {
                    rawAmount = BigInt(log.data).toString()
                    console.log('✓ Got to amount from Transfer event:', rawAmount)
                    break
                  }
                }
              }
            } catch (e) {
              console.log('Could not fetch output transaction receipt:', e)
            }
          }
          
          // Fallback: decode from calldata
          if (rawAmount === '0' && outTx.data?.data && outTx.data.data.length >= 138) {
            try {
              const amountHex = '0x' + outTx.data.data.substring(74, 138)
              const decoded = BigInt(amountHex)
              if (decoded > 0n && decoded < BigInt('10000000000000000000000000000')) {
                rawAmount = decoded.toString()
                console.log('✓ Decoded from calldata:', rawAmount)
              }
            } catch (e) {
              console.log('Calldata decode failed')
            }
          }
          
          // Format amount
          if (rawAmount && rawAmount !== '0') {
            try {
              toAmount = parseFloat(formatUnits(BigInt(rawAmount), toDecimals)).toFixed(6)
              console.log('✓ To:', toAmount, toSymbol)
            } catch (e) {
              console.error('Format error:', e)
              toAmount = '0'
            }
          }
        }
        
        // Calculate time taken
        const createdTime = new Date(req.createdAt).getTime()
        const updatedTime = new Date(req.updatedAt).getTime()
        const completedAt = req.status === 'success' ? updatedTime : undefined
        
        // Fetch USD values for from and to tokens
        let fromAmountUsd: string | undefined
        let toAmountUsd: string | undefined
        
        try {
          if (fromTokenAddress && originChainId && parseFloat(fromAmount) > 0) {
            const priceData = await relayAPI.getTokenPrice({ 
              address: fromTokenAddress, 
              chainId: originChainId 
            })
            fromAmountUsd = (parseFloat(fromAmount) * priceData.price).toFixed(2)
          }
        } catch (e) {
          console.log('Could not fetch from token price')
        }
        
        try {
          if (toTokenAddress && destChainId && parseFloat(toAmount) > 0) {
            const priceData = await relayAPI.getTokenPrice({ 
              address: toTokenAddress, 
              chainId: destChainId 
            })
            toAmountUsd = (parseFloat(toAmount) * priceData.price).toFixed(2)
          }
        } catch (e) {
          console.log('Could not fetch to token price')
        }
        
        const historyItem = {
          id: req.id,
          type: transactionType,
          fromToken: fromTokenAddress,
          fromTokenSymbol: fromSymbol || 'Unknown',
          fromTokenDecimals: fromDecimals,
          fromTokenLogo,
          toToken: toTokenAddress,
          toTokenSymbol: toSymbol || 'Unknown',
          toTokenDecimals: toDecimals,
          toTokenLogo,
          fromAmount,
          toAmount,
          fromAmountUsd,
          toAmountUsd,
          fromChain: originChain?.displayName || originChain?.name || 'Unknown',
          fromChainId: originChainId || 0,
          fromChainIcon: originChain?.iconUrl,
          toChain: destChain?.displayName || destChain?.name || 'Unknown',
          toChainId: destChainId || 0,
          toChainIcon: destChain?.iconUrl,
          status: req.status,
          timestamp: createdTime,
          completedAt,
          txHash: req.data.outTxs?.[0]?.hash,
          inTxHash: req.data.inTxs?.[0]?.hash,
          batchTokens: transactionType === 'batch' && batchTokens.length > 0 ? batchTokens : undefined,
        }
        
        console.log('Final history item:', {
          id: historyItem.id,
          type: historyItem.type,
          fromSymbol: historyItem.fromTokenSymbol,
          toSymbol: historyItem.toTokenSymbol,
          fromAmount: historyItem.fromAmount,
          toAmount: historyItem.toAmount,
          fromChain: historyItem.fromChain,
          toChain: historyItem.toChain,
          batchTokensCount: historyItem.batchTokens?.length,
          batchTokens: historyItem.batchTokens
        })
        console.log('===')
        
        return historyItem
      }))
      
      setSwapHistory(history)
    } catch (error) {
      console.error('Failed to load swap history:', error)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const loadUserStreak = () => {
    if (!address) return
    
    const streak = secureStorage.getItem<UserStreak>(`streak_${address}`)
    if (streak) {
      const now = Date.now()
      const timeSinceLastSwap = now - streak.lastSwapTimestamp
      const twentyFourHours = 24 * 60 * 60 * 1000
      
      if (timeSinceLastSwap > twentyFourHours) {
        const updated = {
          ...streak,
          currentStreak: 0,
        }
        secureStorage.setItem(`streak_${address}`, updated)
        setUserStreak(updated)
      } else {
        setUserStreak(streak)
      }
    }
  }

  const updateUserStreak = () => {
    if (!address) return
    
    const now = Date.now()
    const current = secureStorage.getItem<UserStreak>(`streak_${address}`) || { currentStreak: 0, lastSwapTimestamp: 0, totalSwaps: 0 }
    
    const timeSinceLastSwap = now - current.lastSwapTimestamp
    const twentyFourHours = 24 * 60 * 60 * 1000
    
    const lastSwapDate = new Date(current.lastSwapTimestamp)
    const currentDate = new Date(now)
    const isSameDay = lastSwapDate.getFullYear() === currentDate.getFullYear() &&
                      lastSwapDate.getMonth() === currentDate.getMonth() &&
                      lastSwapDate.getDate() === currentDate.getDate()
    
    let newStreak = current.currentStreak
    let showStreakMessage = false
    
    if (current.lastSwapTimestamp === 0) {
      newStreak = 1
      showStreakMessage = true
    } else if (isSameDay) {
      newStreak = current.currentStreak
      showStreakMessage = false
    } else if (timeSinceLastSwap <= twentyFourHours) {
      newStreak = current.currentStreak + 1
      showStreakMessage = true
    } else {
      newStreak = 1
      showStreakMessage = true
    }
    
    const updated = {
      currentStreak: newStreak,
      lastSwapTimestamp: now,
      totalSwaps: current.totalSwaps + 1,
    }
    
    secureStorage.setItem(`streak_${address}`, updated)
    setUserStreak(updated)
    
    if (showStreakMessage && newStreak > 1) {
      const randomMessage = STREAK_MESSAGES[Math.floor(Math.random() * STREAK_MESSAGES.length)]
      toast.success(randomMessage, {
        duration: 3000,
      })
    }
  }

  const loadLeaderboard = () => {
    const stored = secureStorage.getItem<LeaderboardEntry[]>('leaderboard')
    setLeaderboard(stored || [])
  }

  const updateLeaderboard = () => {
    if (!address) return
    
    const current: LeaderboardEntry[] = secureStorage.getItem<LeaderboardEntry[]>('leaderboard') || []
    
    const userIndex = current.findIndex(e => e.address === address)
    if (userIndex >= 0) {
      current[userIndex].swapCount += 1
    } else {
      current.push({
        address,
        swapCount: 1,
        volume: '0',
        rank: current.length + 1,
      })
    }
    
    current.sort((a, b) => b.swapCount - a.swapCount)
    current.forEach((entry, index) => {
      entry.rank = index + 1
    })
    
    secureStorage.setItem('leaderboard', current)
    setLeaderboard(current)
  }

  const loadUserData = () => {
    if (address) {
      loadUserStreak()
      loadSwapHistory()
    }
  }

  const loadApprovals = async () => {
    if (!address || !revokeChain) return
    
    setIsLoadingApprovals(true)
    setDebugInfo('Fetching approvals from API...')
    
    try {
      console.log('🔍 Loading approvals for:', revokeChain.displayName, address)
      
      // Try multiple methods to fetch approvals
      const chainId = revokeChain.id
      let data = null
      
      // Method 1: Try direct API call (might work in some environments)
      try {
        console.log('Method 1: Trying direct API call...')
        const directUrl = `https://api.revoke.cash/v1/allowances/${chainId}/${address}`
        const directResponse = await fetch(directUrl)
        if (directResponse.ok) {
          data = await directResponse.json()
          console.log('✅ Direct API call succeeded!')
        }
      } catch (e) {
        console.log('Direct API failed (expected due to CORS)')
      }
      
      // Method 2: Try allorigins proxy
      if (!data) {
        try {
          console.log('Method 2: Trying allorigins proxy...')
          const revokeCashUrl = `https://api.revoke.cash/v1/allowances/${chainId}/${address}`
          const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(revokeCashUrl)}`
          const proxyResponse = await fetch(proxyUrl)
          if (proxyResponse.ok) {
            data = await proxyResponse.json()
            console.log('✅ Allorigins proxy succeeded!')
          }
        } catch (e) {
          console.log('Allorigins proxy failed:', e)
        }
      }
      
      // Method 3: Try cors-anywhere
      if (!data) {
        try {
          console.log('Method 3: Trying cors-anywhere...')
          const revokeCashUrl = `https://api.revoke.cash/v1/allowances/${chainId}/${address}`
          const corsAnywhereUrl = `https://cors-anywhere.herokuapp.com/${revokeCashUrl}`
          const corsResponse = await fetch(corsAnywhereUrl)
          if (corsResponse.ok) {
            data = await corsResponse.json()
            console.log('✅ CORS-anywhere succeeded!')
          }
        } catch (e) {
          console.log('CORS-anywhere failed:', e)
        }
      }
      
      // Method 4: Try corsproxy.io
      if (!data) {
        try {
          console.log('Method 4: Trying corsproxy.io...')
          const revokeCashUrl = `https://api.revoke.cash/v1/allowances/${chainId}/${address}`
          const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(revokeCashUrl)}`
          const corsProxyResponse = await fetch(corsProxyUrl)
          if (corsProxyResponse.ok) {
            data = await corsProxyResponse.json()
            console.log('✅ Corsproxy.io succeeded!')
          }
        } catch (e) {
          console.log('Corsproxy.io failed:', e)
        }
      }
      
      if (!data) {
        console.error('All API methods failed')
        throw new Error('All API proxy methods failed')
      }
      
      console.log('API Response:', data)
      console.log('Type:', typeof data, 'Is Array:', Array.isArray(data))
      
      if (!Array.isArray(data)) {
        console.error('Invalid response format:', data)
        throw new Error('Invalid API response format')
      }
      
      console.log(`Found ${data.length} approvals from API`)
      setDebugInfo(`Processing ${data.length} approvals...`)
      
      const foundApprovals: typeof approvals = []
      
      for (const approval of data) {
        try {
          const allowanceValue = approval.allowance || approval.value
          const tokenAddress = approval.asset?.address || approval.token_address
          const spenderAddress = approval.spender?.address || approval.spender_address
          
          if (!allowanceValue || !tokenAddress || !spenderAddress) {
            continue
          }
          
          const allowanceBigInt = BigInt(allowanceValue)
          if (allowanceBigInt === 0n) continue
          
          const maxUint256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
          const isUnlimited = allowanceBigInt >= maxUint256 / 2n
          
          const token: RelayCurrency = {
            address: tokenAddress,
            symbol: approval.asset?.symbol || 'UNKNOWN',
            name: approval.asset?.name || 'Unknown Token',
            decimals: approval.asset?.decimals || 18,
            chainId: revokeChain.id,
            metadata: approval.asset?.icon_url ? { logoURI: approval.asset.icon_url } : undefined,
          }
          
          foundApprovals.push({
            token,
            spender: spenderAddress,
            spenderName: approval.spender?.name,
            allowance: allowanceValue,
            allowanceFormatted: isUnlimited ? 'Unlimited' : formatUnits(allowanceBigInt, token.decimals),
            riskLevel: isUnlimited ? 'high' : 'low',
          })
          
          console.log(`✅ ${token.symbol} → ${approval.spender?.name || spenderAddress}`)
        } catch (e) {
          console.warn('Error processing approval:', e)
        }
      }
      
      console.log(`🎉 Found ${foundApprovals.length} active approvals`)
      setApprovals(foundApprovals)
      
      if (foundApprovals.length === 0) {
        toast.success('No active approvals found')
      } else {
        toast.success(`Found ${foundApprovals.length} active approval${foundApprovals.length > 1 ? 's' : ''}`)
      }
      
    } catch (error) {
      const err = error as Error
      console.error('❌ API fetch failed:', err)
      console.log('Falling back to on-chain scan...')
      setDebugInfo('API failed, using on-chain scan...')
      
      // Fallback to on-chain scanning
      await loadApprovalsOnChain()
    } finally {
      setIsLoadingApprovals(false)
    }
  }
  
  // Fallback: On-chain scanning using Approval event logs
  const loadApprovalsOnChain = async () => {
    if (!address || !revokeChain) return
    
    try {
      console.log('Fetching approvals from Moralis...')
      setDebugInfo('Querying Moralis indexer...')
      
      const chainMap: Record<number, string> = {
        1: 'eth',
        8453: 'base',
        42161: 'arbitrum',
        137: 'polygon',
        10: 'optimism',
        56: 'bsc',
        43114: 'avalanche',
      }
      
      const chainSlug = chainMap[revokeChain.id]
      
      if (!chainSlug) {
        toast.error('Chain not supported')
        setIsLoadingApprovals(false)
        return
      }
      
      if (!config.moralis.apiKey) {
        toast.error('Moralis API key not configured')
        setIsLoadingApprovals(false)
        return
      }
      
      const response = await fetch(
        `https://deep-index.moralis.io/api/v2.2/wallets/${address}/approvals?chain=${chainSlug}`,
        {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'X-API-Key': config.moralis.apiKey
          }
        }
      )
      
      const data = await response.json()
      console.log('Moralis response:', data)
      
      if (data.result && Array.isArray(data.result)) {
        const foundApprovals: typeof approvals = []
        
        for (const approval of data.result) {
          const allowanceValue = approval.value || approval.allowance
          
          if (allowanceValue && allowanceValue !== '0') {
            const allowanceBigInt = BigInt(allowanceValue)
            const maxUint256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
            const isUnlimited = allowanceBigInt >= maxUint256 / 2n
            
            const token: RelayCurrency = {
              address: approval.token?.address || approval.token_address,
              symbol: approval.token?.symbol || approval.token_symbol || 'UNKNOWN',
              name: approval.token?.name || approval.token_name || 'Unknown',
              decimals: approval.token?.decimals || approval.token_decimals || 18,
              chainId: revokeChain.id,
              metadata: approval.token?.logo ? { logoURI: approval.token.logo } : undefined,
            }
            
            const spenderAddress = approval.spender?.address || approval.spender_address
            const spenderName = approval.spender?.address_label || approval.spender?.entity || approval.spender_name
            
            foundApprovals.push({
              token,
              spender: spenderAddress,
              spenderName: spenderName,
              allowance: allowanceValue,
              allowanceFormatted: isUnlimited ? 'Unlimited' : formatUnits(allowanceBigInt, token.decimals),
              riskLevel: isUnlimited ? 'high' : 'low',
            })
          }
        }
        
        console.log(`Found ${foundApprovals.length} approvals`)
        setApprovals(foundApprovals)
        
        if (foundApprovals.length === 0) {
          toast.success('No active approvals found')
        } else {
          toast.success(`Found ${foundApprovals.length} approval${foundApprovals.length > 1 ? 's' : ''}`)
        }
      } else {
        setApprovals([])
        toast.info('No approvals found')
      }
    } catch (error) {
      const err = error as Error
      console.error('Moralis failed:', err)
      toast.error(`Failed: ${err.message}`)
    } finally {
      setIsLoadingApprovals(false)
    }
  }

  const calculatePnl = (currentValue: number, tokens: Array<{ symbol: string; valueUsd: number; address: string; chainId: number }>) => {
    const storedCosts = secureStorage.getItem<Record<string, number>>(`token_costs_${address}`) || {}
    
    let totalCost = 0
    const tokenPnls: Array<{ symbol: string; pnl: number; percentage: number }> = []
    
    for (const token of tokens) {
      const key = `${token.chainId}_${token.address}`
      const cost = storedCosts[key] || token.valueUsd
      totalCost += cost
      
      const pnl = token.valueUsd - cost
      const percentage = cost > 0 ? (pnl / cost) * 100 : 0
      
      tokenPnls.push({
        symbol: token.symbol,
        pnl,
        percentage
      })
    }
    
    const totalPnl = currentValue - totalCost
    const totalPercentage = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0
    
    return {
      total: totalPnl,
      percentage: totalPercentage,
      tokens: tokenPnls.sort((a, b) => Math.abs(b.pnl) - Math.abs(a.pnl)).slice(0, 5)
    }
  }

  const loadPortfolio = async () => {
    if (!address) return
    
    setIsLoadingPortfolio(true)
    try {
      const supportedChains = [
        { id: 1, name: 'Ethereum', network: AlchemyNetwork.ETH_MAINNET },
        { id: 8453, name: 'Base', network: AlchemyNetwork.BASE_MAINNET },
        { id: 42161, name: 'Arbitrum', network: AlchemyNetwork.ARB_MAINNET },
        { id: 137, name: 'Polygon', network: AlchemyNetwork.MATIC_MAINNET },
        { id: 10, name: 'Optimism', network: AlchemyNetwork.OPT_MAINNET },
      ]
      
      const portfolioAddresses = [{
        address: address,
        networks: supportedChains.map(c => c.network as unknown as AlchemyNetwork)
      }]
      
      console.log('Fetching portfolio for:', address)
      const response = await alchemy.portfolio.getTokensByWallet(
        portfolioAddresses,
        true,
        true,
        true
      )
      console.log('Portfolio response:', response)
      
      const chainData = new Map<number, {
        chainId: number
        chainName: string
        valueUsd: number
        tokens: Array<{
          address: string
          symbol: string
          name: string
          balance: string
          balanceFormatted: string
          valueUsd: number
          priceUsd: number
          logo?: string
        }>
      }>()
      let totalValue = 0
      
      const tokens = response?.data?.tokens || []
      console.log('Tokens found:', tokens.length)
      
      if (tokens && tokens.length > 0) {
        for (const token of tokens) {
          const tokenData = token as {
            tokenAddress?: string | null
            network: string
            tokenBalance: string
            tokenMetadata?: {
              name?: string | null
              symbol?: string | null
              decimals?: number | null
              logo?: string | null
            }
            tokenPrices?: Array<{
              currency: string
              value: string
              lastUpdatedAt: string
            }>
          }
          
          // Convert hex balance to decimal if needed
          let tokenBalance = tokenData.tokenBalance || '0'
          if (tokenBalance.startsWith('0x')) {
            tokenBalance = BigInt(tokenBalance).toString()
          }
          
          const metadata = tokenData.tokenMetadata || {}
          const decimals = metadata.decimals || 18
          const balance = parseFloat(tokenBalance) / Math.pow(10, decimals)
          
          console.log('Token details:', {
            symbol: metadata.symbol,
            balance,
            decimals,
            rawBalance: tokenBalance,
            network: tokenData.network
          })
          
          // Skip tokens with zero balance
          if (balance === 0 || isNaN(balance)) {
            console.log('Skipping token with zero/invalid balance')
            continue
          }
          
          const chainId = supportedChains.find(c => c.network === tokenData.network)?.id || 1
          
          if (!chainData.has(chainId)) {
            chainData.set(chainId, {
              chainId,
              chainName: supportedChains.find(c => c.id === chainId)?.name || 'Unknown',
              valueUsd: 0,
              tokens: []
            })
          }
          
          const chain = chainData.get(chainId)!
          
          // tokenPrices is an array of TokenPrice objects
          const pricesArray = tokenData.tokenPrices || []
          const usdPrice = pricesArray.find((p) => p.currency === 'usd')
          const priceUsd = usdPrice ? parseFloat(usdPrice.value) : 0
          const valueUsd = balance * priceUsd
          
          console.log('Token value:', {
            symbol: metadata.symbol,
            balance,
            priceUsd,
            valueUsd,
            pricesArray
          })
          
          chain.tokens.push({
            address: tokenData.tokenAddress || 'native',
            symbol: metadata.symbol || 'UNKNOWN',
            name: metadata.name || 'Unknown',
            balance: tokenBalance,
            balanceFormatted: balance.toFixed(6),
            valueUsd,
            priceUsd,
            logo: metadata.logo || undefined,
          })
          
          chain.valueUsd += valueUsd
          totalValue += valueUsd
        }
      }
      
      console.log('Final portfolio data:', {
        totalValue,
        chains: Array.from(chainData.values())
      })
      
      const allTokens = Array.from(chainData.values()).flatMap(c => c.tokens.map(t => ({ ...t, chainId: c.chainId })))
      const pnl = calculatePnl(totalValue, allTokens)
      
      setPortfolioData({
        totalValueUsd: totalValue,
        chains: Array.from(chainData.values()).sort((a, b) => b.valueUsd - a.valueUsd)
      })
      setPortfolioPnl(pnl)
    } catch (error) {
      const err = error as Error
      console.error('Failed to load portfolio:', err)
      console.error('Error details:', err.message, err.stack)
      toast.error(`Failed to load portfolio: ${err.message}`)
      setPortfolioData(null)
    } finally {
      setIsLoadingPortfolio(false)
    }
  }

  const getBlockExplorerUrl = (chainId: number, txHash: string): string => {
    const explorers: Record<number, string> = {
      1: 'https://etherscan.io/tx/',
      8453: 'https://basescan.org/tx/',
      84532: 'https://sepolia.basescan.org/tx/',
      42161: 'https://arbiscan.io/tx/',
      137: 'https://polygonscan.com/tx/',
      10: 'https://optimistic.etherscan.io/tx/',
      56: 'https://bscscan.com/tx/',
      43114: 'https://snowtrace.io/tx/',
      59144: 'https://lineascan.build/tx/',
      534352: 'https://scrollscan.com/tx/',
      5000: 'https://explorer.mantle.xyz/tx/',
      324: 'https://explorer.zksync.io/tx/',
      250: 'https://ftmscan.com/tx/',
      100: 'https://gnosisscan.io/tx/',
      42220: 'https://celoscan.io/tx/',
      130: 'https://uniscan.xyz/tx/',
      360: 'https://shapescan.xyz/tx/',
    }
    return (explorers[chainId] || 'https://relay.link/tx/') + txHash
  }

  // Helper to get token logo URL (native tokens and common ERC-20s)
  const getNativeTokenLogo = (symbol: string): string | undefined => {
    const logos: Record<string, string> = {
      // Native tokens
      'ETH': 'https://assets.relay.link/icons/currencies/eth.png',
      'MATIC': 'https://assets.relay.link/icons/currencies/matic.png',
      'POL': 'https://assets.relay.link/icons/currencies/matic.png',
      'BNB': 'https://assets.relay.link/icons/currencies/bnb.png',
      'AVAX': 'https://assets.relay.link/icons/currencies/avax.png',
      'FTM': 'https://assets.relay.link/icons/currencies/ftm.png',
      'XDAI': 'https://assets.relay.link/icons/currencies/xdai.png',
      'CELO': 'https://assets.relay.link/icons/currencies/celo.png',
      'MNT': 'https://assets.relay.link/icons/currencies/mnt.png',
      // Common stablecoins (fallback if metadata missing)
      'USDC': 'https://assets.relay.link/icons/currencies/usdc.png',
      'USDT': 'https://assets.relay.link/icons/currencies/usdt.png',
      'DAI': 'https://assets.relay.link/icons/currencies/dai.png',
      'WETH': 'https://assets.relay.link/icons/currencies/weth.png',
      'WBTC': 'https://assets.relay.link/icons/currencies/wbtc.png',
    }
    return logos[symbol.toUpperCase()]
  }

  const checkAirdrops = async () => {
    if (!address) return
    
    setIsLoadingAirdrops(true)
    
    try {
      const detectedAirdrops: typeof airdrops = []
      
      // Check for actual claimable airdrops across supported chains
      // Add specific airdrop contract addresses here
      const knownAirdropContracts: Array<{
        id: string
        name: string
        description: string
        protocol: string
        chainId: number
        chainName: string
        tokenSymbol: string
        contractAddress: string
        logo?: string
        type: 'standard' | 'clanker' | 'farcaster'
      }> = [
        // Add your airdrop contracts here
      ]
      
      // Check each airdrop contract to see if user can claim
      for (const airdrop of knownAirdropContracts) {
        try {
          // Check if user has already claimed
          // This would call the contract's hasClaimed(address) function
          const hasClaimed = false // Placeholder - implement contract call
          
          if (!hasClaimed) {
            // Get claimable amount from contract
            const amount = '0' // Placeholder - implement contract call
            
            if (parseFloat(amount) > 0) {
              detectedAirdrops.push({
                ...airdrop,
                amount,
                isEligible: true,
                isClaimed: false
              })
            }
          }
        } catch (error) {
          console.error(`Failed to check airdrop ${airdrop.id}:`, error)
        }
      }
      
      setAirdrops(detectedAirdrops)
      
      if (detectedAirdrops.length > 0) {
        toast.success(
          `Found ${detectedAirdrops.length} claimable airdrop${detectedAirdrops.length !== 1 ? 's' : ''}`,
          {
            duration: 8000,
            action: {
              label: 'Claim',
              onClick: () => setShowAirdrops(true)
            }
          }
        )
        
        setTimeout(() => {
          setShowAirdrops(true)
        }, 2000)
      }
    } catch (error) {
      console.error('Failed to check airdrops:', error)
      toast.error('Failed to check airdrops')
    } finally {
      setIsLoadingAirdrops(false)
    }
  }

  const claimAirdrop = async (airdrop: typeof airdrops[0]) => {
    if (!address || !airdrop.contractAddress) {
      toast.error('Invalid airdrop configuration')
      return
    }
    
    setIsClaiming(true)
    
    try {
      // Switch to correct chain if needed
      if (connectedChainId !== airdrop.chainId) {
        console.log('Switching chain to', airdrop.chainName)
        
        try {
          await switchChain({ chainId: airdrop.chainId })
          toast.success(`Switched to ${airdrop.chainName}`)
          await new Promise(resolve => setTimeout(resolve, 500))
        } catch (switchError) {
          console.error('Failed to switch chain:', switchError)
          toast.error(`Please switch to ${airdrop.chainName}`)
          setIsClaiming(false)
          return
        }
      }
      
      // Execute claim transaction
      // Standard claim() function selector: 0x4e71d92d
      sendTransaction({
        to: airdrop.contractAddress as `0x${string}`,
        data: '0x4e71d92d' as `0x${string}`,
      }, {
        onSuccess: (hash) => {
          console.log('Claim transaction submitted:', hash)
          
          toast.success(
            `Airdrop claimed! ${airdrop.amount} ${airdrop.tokenSymbol}`,
            {
              duration: 10000,
              action: {
                label: 'View TX',
                onClick: () => {
                  const explorerUrl = getBlockExplorerUrl(airdrop.chainId, hash)
                  window.open(explorerUrl, '_blank')
                }
              }
            }
          )
          
          // Remove claimed airdrop from list
          setAirdrops(prev => prev.filter(a => a.id !== airdrop.id))
          
          setIsClaiming(false)
          
          // Refresh portfolio to show new balance
          setTimeout(() => {
            loadPortfolio()
          }, 3000)
        },
        onError: (error) => {
          console.error('Claim failed:', error)
          
          const errorMessage = error.message || 'Unknown error'
          let userMessage = 'Failed to claim airdrop'
          
          // Handle specific errors
          if (errorMessage.includes('already claimed')) {
            userMessage = 'Already claimed'
            setAirdrops(prev => prev.filter(a => a.id !== airdrop.id))
          } else if (errorMessage.includes('not eligible')) {
            userMessage = 'Not eligible'
          } else if (errorMessage.includes('user rejected')) {
            userMessage = 'Transaction rejected'
          }
          
          toast.error(userMessage)
          setIsClaiming(false)
        }
      })
    } catch (error) {
      console.error('Claim airdrop failed:', error)
      toast.error('Failed to claim airdrop')
      setIsClaiming(false)
    }
  }

  const revokeApproval = async (approval: typeof approvals[0]) => {
    if (!address || !revokeChain) return
    
    setIsRevoking(true)
    try {
      // Check if we need to switch chains
      if (connectedChainId !== revokeChain.id) {
        console.log('Switching chain to', revokeChain.displayName)
        try {
          await switchChain({ chainId: revokeChain.id })
          toast.success('Chain switched')
          await new Promise(resolve => setTimeout(resolve, 500))
        } catch (switchError) {
          console.error('Failed to switch chain:', switchError)
          toast.error('Please switch to the correct network')
          setIsRevoking(false)
          return
        }
      }
      
      // Send approval transaction with 0 allowance
      sendTransaction({
        to: approval.token.address as `0x${string}`,
        data: `0x095ea7b3${approval.spender.slice(2).padStart(64, '0')}${'0'.padStart(64, '0')}` as `0x${string}`,
      }, {
        onSuccess: (hash) => {
          console.log('Revoke transaction submitted:', hash)
          toast.success('Approval revoked successfully')
          
          // Reload approvals after a delay
          setTimeout(() => {
            loadApprovals()
          }, 2000)
          
          setIsRevoking(false)
        },
        onError: (error) => {
          console.error('Revoke failed:', error)
          toast.error('Failed to revoke approval')
          setIsRevoking(false)
        }
      })
    } catch (error) {
      console.error('Revoke approval failed:', error)
      toast.error('Failed to revoke approval')
      setIsRevoking(false)
    }
  }

  const batchRevokeApprovals = async () => {
    if (!address || !revokeChain || selectedApprovals.size === 0) return
    
    setIsRevoking(true)
    try {
      // Check if we need to switch chains
      if (connectedChainId !== revokeChain.id) {
        console.log('Switching chain to', revokeChain.displayName)
        try {
          await switchChain({ chainId: revokeChain.id })
          toast.success('Chain switched')
          await new Promise(resolve => setTimeout(resolve, 500))
        } catch (switchError) {
          console.error('Failed to switch chain:', switchError)
          toast.error('Please switch to the correct network')
          setIsRevoking(false)
          return
        }
      }
      
      const selectedApprovalsArray = Array.from(selectedApprovals).map(idx => approvals[idx])
      let successCount = 0
      let failCount = 0
      
      for (const approval of selectedApprovalsArray) {
        try {
          await new Promise<void>((resolve, reject) => {
            sendTransaction({
              to: approval.token.address as `0x${string}`,
              data: `0x095ea7b3${approval.spender.slice(2).padStart(64, '0')}${'0'.padStart(64, '0')}` as `0x${string}`,
            }, {
              onSuccess: () => {
                successCount++
                resolve()
              },
              onError: (error) => {
                console.error('Revoke failed:', error)
                failCount++
                reject(error)
              }
            })
          })
          await new Promise(resolve => setTimeout(resolve, 1000))
        } catch (error) {
          console.error('Failed to revoke approval:', error)
        }
      }
      
      if (successCount > 0) {
        toast.success(`Successfully revoked ${successCount} approval${successCount > 1 ? 's' : ''}`)
      }
      if (failCount > 0) {
        toast.error(`Failed to revoke ${failCount} approval${failCount > 1 ? 's' : ''}`)
      }
      
      setSelectedApprovals(new Set())
      setTimeout(() => {
        loadApprovals()
      }, 2000)
      
      setIsRevoking(false)
    } catch (error) {
      console.error('Batch revoke failed:', error)
      toast.error('Failed to revoke approvals')
      setIsRevoking(false)
    }
  }

  const toggleApprovalSelection = (idx: number) => {
    const newSelected = new Set(selectedApprovals)
    if (newSelected.has(idx)) {
      newSelected.delete(idx)
    } else {
      newSelected.add(idx)
    }
    setSelectedApprovals(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedApprovals.size === approvals.length) {
      setSelectedApprovals(new Set())
    } else {
      setSelectedApprovals(new Set(approvals.map((_, idx) => idx)))
    }
  }

  const loadSwapSources = async () => {
    try {
      const sources = await relayAPI.getSwapSources()
      setSwapSources(sources)
      const initialEnabled: Record<string, boolean> = {}
      sources.forEach(source => {
        initialEnabled[source] = true
      })
      setEnabledSources(initialEnabled)
    } catch (error) {
      console.error('Failed to load swap sources:', error)
      setSwapSources(['weth', '0x', 'open-ocean', 'eisen'])
      setEnabledSources({
        'weth': true,
        '0x': true,
        'open-ocean': true,
        'eisen': true,
      })
    }
  }

  const shareSwapReceipt = (swap: SwapHistory) => {
    const text = `Just swapped ${swap.fromAmount} ${swap.fromTokenSymbol} (${swap.fromChain}) to ${swap.toAmount} ${swap.toTokenSymbol} (${swap.toChain}) on Relay!`
    const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const switchChains = () => {
    const temp = fromChain
    setFromChain(toChain)
    setToChain(temp)
    
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)
    
    const tempAmount = fromAmount
    setFromAmount(toAmount)
    setToAmount(tempAmount)
    
    // Recalculate USD amount after switching
    if (inputMode === 'usd' && toAmount && toTokenPrice > 0) {
      setUsdAmount((parseFloat(toAmount) * toTokenPrice).toFixed(2))
    }
  }

  const handleConnect = async () => {
    try {
      const connector = connectors.find(c => c.id === 'io.metamask' || c.id === 'injected') || connectors[0]
      if (connector) {
        await connect({ connector })
      } else {
        toast.error('No wallet connector found. Please install MetaMask or another Web3 wallet.')
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      toast.error('Failed to connect wallet')
    }
  }

  const setPercentageAmount = (percentage: number) => {
    if (!fromBalance) return
    const balance = parseFloat(formatUnits(fromBalance.value, fromBalance.decimals))
    const amount = (balance * percentage / 100).toString()
    setFromAmount(amount)
    
    // Update USD amount if in USD mode
    if (inputMode === 'usd' && fromTokenPrice > 0) {
      setUsdAmount((parseFloat(amount) * fromTokenPrice).toFixed(2))
    }
  }

  const filteredChains = chains.filter(chain =>
    chain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chain.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activeCurrencies = selectingFor === 'from' 
    ? fromCurrencies 
    : selectingFor === 'to' 
    ? toCurrencies 
    : selectingFor === 'batch' && batchChain
    ? currencies.filter(c => c.chainId === batchChain.id)
    : currencies
  
  // Combine regular currencies with external search results
  const allCurrencies = externalSearchResults.length > 0 
    ? [...externalSearchResults, ...activeCurrencies]
    : activeCurrencies
  
  const filteredCurrencies = allCurrencies.filter(currency =>
    currency.symbol.toLowerCase().includes(tokenSearchTerm.toLowerCase()) ||
    currency.name.toLowerCase().includes(tokenSearchTerm.toLowerCase()) ||
    currency.address.toLowerCase().includes(tokenSearchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background p-2 max-w-[424px] mx-auto">
      <div className="space-y-2">
        {!isConnected ? (
          <Button
            onClick={handleConnect}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        ) : (
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">RELAY</h1>
              {userStreak.currentStreak > 0 && (
                <Badge variant="secondary" className="gap-1 text-xs px-2 py-0.5">
                  <Flame className="h-3 w-3" />
                  {userStreak.currentStreak}
                </Badge>
              )}
              {connectedChainId && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  {chains.find(c => c.id === connectedChainId)?.displayName || `Chain ${connectedChainId}`}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLeaderboard(true)}
                className="h-7 w-7 p-0"
              >
                <Trophy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAirdrops(true)}
                className="h-7 w-7 p-0 relative"
              >
                <Gift className={`h-4 w-4 ${airdrops.length > 0 ? 'animate-pulse' : ''}`} />
                {airdrops.length > 0 && (
                  <>
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full flex items-center justify-center text-[8px] font-bold animate-pulse">
                      {airdrops.length}
                    </span>
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full animate-ping" />
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="h-7 w-7 p-0"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  const connectorName = connector?.name || 'Unknown'
                  console.log('Disconnect clicked:', { connectorName, isConnected, address })
                  
                  if (connectorName === 'Farcaster Miniapp') {
                    toast.info('Farcaster wallet cannot be disconnected. Refresh to reconnect.')
                    return
                  }
                  
                  wagmiDisconnect()
                  toast.success('Wallet disconnected')
                }}
                className="h-7 text-xs px-2"
              >
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </Button>
            </div>
          </div>
        )}

        <Tabs defaultValue="portfolio" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-8">
            <TabsTrigger value="portfolio" className="text-xs">Portfolio</TabsTrigger>
            <TabsTrigger value="swap" className="text-xs">Swap</TabsTrigger>
            <TabsTrigger value="batch" className="text-xs">Batch</TabsTrigger>
            <TabsTrigger value="revoke" className="text-xs">Revoke</TabsTrigger>
            <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
          </TabsList>

          <TabsContent value="swap" className="space-y-2 mt-2">
            <Card className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">From</span>
                  {fromBalance && (
                    <span className="text-muted-foreground">
                      Balance: {parseFloat(formatUnits(fromBalance.value, fromBalance.decimals)).toFixed(4)} {fromToken?.symbol}
                      {fromTokenPrice > 0 && (
                        <span className="ml-1">
                          (${(parseFloat(formatUnits(fromBalance.value, fromBalance.decimals)) * fromTokenPrice).toFixed(2)})
                        </span>
                      )}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectingFor('from')
                      setIsChainSelectOpen(true)
                    }}
                    className="flex-1 justify-between h-10 text-xs"
                  >
                    <div className="flex items-center gap-1.5">
                      {fromChain?.iconUrl && (
                        <img src={fromChain.iconUrl} alt="" className="h-4 w-4 rounded-full" />
                      )}
                      <span>{fromChain?.displayName || 'Select'}</span>
                    </div>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectingFor('from')
                      setIsTokenSelectOpen(true)
                    }}
                    className="flex-1 justify-between h-10 text-xs"
                  >
                    <div className="flex items-center gap-1.5">
                      {fromToken?.metadata?.logoURI && (
                        <img src={fromToken.metadata.logoURI} alt="" className="h-4 w-4 rounded-full" />
                      )}
                      <span>{fromToken?.symbol || 'Select'}</span>
                    </div>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>

                <div className="space-y-1">
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder={inputMode === 'token' ? '0.0' : '$0.00'}
                      value={inputMode === 'token' ? fromAmount : usdAmount}
                      onChange={(e) => {
                        const value = sanitizeInput(e.target.value)
                        if (inputMode === 'token') {
                          if (!value || validateAmount(value, fromToken?.decimals || 18)) {
                            setFromAmount(value)
                            if (value && fromTokenPrice > 0) {
                              setUsdAmount((parseFloat(value) * fromTokenPrice).toFixed(2))
                            } else {
                              setUsdAmount('')
                            }
                          }
                        } else {
                          if (!value || validateAmount(value, 2)) {
                            setUsdAmount(value)
                            if (value && fromTokenPrice > 0) {
                              setFromAmount((parseFloat(value) / fromTokenPrice).toString())
                            } else {
                              setFromAmount('')
                            }
                          }
                        }
                      }}
                      className="text-lg h-10 pr-16"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setInputMode(inputMode === 'token' ? 'usd' : 'token')}
                      className="absolute right-1 top-1 h-8 px-2 text-xs"
                      disabled={!fromTokenPrice}
                    >
                      {inputMode === 'token' ? fromToken?.symbol || 'TOKEN' : 'USD'}
                    </Button>
                  </div>
                  {fromAmount && fromTokenPrice > 0 && inputMode === 'token' && (
                    <div className="text-xs text-muted-foreground px-1">
                      ≈ ${(parseFloat(fromAmount) * fromTokenPrice).toFixed(2)}
                    </div>
                  )}
                  {usdAmount && fromTokenPrice > 0 && inputMode === 'usd' && (
                    <div className="text-xs text-muted-foreground px-1">
                      ≈ {(parseFloat(usdAmount) / fromTokenPrice).toFixed(6)} {fromToken?.symbol}
                    </div>
                  )}
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPercentageAmount(25)}
                      className="flex-1 h-6 text-xs"
                      disabled={!fromBalance}
                    >
                      25%
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPercentageAmount(50)}
                      className="flex-1 h-6 text-xs"
                      disabled={!fromBalance}
                    >
                      50%
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPercentageAmount(100)}
                      className="flex-1 h-6 text-xs"
                      disabled={!fromBalance}
                    >
                      MAX
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-center -my-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={switchChains}
                className="h-7 w-7 p-0 rounded-full"
              >
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </div>

            <Card className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">To</span>
                  {toBalance && (
                    <span className="text-muted-foreground">
                      Balance: {parseFloat(formatUnits(toBalance.value, toBalance.decimals)).toFixed(4)} {toToken?.symbol}
                      {toTokenPrice > 0 && (
                        <span className="ml-1">
                          (${(parseFloat(formatUnits(toBalance.value, toBalance.decimals)) * toTokenPrice).toFixed(2)})
                        </span>
                      )}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectingFor('to')
                      setIsChainSelectOpen(true)
                    }}
                    className="flex-1 justify-between h-10 text-xs"
                  >
                    <div className="flex items-center gap-1.5">
                      {toChain?.iconUrl && (
                        <img src={toChain.iconUrl} alt="" className="h-4 w-4 rounded-full" />
                      )}
                      <span>{toChain?.displayName || 'Select'}</span>
                    </div>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectingFor('to')
                      setIsTokenSelectOpen(true)
                    }}
                    className="flex-1 justify-between h-10 text-xs"
                  >
                    <div className="flex items-center gap-1.5">
                      {toToken?.metadata?.logoURI && (
                        <img src={toToken.metadata.logoURI} alt="" className="h-4 w-4 rounded-full" />
                      )}
                      <span>{toToken?.symbol || 'Select'}</span>
                    </div>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>

                <Input
                  type="number"
                  placeholder="0.0"
                  value={toAmount}
                  readOnly
                  className="text-lg h-10 bg-muted"
                />
                {toAmount && toTokenPrice > 0 && (
                  <div className="text-xs text-muted-foreground px-1">
                    ≈ ${(parseFloat(toAmount) * toTokenPrice).toFixed(2)}
                  </div>
                )}
              </div>
            </Card>

            {(() => {
              const fromVMType = fromChain?.vmType || 'evm'
              const toVMType = toChain?.vmType || 'evm'
              const isCrossVM = fromVMType !== toVMType
              
              return isCrossVM && toChain && fromChain && (
                <Card className="p-3 bg-muted/50 border-accent">
                  <div className="space-y-2">
                    <div className="text-xs font-medium">
                      Recipient Address ({toChain.displayName}) <span className="text-destructive">*</span>
                    </div>
                    <Input
                      placeholder={`Enter ${toChain.displayName} address (required for cross-VM swap)`}
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      className="h-8 text-xs"
                    />
                    <div className="text-xs text-muted-foreground">
                      Cross-VM swap detected: {fromChain.displayName} ({fromVMType}) → {toChain.displayName} ({toVMType})
                    </div>
                  </div>
                </Card>
              )
            })()}

            {quote && (
              <Card className="p-3 bg-card">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Rate</span>
                    <span className="font-mono">{quote.details.rate || '0'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Gas</span>
                    <span className="font-mono">${quote.fees.gas?.amountUsd || '0'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Relayer</span>
                    <span className="font-mono">${quote.fees.relayer?.amountUsd || '0'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-mono">{quote.details.timeEstimate || 0}s</span>
                  </div>
                  {quote.details.totalImpact && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Impact</span>
                      <span className={`font-mono ${parseFloat(quote.details.totalImpact.percent) < 0 ? 'text-destructive' : ''}`}>
                        {quote.details.totalImpact.percent}
                      </span>
                    </div>
                  )}
                </div>
                {quote.details.totalImpact && Math.abs(parseFloat(quote.details.totalImpact.percent)) > 5 && (
                  <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">
                    High price impact detected. You may receive significantly less than expected.
                  </div>
                )}
                {parseFloat(slippage) > 1 && (
                  <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">
                    High slippage tolerance set. Transaction may execute at unfavorable rates.
                  </div>
                )}
              </Card>
            )}

            {fromChain && toChain && fromToken && toToken && 
             fromChain.id === toChain.id && 
             fromToken.address.toLowerCase() === toToken.address.toLowerCase() && (
              <Card className="p-3 bg-destructive/10 border-destructive">
                <div className="text-xs text-destructive text-center">
                  Cannot swap the same token to itself. Please select a different token.
                </div>
              </Card>
            )}

            <Button
              onClick={executeSwap}
              disabled={(() => {
                if (!quote || isSwapping || !isConnected) return true
                
                // Check if same token
                if (fromChain && toChain && fromToken && toToken &&
                    fromChain.id === toChain.id && 
                    fromToken.address.toLowerCase() === toToken.address.toLowerCase()) {
                  return true
                }
                
                // Check if cross-VM swap requires recipient address
                if (fromChain && toChain) {
                  const fromVMType = fromChain.vmType || 'evm'
                  const toVMType = toChain.vmType || 'evm'
                  const isCrossVM = fromVMType !== toVMType
                  
                  if (isCrossVM && !recipientAddress) return true
                }
                
                return false
              })()}
              className="w-full h-10"
            >
              {isSwapping ? 'Swapping...' : isLoadingQuote ? 'Loading...' : 'Swap'}
            </Button>

            {trendingTokens.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Trending on Farcaster</span>
                </div>
                <ScrollArea className="h-32">
                  <div className="space-y-1">
                    {trendingTokens.map((token, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded hover:bg-accent cursor-pointer text-xs"
                        onClick={() => {
                          if (fromChain?.id === token.chainId) {
                            setFromToken({
                              chainId: token.chainId,
                              address: token.address,
                              symbol: token.symbol,
                              name: token.name,
                              decimals: 18,
                              metadata: { logoURI: token.logoURI },
                            })
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {token.logoURI && (
                            <img src={token.logoURI} alt="" className="h-5 w-5 rounded-full" />
                          )}
                          <div>
                            <div className="font-medium">{token.symbol}</div>
                            <div className="text-muted-foreground text-xs">{token.name}</div>
                          </div>
                        </div>
                        {token.priceChange24h !== undefined && (
                          <Badge variant={token.priceChange24h >= 0 ? 'default' : 'destructive'} className="text-xs">
                            {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </TabsContent>

          <TabsContent value="batch" className="space-y-2 mt-2">
            <Card className="p-3">
              <div className="space-y-2">
                <div className="text-sm font-medium">Batch Cleanup Swap</div>
                
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Select chain to detect tokens</div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectingFor('batch')
                      setIsChainSelectOpen(true)
                    }}
                    className="w-full justify-between h-8 text-xs"
                  >
                    <div className="flex items-center gap-1.5">
                      {batchChain?.iconUrl && (
                        <img src={batchChain.iconUrl} alt="" className="h-4 w-4 rounded-full" />
                      )}
                      <span>{batchChain?.displayName || 'Select Chain'}</span>
                    </div>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>

                <Separator />

                <div className="text-xs text-muted-foreground">
                  {isLoadingBatchTokens ? 'Loading tokens...' : batchTokens.length > 0 ? `${batchTokens.length} tokens detected with balance` : batchChain ? 'No tokens with balance detected' : 'Select a chain to detect tokens'}
                </div>

                <ScrollArea className="h-40">
                  <div className="space-y-2">
                    {batchTokens.map((wt, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 border rounded">
                        <div className="flex-1 flex items-center gap-2">
                          {wt.token.metadata?.logoURI && (
                            <img src={wt.token.metadata.logoURI} alt="" className="h-4 w-4 rounded-full" />
                          )}
                          <div className="flex-1">
                            <div className="text-xs font-medium">{wt.token.symbol}</div>
                            <div className="text-xs text-muted-foreground">{parseFloat(wt.balanceFormatted).toFixed(6)}</div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setBatchTokens(batchTokens.filter((_, idx) => idx !== i))}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectingFor('batch')
                    setIsTokenSelectOpen(true)
                  }}
                  className="w-full h-8 text-xs"
                >
                  Add Token
                </Button>

                <Separator />

                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Swap to</div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectingFor('to')
                        setIsChainSelectOpen(true)
                      }}
                      className="flex-1 justify-between h-8 text-xs"
                    >
                      <div className="flex items-center gap-1.5">
                        {toChain?.iconUrl && (
                          <img src={toChain.iconUrl} alt="" className="h-4 w-4 rounded-full" />
                        )}
                        <span>{toChain?.displayName || 'Select'}</span>
                      </div>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectingFor('to')
                        setIsTokenSelectOpen(true)
                      }}
                      className="flex-1 justify-between h-8 text-xs"
                    >
                      <div className="flex items-center gap-1.5">
                        {toToken?.metadata?.logoURI && (
                          <img src={toToken.metadata.logoURI} alt="" className="h-4 w-4 rounded-full" />
                        )}
                        <span>{toToken?.symbol || 'Select'}</span>
                      </div>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {batchQuote && (
                  <Card className="p-3 bg-card">
                    <div className="space-y-1.5 text-xs">
                      <div className="font-medium mb-2">Batch Swap Summary</div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Input</span>
                        <span className="font-mono">
                          {batchTokens.length} token{batchTokens.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      {batchQuote.details.currencyOut && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">You Receive</span>
                          <span className="font-mono font-medium">
                            {parseFloat(batchQuote.details.currencyOut.amountFormatted).toFixed(6)} {toToken?.symbol}
                          </span>
                        </div>
                      )}
                      
                      {batchQuote.details.currencyOut?.amountUsd && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Value (USD)</span>
                          <span className="font-mono">
                            ${parseFloat(batchQuote.details.currencyOut.amountUsd).toFixed(2)}
                          </span>
                        </div>
                      )}
                      
                      <Separator className="my-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Gas</span>
                        <span className="font-mono">
                          ${batchQuote.fees.gas?.amountUsd || '0'}
                        </span>
                      </div>
                      
                      {batchQuote.fees.relayer && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Relayer Fee</span>
                          <span className="font-mono">
                            ${batchQuote.fees.relayer.amountUsd || '0'}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Transactions</span>
                        <span className="font-mono">
                          {batchQuote.steps.reduce((acc, step) => acc + (step.items?.length || 0), 0)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Est. Time</span>
                        <span className="font-mono">
                          {batchQuote.details.timeEstimate || 0}s
                        </span>
                      </div>
                      
                      {batchQuote.details.totalImpact && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Price Impact</span>
                          <span className={`font-mono ${parseFloat(batchQuote.details.totalImpact.percent) < 0 ? 'text-destructive' : ''}`}>
                            {batchQuote.details.totalImpact.percent}
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                <Button
                  onClick={executeBatchSwap}
                  disabled={batchTokens.length === 0 || isSwapping || !isConnected || !batchQuote}
                  className="w-full h-8 text-xs"
                >
                  {isSwapping ? 'Swapping...' : isLoadingBatchQuote ? 'Loading Quote...' : 'Execute Batch Swap'}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-2 mt-2">
            {isLoadingPortfolio ? (
              <Card className="p-4 text-center">
                <div className="text-sm text-muted-foreground">Loading portfolio...</div>
              </Card>
            ) : portfolioData ? (
              <>
                <Card className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Total Portfolio Value</div>
                    <div className="text-3xl font-bold">${portfolioData.totalValueUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    {portfolioPnl && (
                      <div className={`text-sm font-medium ${portfolioPnl.percentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {portfolioPnl.percentage >= 0 ? '+' : ''}{portfolioPnl.percentage.toFixed(2)}% (${portfolioPnl.total >= 0 ? '+' : ''}{portfolioPnl.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const snapshot = `My Portfolio: $${portfolioData.totalValueUsd.toLocaleString()} across ${portfolioData.chains.length} chains\n\nTop holdings:\n${portfolioData.chains[0]?.tokens.slice(0, 3).map(t => `${t.symbol}: $${t.valueUsd.toFixed(2)}`).join('\n')}\n\nvia Relay Swap`
                        navigator.clipboard.writeText(snapshot)
                        toast.success('Portfolio snapshot copied')
                      }}
                      className="flex-1 h-8 text-xs"
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPortfolio()}
                      className="h-8 text-xs px-2"
                    >
                      Refresh
                    </Button>
                  </div>
                </Card>

                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {portfolioData.chains.map(chain => (
                      <Card key={chain.chainId} className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium">{chain.chainName}</div>
                              <Badge variant="outline" className="text-xs">
                                {chain.tokens.length} tokens
                              </Badge>
                            </div>
                            <div className="text-sm font-medium">
                              ${chain.valueUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-1.5">
                            {chain.tokens.slice(0, 5).map(token => (
                              <div key={token.address} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  {token.logo ? (
                                    <img src={token.logo} alt="" className="h-5 w-5 rounded-full flex-shrink-0" />
                                  ) : (
                                    <div className="h-5 w-5 rounded-full bg-muted flex-shrink-0" />
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <div className="font-medium">{token.symbol}</div>
                                    <div className="text-muted-foreground truncate">{token.balanceFormatted}</div>
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <div className="font-medium">${token.valueUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                  <div className="text-muted-foreground">${token.priceUsd.toFixed(4)}</div>
                                </div>
                              </div>
                            ))}
                            {chain.tokens.length > 5 && (
                              <div className="text-xs text-muted-foreground text-center pt-1">
                                +{chain.tokens.length - 5} more tokens
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <Card className="p-4 text-center">
                <div className="text-sm text-muted-foreground">Connect wallet to view portfolio</div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-2">
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {isLoadingHistory ? (
                  <Card className="p-4 text-center text-sm text-muted-foreground">
                    Loading history...
                  </Card>
                ) : swapHistory.length === 0 ? (
                  <Card className="p-4 text-center text-sm text-muted-foreground">
                    No swap history yet
                  </Card>
                ) : (
                  swapHistory.map((swap) => {
                    const timeTaken = swap.completedAt && swap.timestamp 
                      ? Math.round((swap.completedAt - swap.timestamp) / 1000)
                      : null
                    
                    const typeLabel = swap.type === 'batch' ? 'Batch Swap' : swap.type === 'bridge' ? 'Bridge' : 'Swap'
                    const typeColor = swap.type === 'batch' ? 'bg-purple-500/10 text-purple-500' : swap.type === 'bridge' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'
                    
                    // Debug batch tokens
                    if (swap.type === 'batch') {
                      console.log('Rendering batch swap:', {
                        id: swap.id,
                        hasBatchTokens: !!swap.batchTokens,
                        batchTokensLength: swap.batchTokens?.length,
                        batchTokens: swap.batchTokens
                      })
                    }
                    
                    return (
                      <Card key={swap.id} className="p-3">
                        <div className="space-y-2">
                          {/* Header with status */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className={`text-xs ${typeColor}`}>
                                {typeLabel}
                              </Badge>
                              {swap.type !== 'batch' && (
                                <div className="text-xs font-medium">
                                  {swap.fromTokenSymbol} → {swap.toTokenSymbol}
                                </div>
                              )}
                              {timeTaken && (
                                <span className="text-xs text-muted-foreground">
                                  ({timeTaken}s)
                                </span>
                              )}
                            </div>
                            <Badge 
                              variant={
                                swap.status === 'success' ? 'default' : 
                                swap.status === 'pending' || swap.status === 'waiting' ? 'secondary' : 
                                'destructive'
                              } 
                              className="text-xs"
                            >
                              {swap.status}
                            </Badge>
                          </div>

                          {/* Timestamp */}
                          <div className="text-xs text-muted-foreground">
                            {new Date(swap.timestamp).toLocaleString()}
                          </div>

                          {/* From details */}
                          {swap.type === 'batch' && swap.batchTokens && swap.batchTokens.length > 0 ? (
                            <div className="p-2 bg-muted/50 rounded space-y-2">
                              <div className="text-xs font-medium text-muted-foreground">
                                Swapping {swap.batchTokens.length} token{swap.batchTokens.length > 1 ? 's' : ''}:
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {swap.batchTokens.map((token, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5 p-1.5 bg-background rounded">
                                    {token.logo && (
                                      <img src={token.logo} alt="" className="h-4 w-4 rounded-full" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <div className="text-xs font-medium truncate">
                                        {token.amount} {token.symbol}
                                      </div>
                                      {token.usdValue && (
                                        <div className="text-xs text-muted-foreground">
                                          ${token.usdValue}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="flex items-center gap-1.5 pt-1 border-t border-border">
                                {swap.fromChainIcon && (
                                  <img src={swap.fromChainIcon} alt="" className="h-4 w-4 rounded-full" />
                                )}
                                <div className="text-xs text-muted-foreground">
                                  {swap.fromChain}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                              <div className="flex items-center gap-1.5 flex-1">
                                {swap.fromTokenLogo && (
                                  <img src={swap.fromTokenLogo} alt="" className="h-5 w-5 rounded-full" />
                                )}
                                {swap.fromChainIcon && (
                                  <img src={swap.fromChainIcon} alt="" className="h-4 w-4 rounded-full" />
                                )}
                                <div className="flex-1">
                                  <div className="text-xs font-medium">
                                    {swap.fromAmount} {swap.fromTokenSymbol}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {swap.fromChain}
                                    {swap.fromAmountUsd && ` • $${swap.fromAmountUsd}`}
                                  </div>
                                </div>
                              </div>
                              {swap.inTxHash && (
                                <a
                                  href={getBlockExplorerUrl(swap.fromChainId, swap.inTxHash)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary hover:underline"
                                >
                                  View
                                </a>
                              )}
                            </div>
                          )}

                          {/* Arrow */}
                          <div className="flex justify-center">
                            <ArrowDownUp className="h-3 w-3 text-muted-foreground" />
                          </div>

                          {/* To details */}
                          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                            <div className="flex items-center gap-1.5 flex-1">
                              {swap.toTokenLogo && (
                                <img src={swap.toTokenLogo} alt="" className="h-5 w-5 rounded-full" />
                              )}
                              {swap.toChainIcon && (
                                <img src={swap.toChainIcon} alt="" className="h-4 w-4 rounded-full" />
                              )}
                              <div className="flex-1">
                                <div className="text-xs font-medium">
                                  {swap.toAmount} {swap.toTokenSymbol}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {swap.toChain}
                                  {swap.toAmountUsd && ` • $${swap.toAmountUsd}`}
                                </div>
                              </div>
                            </div>
                            {swap.txHash && (
                              <a
                                href={getBlockExplorerUrl(swap.toChainId, swap.txHash)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline"
                              >
                                View
                              </a>
                            )}
                          </div>

                          {/* Share button */}
                          <div className="flex justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => shareSwapReceipt(swap)}
                              className="h-7 px-2 text-xs"
                            >
                              <Share2 className="h-3 w-3 mr-1" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="revoke" className="space-y-2 mt-2">
            <Card className="p-3">
              <div className="space-y-2">
                <div className="text-sm font-medium">Revoke Token Approvals</div>
                <div className="text-xs text-muted-foreground">
                  Select a chain to view and revoke token approvals
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectingFor('revoke')
                    setIsChainSelectOpen(true)
                  }}
                  className="w-full justify-between h-8 text-xs"
                >
                  <div className="flex items-center gap-1.5">
                    {revokeChain?.iconUrl && (
                      <img src={revokeChain.iconUrl} alt="" className="h-4 w-4 rounded-full" />
                    )}
                    <span>{revokeChain?.displayName || 'Select Chain'}</span>
                  </div>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
            </Card>

            {isLoadingApprovals ? (
              <Card className="p-4 text-center">
                <div className="text-sm text-muted-foreground">
                  Scanning for approvals...
                </div>
              </Card>
            ) : approvals.length === 0 && revokeChain ? (
              <Card className="p-4 text-center">
                <div className="text-sm text-muted-foreground">
                  You haven't approved any tokens on {revokeChain.displayName} yet
                </div>
              </Card>
            ) : approvals.length > 0 ? (
              <>
                <Card className="p-3 bg-muted/50">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs text-muted-foreground">
                      Found {approvals.length} active approval{approvals.length > 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleSelectAll}
                        className="h-7 text-xs"
                      >
                        {selectedApprovals.size === approvals.length ? 'Deselect All' : 'Select All'}
                      </Button>
                      {selectedApprovals.size > 0 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={batchRevokeApprovals}
                          disabled={isRevoking}
                          className="h-7 text-xs"
                        >
                          {isRevoking ? 'Revoking...' : `Revoke ${selectedApprovals.size}`}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {approvals.map((approval, idx) => (
                      <Card key={idx} className="p-3 hover:bg-muted/50 transition-colors">
                        <div className="space-y-2.5">
                          <div className="flex items-start gap-2">
                            <Checkbox
                              checked={selectedApprovals.has(idx)}
                              onCheckedChange={() => toggleApprovalSelection(idx)}
                              className="mt-1"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  {approval.token.metadata?.logoURI ? (
                                    <img src={approval.token.metadata.logoURI} alt="" className="h-6 w-6 rounded-full flex-shrink-0" />
                                  ) : (
                                    <div className="h-6 w-6 rounded-full bg-muted flex-shrink-0" />
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <div className="text-sm font-medium">{approval.token.symbol}</div>
                                    <div className="text-xs text-muted-foreground truncate">{approval.token.name}</div>
                                  </div>
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                  {approval.allowanceFormatted === 'Unlimited' && (
                                    <Badge variant="destructive" className="text-xs">
                                      Unlimited
                                    </Badge>
                                  )}
                                  {approval.riskLevel === 'high' && (
                                    <Badge variant="destructive" className="text-xs">
                                      High Risk
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <Separator className="my-2" />
                              
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-xs gap-2">
                                  <span className="text-muted-foreground">Protocol</span>
                                  <span className="font-medium text-right">
                                    {approval.spenderName || `${approval.spender.slice(0, 6)}...${approval.spender.slice(-4)}`}
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs gap-2">
                                  <span className="text-muted-foreground">Allowance</span>
                                  <span className="font-mono text-right">
                                    {approval.allowanceFormatted === 'Unlimited' 
                                      ? '∞' 
                                      : `${parseFloat(approval.allowanceFormatted).toFixed(4)} ${approval.token.symbol}`
                                    }
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs gap-2">
                                  <span className="text-muted-foreground">Spender Address</span>
                                  <span className="font-mono text-right text-muted-foreground">
                                    {approval.spender.slice(0, 6)}...{approval.spender.slice(-4)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </>
            ) : null}
          </TabsContent>

        </Tabs>

        <Dialog open={isChainSelectOpen} onOpenChange={setIsChainSelectOpen}>
          <DialogContent className="max-w-[380px]">
            <DialogHeader>
              <DialogTitle className="text-sm">Select Chain</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Input
                placeholder="Search chains..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 text-xs"
              />
              <ScrollArea className="h-[300px]">
                <div className="space-y-1">
                  {filteredChains.map((chain) => (
                    <div
                      key={chain.id}
                      onClick={() => {
                        if (selectingFor === 'from') {
                          setFromChain(chain)
                        } else if (selectingFor === 'to') {
                          setToChain(chain)
                        } else if (selectingFor === 'batch') {
                          setBatchChain(chain)
                        } else if (selectingFor === 'revoke') {
                          setRevokeChain(chain)
                        }
                        setIsChainSelectOpen(false)
                        setSearchTerm('')
                      }}
                      className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-pointer"
                    >
                      {chain.iconUrl && (
                        <img src={chain.iconUrl} alt="" className="h-5 w-5 rounded-full" />
                      )}
                      <div className="text-xs">{chain.displayName}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isTokenSelectOpen} onOpenChange={(open) => {
          setIsTokenSelectOpen(open)
          if (open) {
            console.log('Token selector opened for:', selectingFor)
            console.log('Active currencies:', activeCurrencies.length)
            console.log('From currencies:', fromCurrencies.length)
            console.log('To currencies:', toCurrencies.length)
          }
        }}>
          <DialogContent className="max-w-[380px]">
            <DialogHeader>
              <DialogTitle className="text-sm">Select Token ({selectingFor})</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Input
                placeholder="Search tokens or paste contract address..."
                value={tokenSearchTerm}
                onChange={(e) => setTokenSearchTerm(e.target.value)}
                className="h-8 text-xs"
              />
              {(isSearchingExternal || externalSearchResults.length > 0) && (
                <div className="text-xs text-muted-foreground px-1">
                  {isSearchingExternal ? 'Searching for token...' : `Found ${externalSearchResults.length} external token(s)`}
                </div>
              )}
              <ScrollArea className="h-[300px]">
                <div className="space-y-1">
                  {filteredCurrencies.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center p-4">
                      No tokens found. Try selecting a chain first.
                    </div>
                  ) : (
                    filteredCurrencies.map((currency) => (
                    <div
                      key={`${currency.chainId}-${currency.address}`}
                      onClick={async () => {
                        if (selectingFor === 'batch') {
                          // Add token to batch tokens if not already added
                          const alreadyAdded = batchTokens.some(
                            wt => wt.token.address.toLowerCase() === currency.address.toLowerCase() &&
                                  wt.token.chainId === currency.chainId
                          )
                          
                          if (alreadyAdded) {
                            toast.info(`${currency.symbol} already added`)
                            setIsTokenSelectOpen(false)
                            setTokenSearchTerm('')
                            return
                          }
                          
                          // Try to fetch the actual balance for this token
                          let balance = '0'
                          let balanceFormatted = '0'
                          
                          try {
                            const vmType = batchChain?.vmType || 'evm'
                            
                            if (vmType === 'evm' || vmType === 'hypevm') {
                              const { createPublicClient, http, defineChain } = await import('viem')
                              
                              if (batchChain) {
                                const chainConfig = defineChain({
                                  id: batchChain.id,
                                  name: batchChain.displayName,
                                  nativeCurrency: {
                                    name: batchChain.currency.name,
                                    symbol: batchChain.currency.symbol,
                                    decimals: batchChain.currency.decimals,
                                  },
                                  rpcUrls: {
                                    default: { http: [batchChain.httpRpcUrl] },
                                  },
                                })
                                
                                const publicClient = createPublicClient({
                                  chain: chainConfig,
                                  transport: http(batchChain.httpRpcUrl),
                                })
                                
                                let balanceBigInt = BigInt(0)
                                
                                if (currency.metadata?.isNative) {
                                  balanceBigInt = await publicClient.getBalance({
                                    address: address as `0x${string}`,
                                  })
                                } else {
                                  balanceBigInt = await publicClient.readContract({
                                    address: currency.address as `0x${string}`,
                                    abi: [{
                                      name: 'balanceOf',
                                      type: 'function',
                                      stateMutability: 'view',
                                      inputs: [{ name: 'account', type: 'address' }],
                                      outputs: [{ name: 'balance', type: 'uint256' }],
                                    }],
                                    functionName: 'balanceOf',
                                    args: [address as `0x${string}`],
                                  })
                                }
                                
                                balance = balanceBigInt.toString()
                                balanceFormatted = formatUnits(balanceBigInt, currency.decimals)
                              }
                            }
                          } catch (e) {
                            console.error('Failed to fetch balance for manually added token:', e)
                            // Continue with 0 balance
                          }
                          
                          const newToken: WalletToken = {
                            token: currency,
                            balance,
                            balanceFormatted,
                          }
                          
                          setBatchTokens([...batchTokens, newToken])
                          toast.success(`Added ${currency.symbol} to batch swap${balanceFormatted !== '0' ? ` (Balance: ${balanceFormatted})` : ''}`)
                        } else if (selectingFor === 'from') {
                          setFromToken(currency)
                          // If toToken is the same and chains are the same, clear toToken
                          if (toToken && toChain && fromChain && 
                              fromChain.id === toChain.id && 
                              currency.address.toLowerCase() === toToken.address.toLowerCase()) {
                            setToToken(null)
                          }
                        } else {
                          setToToken(currency)
                          // If fromToken is the same and chains are the same, clear fromToken
                          if (fromToken && fromChain && toChain && 
                              fromChain.id === toChain.id && 
                              currency.address.toLowerCase() === fromToken.address.toLowerCase()) {
                            setFromToken(null)
                          }
                        }
                        setIsTokenSelectOpen(false)
                        setTokenSearchTerm('')
                      }}
                      className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-pointer"
                    >
                      {currency.metadata?.logoURI && (
                        <img src={currency.metadata.logoURI} alt="" className="h-5 w-5 rounded-full" />
                      )}
                      <div className="flex-1">
                        <div className="text-xs font-medium">{currency.symbol}</div>
                        <div className="text-xs text-muted-foreground">{currency.name}</div>
                      </div>
                    </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
          <DialogContent className="max-w-[380px]">
            <DialogHeader>
              <DialogTitle className="text-sm">Top Swappers This Week</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {leaderboard.slice(0, 10).map((entry) => (
                  <div key={entry.address} className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <div className="text-xs font-bold">#{entry.rank}</div>
                      <div className="text-xs">{entry.address.slice(0, 6)}...{entry.address.slice(-4)}</div>
                    </div>
                    <div className="text-xs font-medium">{entry.swapCount} swaps</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="max-w-[380px]">
            <DialogHeader>
              <DialogTitle className="text-sm">Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Slippage Tolerance</label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {['0.1', '0.5', '1.0', '3.0'].map((val) => (
                    <Button
                      key={val}
                      variant={slippage === val ? 'default' : 'outline'}
                      onClick={() => setSlippage(val)}
                      className="h-9 text-xs"
                    >
                      {val}%
                    </Button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    type="number"
                    value={slippage}
                    onChange={(e) => {
                      const value = sanitizeInput(e.target.value)
                      if (!value || validateSlippage(value)) {
                        setSlippage(value)
                      }
                    }}
                    className="h-9 text-xs"
                    step="0.1"
                    max="50"
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Transaction reverts if price changes unfavorably by more than this
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-sm font-medium mb-1">Swap Sources</div>
                <div className="text-xs text-muted-foreground mb-2">
                  Select DEXs to include in routing
                </div>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {swapSources.map((source) => (
                      <div key={source} className="flex items-center justify-between p-2 rounded bg-muted">
                        <span className="text-xs">{source}</span>
                        <Switch
                          checked={enabledSources[source] || false}
                          onCheckedChange={(checked) => {
                            setEnabledSources(prev => ({ ...prev, [source]: checked }))
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showAirdrops} onOpenChange={setShowAirdrops}>
          <DialogContent className="max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="text-sm flex items-center gap-2">
                <Gift className="h-4 w-4" />
                Claimable Airdrops
              </DialogTitle>
            </DialogHeader>
            
            {isLoadingAirdrops ? (
              <div className="p-8 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent to-primary animate-pulse mx-auto" />
                <div className="text-sm text-muted-foreground">Checking for airdrops...</div>
              </div>
            ) : airdrops.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <div className="text-sm text-muted-foreground">No claimable airdrops found</div>
                <div className="text-xs text-muted-foreground">
                  We'll notify you when airdrops become available
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={checkAirdrops}
                  className="h-8 text-xs"
                >
                  Check Again
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20 rounded">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {airdrops.length} Airdrop{airdrops.length !== 1 ? 's' : ''} Available
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Claim directly from this app
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={checkAirdrops}
                      disabled={isLoadingAirdrops}
                      className="h-7 text-xs"
                    >
                      Refresh
                    </Button>
                  </div>
                </div>

                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {airdrops.map((airdrop) => (
                      <div key={airdrop.id} className="p-3 border rounded hover:bg-muted/50 transition-colors">
                        <div className="space-y-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {airdrop.logo ? (
                                <img src={airdrop.logo} alt="" className="h-8 w-8 rounded-full flex-shrink-0" />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-primary flex-shrink-0" />
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium">{airdrop.name}</div>
                                <div className="text-xs text-muted-foreground">{airdrop.protocol}</div>
                              </div>
                            </div>
                            <Badge variant="default" className="text-xs">
                              {airdrop.chainName}
                            </Badge>
                          </div>

                          <div className="text-xs text-muted-foreground">
                            {airdrop.description}
                          </div>

                          <Separator />

                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs gap-2">
                              <span className="text-muted-foreground">Amount</span>
                              <span className="font-medium text-accent">
                                {airdrop.amount} {airdrop.tokenSymbol}
                              </span>
                            </div>
                          </div>

                          <Button
                            onClick={() => claimAirdrop(airdrop)}
                            disabled={isClaiming}
                            variant="default"
                            size="sm"
                            className="w-full h-8 text-xs"
                          >
                            {isClaiming ? 'Claiming...' : `Claim ${airdrop.amount} ${airdrop.tokenSymbol}`}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
