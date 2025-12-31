import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { relayAPI } from '@/lib/relay/api'
import type { RelayChain, RelayCurrency, RelayQuote } from '@/lib/relay/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { ArrowDownUp, TrendingUp, Trophy, Share2, Flame, X, ChevronDown, Wallet } from 'lucide-react'

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
  fromToken: string
  toToken: string
  fromAmount: string
  toAmount: string
  fromChain: string
  toChain: string
  status: string
  timestamp: number
  txHash?: string
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
  const { address, isConnected, chainId: connectedChainId } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
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
  const [selectingFor, setSelectingFor] = useState<'from' | 'to' | 'batch'>('from')
  const [currencies, setCurrencies] = useState<RelayCurrency[]>([])
  const [fromCurrencies, setFromCurrencies] = useState<RelayCurrency[]>([])
  const [toCurrencies, setToCurrencies] = useState<RelayCurrency[]>([])
  const [trendingTokens, setTrendingTokens] = useState<TrendingToken[]>([])
  const [swapHistory, setSwapHistory] = useState<SwapHistory[]>([])
  const [userStreak, setUserStreak] = useState<UserStreak>({ currentStreak: 0, lastSwapTimestamp: 0, totalSwaps: 0 })
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [showLeaderboard, setShowLeaderboard] = useState(false)
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

  const { sendTransaction, data: txHash, isPending: isTxPending, error: txError } = useSendTransaction()
  const { isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  const { data: fromBalance } = useBalance({
    address,
    chainId: fromChain?.id,
    token: fromToken?.address !== '0x0000000000000000000000000000000000000000' ? fromToken?.address as `0x${string}` : undefined,
  })

  const { data: toBalance } = useBalance({
    address,
    chainId: toChain?.id,
    token: toToken?.address !== '0x0000000000000000000000000000000000000000' ? toToken?.address as `0x${string}` : undefined,
  })

  useEffect(() => {
    sdk.actions.ready().catch(() => {})
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

  useEffect(() => {
    if (toToken && toChain) {
      fetchTokenPrice(toToken.address, toChain.id, 'to')
    }
  }, [toToken, toChain])

  useEffect(() => {
    if (fromChain) {
      loadCurrencies(fromChain.id, 'from')
    }
  }, [fromChain])

  useEffect(() => {
    if (toChain) {
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
    }
  }, [address, chains])

  useEffect(() => {
    loadLeaderboard()
  }, [])

  useEffect(() => {
    if (address && fromChain && isConnected) {
      loadWalletTokens()
    }
  }, [address, fromChain, isConnected])

  useEffect(() => {
    if (address && batchChain && isConnected) {
      loadBatchWalletTokens()
    }
  }, [address, batchChain, isConnected])

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
          setToToken(defaultToken)
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
    if (!address || !batchChain) {
      console.log('Missing address or batchChain:', { address, batchChain })
      return
    }
    
    const chain = batchChain
    const isEVM = chain.vmType === 'evm' || !chain.vmType
    
    console.log('Loading batch tokens for chain:', chain.displayName, 'isEVM:', isEVM)
    
    if (!isEVM) {
      toast.error('Batch swap only supports EVM chains')
      return
    }
    
    setIsLoadingBatchTokens(true)
    try {
      console.log('Fetching currencies for chain:', chain.id)
      
      // Fetch more tokens to increase chances of finding tokens with balance
      const fetchedCurrencies = await relayAPI.getCurrencies({
        chainIds: [chain.id],
        defaultList: true,
        limit: 250,
      })
      
      console.log('Fetched currencies:', fetchedCurrencies.length)
      
      const tokensWithBalances: WalletToken[] = []
      
      // Process tokens in batches to avoid overwhelming the RPC
      const batchSize = 10
      for (let i = 0; i < fetchedCurrencies.length; i += batchSize) {
        const batch = fetchedCurrencies.slice(i, i + batchSize)
        
        await Promise.all(batch.map(async (currency) => {
          try {
            let balance = BigInt(0)
            
            if (currency.metadata?.isNative) {
              try {
                const response = await fetch(chain.httpRpcUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'eth_getBalance',
                    params: [address, 'latest'],
                    id: 1
                  })
                })
                
                const result = await response.json()
                if (result.result) {
                  balance = BigInt(result.result)
                }
              } catch (e) {
                console.error('Failed to fetch native balance:', e)
              }
            } else {
              const balanceData = `0x70a08231000000000000000000000000${address.slice(2)}`
              
              try {
                const response = await fetch(chain.httpRpcUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'eth_call',
                    params: [{
                      to: currency.address,
                      data: balanceData
                    }, 'latest'],
                    id: 1
                  })
                })
                
                const result = await response.json()
                if (result.result && result.result !== '0x') {
                  balance = BigInt(result.result)
                }
              } catch (e) {
                // Silently skip tokens that fail
              }
            }
            
            const balanceFormatted = formatUnits(balance, currency.decimals)
            
            // Lower threshold to catch more tokens
            if (parseFloat(balanceFormatted) > 0.00000001) {
              tokensWithBalances.push({
                token: currency,
                balance: balance.toString(),
                balanceFormatted,
              })
            }
          } catch (e) {
            // Silently skip problematic tokens
          }
        }))
        
        // Update UI progressively as we find tokens
        if (tokensWithBalances.length > 0) {
          const sorted = [...tokensWithBalances].sort((a, b) => parseFloat(b.balanceFormatted) - parseFloat(a.balanceFormatted))
          setWalletTokens(sorted)
          setBatchTokens(sorted.slice(0, 10))
        }
      }
      
      console.log('Tokens with balances found:', tokensWithBalances.length)
      
      const sorted = tokensWithBalances.sort((a, b) => parseFloat(b.balanceFormatted) - parseFloat(a.balanceFormatted))
      
      setWalletTokens(sorted)
      setBatchTokens(sorted.slice(0, 10))
      
      if (tokensWithBalances.length > 0) {
        toast.success(`Found ${tokensWithBalances.length} tokens with balance`)
      } else {
        toast.info('No tokens with balance found. Try a different chain or add tokens manually.')
      }
    } catch (error) {
      console.error('Failed to load wallet tokens:', error)
      toast.error('Failed to load wallet tokens')
    } finally {
      setIsLoadingBatchTokens(false)
    }
  }

  const searchTokenByContract = async (contractAddress: string) => {
    if (!contractAddress) {
      toast.error('Please enter a contract address')
      return
    }
    
    try {
      console.log('Searching for token:', contractAddress)
      
      const allChainIds = chains.map(c => c.id)
      
      const results = await relayAPI.getCurrencies({
        address: contractAddress,
        useExternalSearch: true,
        limit: 10,
        includeAllChains: true,
      })
      
      console.log('Search results:', results)
      
      if (results.length > 0) {
        setCurrencies(results)
        
        if (results[0].chainId && fromChain?.id !== results[0].chainId) {
          const tokenChain = chains.find(c => c.id === results[0].chainId)
          if (tokenChain) {
            setFromChain(tokenChain)
          }
        }
        
        setFromToken(results[0])
        toast.success(`Found ${results[0].symbol} on ${results[0].chainId}`)
        setContractAddressSearch('')
      } else {
        toast.error('Token not found on any supported chain')
      }
    } catch (error) {
      console.error('Failed to search token:', error)
      toast.error('Failed to search token')
    }
  }

  const fetchQuote = async () => {
    if (!fromToken || !toToken || !fromAmount || !fromChain || !toChain || !address) return

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
      
      const quoteParams = {
        user: address,
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
      // Use execute endpoint to get fresh transaction data
      console.log('Executing swap via Relay API...')
      const amountInWei = parseUnits(fromAmount, fromToken.decimals)
      const slippageBps = Math.floor(parseFloat(slippage) * 100).toString()
      
      const includedSources = Object.entries(enabledSources)
        .filter(([_, enabled]) => enabled)
        .map(([source]) => source)
      
      const executeParams = {
        user: address,
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
      
      console.log('Execute swap params:', {
        ...executeParams,
        fromToken: fromToken.symbol,
        toToken: toToken.symbol,
        fromChain: fromChain.displayName,
        toChain: toChain.displayName,
        fromTokenIsNative: fromToken.metadata?.isNative,
        toTokenIsNative: toToken.metadata?.isNative,
      })
      
      const freshQuote = await relayAPI.executeSwap(executeParams)
      
      console.log('Fresh quote received:', {
        steps: freshQuote.steps.length,
        fees: freshQuote.fees,
        details: freshQuote.details,
      })

      const depositStep = freshQuote.steps.find(s => s.id === 'deposit')
      if (!depositStep || !depositStep.items || depositStep.items.length === 0) {
        throw new Error('No deposit step found in fresh quote')
      }

      const txData = depositStep.items[0].data
      
      console.log('Executing swap transaction:', {
        to: txData.to,
        value: txData.value,
        data: txData.data?.slice(0, 20) + '...',
        chainId: txData.chainId,
        connectedChainId,
        recipientAddress,
        requestId: depositStep.requestId,
      })

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

      sendTransaction({
        to: txData.to as `0x${string}`,
        data: txData.data as `0x${string}`,
        value: BigInt(txData.value),
        chainId: txData.chainId,
      }, {
        onSuccess: async (hash) => {
          console.log('Transaction submitted successfully:', hash)
          toast.success('Transaction submitted')
          
          // Index the transaction with Relay
          try {
            console.log('Indexing transaction with Relay:', hash, 'on chain', txData.chainId)
            await relayAPI.indexSingleTransaction({
              txHash: hash,
              chainId: txData.chainId,
            })
            console.log('Transaction indexed successfully')
          } catch (indexError) {
            console.error('Failed to index transaction:', indexError)
            // Continue anyway - the transaction is still submitted
          }
          
          if (depositStep.requestId) {
            console.log('Monitoring swap status with requestId:', depositStep.requestId)
            monitorSwapStatus(depositStep.requestId)
          } else {
            console.warn('No requestId found, cannot monitor status')
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

      console.log('Getting batch swap quote for', origins.length, 'tokens')

      const multiQuote = await relayAPI.getMultiInputQuote({
        user: address,
        origins,
        destinationCurrency: toToken.address,
        destinationChainId: toChain.id,
        tradeType: 'EXACT_INPUT',
      })

      console.log('Batch quote received, executing transactions...')

      let successCount = 0
      for (const step of multiQuote.steps) {
        if (step.id === 'deposit' && step.items) {
          for (const item of step.items) {
            const txData = item.data
            sendTransaction({
              to: txData.to as `0x${string}`,
              data: txData.data as `0x${string}`,
              value: BigInt(txData.value),
              chainId: txData.chainId,
            }, {
              onSuccess: () => {
                successCount++
              },
              onError: (error) => {
                console.error('Transaction failed:', error)
              }
            })
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
      }

      toast.success(`Batch swap initiated`)
      updateUserStreak()
      setBatchTokens([])
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
    
    try {
      const { requests } = await relayAPI.getRequests({
        user: address,
        limit: 20,
        sortBy: 'createdAt',
        sortDirection: 'desc',
      })
      
      const history: SwapHistory[] = requests.map(req => {
        const originChainId = req.data.inTxs[0]?.chainId
        const destChainId = req.data.outTxs[0]?.chainId
        
        const originChain = chains.find(c => c.id === originChainId)
        const destChain = chains.find(c => c.id === destChainId)
        
        const fromValue = req.data.inTxs[0]?.data?.value || '0'
        const toValue = req.data.outTxs[0]?.data?.value || '0'
        
        const fromAmountFormatted = fromValue.length > 10 
          ? parseFloat(formatUnits(BigInt(fromValue), 18)).toFixed(6)
          : fromValue
        const toAmountFormatted = toValue.length > 10
          ? parseFloat(formatUnits(BigInt(toValue), 18)).toFixed(6)
          : toValue
        
        return {
          id: req.id,
          fromToken: originChain?.currency?.symbol || req.data.currency || 'ETH',
          toToken: destChain?.currency?.symbol || req.data.currency || 'ETH',
          fromAmount: fromAmountFormatted,
          toAmount: toAmountFormatted,
          fromChain: originChain?.displayName || originChain?.name || 'Unknown',
          toChain: destChain?.displayName || destChain?.name || 'Unknown',
          status: req.status,
          timestamp: new Date(req.createdAt).getTime(),
          txHash: req.data.outTxs[0]?.hash,
        }
      })
      
      setSwapHistory(history)
    } catch (error) {
      console.error('Failed to load swap history:', error)
    }
  }

  const loadUserStreak = () => {
    if (!address) return
    
    const stored = localStorage.getItem(`streak_${address}`)
    if (stored) {
      const streak = JSON.parse(stored)
      const now = Date.now()
      const timeSinceLastSwap = now - streak.lastSwapTimestamp
      const twentyFourHours = 24 * 60 * 60 * 1000
      
      if (timeSinceLastSwap > twentyFourHours) {
        streak.currentStreak = 0
      }
      
      setUserStreak(streak)
    }
  }

  const updateUserStreak = () => {
    if (!address) return
    
    const now = Date.now()
    const stored = localStorage.getItem(`streak_${address}`)
    const current = stored ? JSON.parse(stored) : { currentStreak: 0, lastSwapTimestamp: 0, totalSwaps: 0 }
    
    const timeSinceLastSwap = now - current.lastSwapTimestamp
    const twentyFourHours = 24 * 60 * 60 * 1000
    
    let newStreak = current.currentStreak
    let showStreakMessage = false
    
    if (current.lastSwapTimestamp === 0) {
      newStreak = 1
    } else if (timeSinceLastSwap <= twentyFourHours) {
      newStreak = current.currentStreak + 1
      showStreakMessage = true
    } else {
      newStreak = 1
    }
    
    const updated = {
      currentStreak: newStreak,
      lastSwapTimestamp: now,
      totalSwaps: current.totalSwaps + 1,
    }
    
    localStorage.setItem(`streak_${address}`, JSON.stringify(updated))
    setUserStreak(updated)
    
    if (showStreakMessage) {
      const randomMessage = STREAK_MESSAGES[Math.floor(Math.random() * STREAK_MESSAGES.length)]
      toast.success(randomMessage, {
        duration: 3000,
      })
    }
  }

  const loadLeaderboard = () => {
    const stored = localStorage.getItem('leaderboard')
    if (stored) {
      setLeaderboard(JSON.parse(stored))
    } else {
      setLeaderboard([])
    }
  }

  const updateLeaderboard = () => {
    if (!address) return
    
    const stored = localStorage.getItem('leaderboard')
    const current: LeaderboardEntry[] = stored ? JSON.parse(stored) : []
    
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
    
    localStorage.setItem('leaderboard', JSON.stringify(current))
    setLeaderboard(current)
  }

  const loadUserData = () => {
    if (address) {
      loadUserStreak()
      loadSwapHistory()
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
    const text = `Just swapped ${swap.fromAmount} ${swap.fromToken} to ${swap.toAmount} ${swap.toToken} on Relay!`
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
  }

  const filteredChains = chains.filter(chain =>
    chain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chain.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activeCurrencies = selectingFor === 'from' ? fromCurrencies : selectingFor === 'to' ? toCurrencies : currencies
  
  const filteredCurrencies = activeCurrencies.filter(currency =>
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
                onClick={() => disconnect()}
                className="h-7 text-xs px-2"
              >
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </Button>
            </div>
          </div>
        )}

        <Tabs defaultValue="swap" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-8">
            <TabsTrigger value="swap" className="text-xs">Swap</TabsTrigger>
            <TabsTrigger value="batch" className="text-xs">Batch</TabsTrigger>
            <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
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
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="text-lg h-10"
                  />
                  {fromAmount && fromTokenPrice > 0 && (
                    <div className="text-xs text-muted-foreground px-1">
                      ≈ ${(parseFloat(fromAmount) * fromTokenPrice).toFixed(2)}
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
              </Card>
            )}

            <Button
              onClick={executeSwap}
              disabled={(() => {
                if (!quote || isSwapping || !isConnected) return true
                
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
                    setSelectingFor('from')
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

                <Button
                  onClick={executeBatchSwap}
                  disabled={batchTokens.length === 0 || isSwapping || !isConnected}
                  className="w-full h-8 text-xs"
                >
                  {isSwapping ? 'Swapping...' : 'Execute Batch Swap'}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-2">
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {swapHistory.length === 0 ? (
                  <Card className="p-4 text-center text-sm text-muted-foreground">
                    No swap history yet
                  </Card>
                ) : (
                  swapHistory.map((swap) => (
                    <Card key={swap.id} className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-medium">
                            {swap.fromToken} → {swap.toToken}
                          </div>
                          <Badge variant={swap.status === 'success' ? 'default' : 'secondary'} className="text-xs">
                            {swap.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(swap.timestamp).toLocaleString()}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs">
                            {swap.fromAmount} {swap.fromToken} on {swap.fromChain}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => shareSwapReceipt(swap)}
                            className="h-6 w-6 p-0"
                          >
                            <Share2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          → {swap.toAmount} {swap.toToken} on {swap.toChain}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="space-y-3 mt-2">
            <Card className="p-3">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Token Search</label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="0x..."
                      value={contractAddressSearch}
                      onChange={(e) => setContractAddressSearch(e.target.value)}
                      className="h-9 text-xs"
                    />
                    <Button
                      onClick={() => searchTokenByContract(contractAddressSearch)}
                      size="sm"
                      className="h-9 px-4 text-xs bg-primary"
                    >
                      Search
                    </Button>
                  </div>
                </div>

                <Separator />

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
                      onChange={(e) => setSlippage(e.target.value)}
                      className="h-9 text-xs"
                      step="0.1"
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
                </div>
              </div>
            </Card>
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
                placeholder="Search tokens..."
                value={tokenSearchTerm}
                onChange={(e) => setTokenSearchTerm(e.target.value)}
                className="h-8 text-xs"
              />
              <div className="text-xs text-muted-foreground px-1">
                {filteredCurrencies.length} tokens available (from {activeCurrencies.length} total)
              </div>
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
                      onClick={() => {
                        if (selectingFor === 'from') {
                          setFromToken(currency)
                        } else {
                          setToToken(currency)
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
      </div>
    </div>
  )
}
