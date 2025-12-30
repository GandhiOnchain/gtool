import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { relayAPI } from '@/lib/relay/api'
import type { RelayChain, RelayCurrency, RelayQuote, RelayStatus } from '@/lib/relay/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { ArrowDownUp, Search, Settings, History, TrendingUp, Trophy, Share2, Flame, X, ChevronDown } from 'lucide-react'

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
  lastSwapDate: string
  totalSwaps: number
}

interface LeaderboardEntry {
  address: string
  swapCount: number
  volume: string
  rank: number
}

export default function RelaySwap() {
  const { address, isConnected } = useAccount()
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
  const [slippage, setSlippage] = useState('50')
  const [searchTerm, setSearchTerm] = useState('')
  const [tokenSearchTerm, setTokenSearchTerm] = useState('')
  const [isChainSelectOpen, setIsChainSelectOpen] = useState(false)
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false)
  const [selectingFor, setSelectingFor] = useState<'from' | 'to'>('from')
  const [selectingType, setSelectingType] = useState<'chain' | 'token'>('chain')
  const [currencies, setCurrencies] = useState<RelayCurrency[]>([])
  const [trendingTokens, setTrendingTokens] = useState<TrendingToken[]>([])
  const [swapHistory, setSwapHistory] = useState<SwapHistory[]>([])
  const [userStreak, setUserStreak] = useState<UserStreak>({ currentStreak: 0, lastSwapDate: '', totalSwaps: 0 })
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [batchTokens, setBatchTokens] = useState<Array<{ token: RelayCurrency; amount: string }>>([])
  const [contractAddressSearch, setContractAddressSearch] = useState('')

  const { sendTransaction, data: txHash } = useSendTransaction()
  const { isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  const { data: fromBalance } = useBalance({
    address,
    chainId: fromChain?.id,
    token: fromToken?.address !== '0x0000000000000000000000000000000000000000' ? fromToken?.address as `0x${string}` : undefined,
  })

  useEffect(() => {
    sdk.actions.ready().catch(() => {})
  }, [])

  useEffect(() => {
    loadChains()
    loadUserData()
    loadTrendingTokens()
  }, [])

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
    if (address) {
      loadSwapHistory()
      loadUserStreak()
    }
  }, [address])

  useEffect(() => {
    loadLeaderboard()
  }, [])

  useEffect(() => {
    if (address && fromChain && fromToken) {
      loadWalletTokensForBatch()
    }
  }, [address, fromChain])

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

  const loadCurrencies = async (chainId: number, type: 'from' | 'to') => {
    try {
      const fetchedCurrencies = await relayAPI.getCurrencies({
        chainIds: [chainId],
        defaultList: true,
        limit: 100,
      })
      setCurrencies(fetchedCurrencies)
      
      if (fetchedCurrencies.length > 0) {
        const nativeToken = fetchedCurrencies.find(c => c.metadata?.isNative)
        const defaultToken = nativeToken || fetchedCurrencies[0]
        if (type === 'from') {
          setFromToken(defaultToken)
        } else {
          setToToken(defaultToken)
        }
      }
    } catch (error) {
      console.error('Failed to load currencies:', error)
    }
  }

  const searchTokenByContract = async (contractAddress: string) => {
    if (!contractAddress || !fromChain) return
    
    try {
      const results = await relayAPI.getCurrencies({
        address: contractAddress,
        chainIds: [fromChain.id],
        useExternalSearch: true,
        limit: 10,
      })
      
      if (results.length > 0) {
        setCurrencies(results)
        toast.success(`Found ${results.length} token(s)`)
      } else {
        toast.error('Token not found')
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
      const quoteData = await relayAPI.getQuote({
        user: address,
        originChainId: fromChain.id,
        destinationChainId: toChain.id,
        originCurrency: fromToken.address,
        destinationCurrency: toToken.address,
        amount: amountInWei.toString(),
        tradeType: 'EXACT_INPUT',
        slippageTolerance: slippage,
      })
      
      setQuote(quoteData)
      if (quoteData.details.currencyOut) {
        setToAmount(quoteData.details.currencyOut.amountFormatted)
      }
    } catch (error) {
      console.error('Failed to fetch quote:', error)
      toast.error('Failed to get quote')
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

    setIsSwapping(true)
    try {
      const depositStep = quote.steps.find(s => s.id === 'deposit')
      if (!depositStep || !depositStep.items || depositStep.items.length === 0) {
        throw new Error('No deposit step found')
      }

      const txData = depositStep.items[0].data
      
      sendTransaction({
        to: txData.to as `0x${string}`,
        data: txData.data as `0x${string}`,
        value: BigInt(txData.value),
        chainId: txData.chainId,
      })

      if (depositStep.requestId) {
        monitorSwapStatus(depositStep.requestId)
      }
    } catch (error) {
      console.error('Swap failed:', error)
      toast.error('Swap failed')
      setIsSwapping(false)
    }
  }

  const monitorSwapStatus = async (requestId: string) => {
    const maxAttempts = 60
    let attempts = 0

    const checkStatus = async () => {
      try {
        const status = await relayAPI.getStatus(requestId)
        
        if (status.status === 'success') {
          toast.success('Swap completed successfully')
          setIsSwapping(false)
          loadSwapHistory()
          updateUserStreak()
          return
        } else if (status.status === 'failure' || status.status === 'refunded') {
          toast.error(`Swap ${status.status}`)
          setIsSwapping(false)
          return
        }

        attempts++
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 2000)
        } else {
          toast.error('Swap status check timeout')
          setIsSwapping(false)
        }
      } catch (error) {
        console.error('Failed to check status:', error)
        attempts++
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 2000)
        } else {
          setIsSwapping(false)
        }
      }
    }

    checkStatus()
  }

  const executeBatchSwap = async () => {
    if (!toToken || !toChain || !address || batchTokens.length === 0) {
      toast.error('Please select tokens to swap')
      return
    }

    setIsSwapping(true)
    try {
      const origins = batchTokens.map(bt => ({
        chainId: fromChain!.id,
        currency: bt.token.address,
        amount: parseUnits(bt.amount, bt.token.decimals).toString(),
      }))

      const multiQuote = await relayAPI.getMultiInputQuote({
        user: address,
        origins,
        destinationCurrency: toToken.address,
        destinationChainId: toChain.id,
        tradeType: 'EXACT_INPUT',
      })

      for (const step of multiQuote.steps) {
        if (step.id === 'deposit' && step.items) {
          for (const item of step.items) {
            const txData = item.data
            sendTransaction({
              to: txData.to as `0x${string}`,
              data: txData.data as `0x${string}`,
              value: BigInt(txData.value),
              chainId: txData.chainId,
            })
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
      }

      toast.success('Batch swap initiated')
      setBatchTokens([])
    } catch (error) {
      console.error('Batch swap failed:', error)
      toast.error('Batch swap failed')
    } finally {
      setIsSwapping(false)
    }
  }

  const loadWalletTokensForBatch = async () => {
    if (!address || !fromChain) return
    
    try {
      const tokens = await relayAPI.getCurrencies({
        chainIds: [fromChain.id],
        defaultList: true,
        limit: 50,
      })
      
      setCurrencies(tokens)
    } catch (error) {
      console.error('Failed to load wallet tokens:', error)
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
      
      const history: SwapHistory[] = requests.map(req => ({
        id: req.id,
        fromToken: req.data.currency,
        toToken: req.data.currency,
        fromAmount: req.data.price,
        toAmount: req.data.price,
        fromChain: req.data.inTxs[0]?.chainId.toString() || '',
        toChain: req.data.outTxs[0]?.chainId.toString() || '',
        status: req.status,
        timestamp: new Date(req.createdAt).getTime(),
        txHash: req.data.outTxs[0]?.hash,
      }))
      
      setSwapHistory(history)
    } catch (error) {
      console.error('Failed to load swap history:', error)
    }
  }

  const loadUserStreak = () => {
    if (!address) return
    
    const stored = localStorage.getItem(`streak_${address}`)
    if (stored) {
      setUserStreak(JSON.parse(stored))
    }
  }

  const updateUserStreak = () => {
    if (!address) return
    
    const today = new Date().toDateString()
    const stored = localStorage.getItem(`streak_${address}`)
    const current = stored ? JSON.parse(stored) : { currentStreak: 0, lastSwapDate: '', totalSwaps: 0 }
    
    const lastDate = new Date(current.lastSwapDate).toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    
    let newStreak = current.currentStreak
    if (lastDate === yesterday) {
      newStreak += 1
    } else if (lastDate !== today) {
      newStreak = 1
    }
    
    const updated = {
      currentStreak: newStreak,
      lastSwapDate: today,
      totalSwaps: current.totalSwaps + 1,
    }
    
    localStorage.setItem(`streak_${address}`, JSON.stringify(updated))
    setUserStreak(updated)
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

  const filteredChains = chains.filter(chain =>
    chain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chain.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredCurrencies = currencies.filter(currency =>
    currency.symbol.toLowerCase().includes(tokenSearchTerm.toLowerCase()) ||
    currency.name.toLowerCase().includes(tokenSearchTerm.toLowerCase()) ||
    currency.address.toLowerCase().includes(tokenSearchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background p-2 max-w-[424px] mx-auto">
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg font-bold">RELAY</h1>
          <div className="flex items-center gap-1">
            {userStreak.currentStreak > 0 && (
              <Badge variant="secondary" className="gap-1 text-xs px-2 py-0.5">
                <Flame className="h-3 w-3" />
                {userStreak.currentStreak}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLeaderboard(true)}
              className="h-7 w-7 p-0"
            >
              <Trophy className="h-4 w-4" />
            </Button>
          </div>
        </div>

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
                      Balance: {parseFloat(formatUnits(fromBalance.value, fromBalance.decimals)).toFixed(4)}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectingFor('from')
                      setSelectingType('chain')
                      setIsChainSelectOpen(true)
                    }}
                    className="flex-1 justify-between h-10 text-xs"
                  >
                    <div className="flex items-center gap-1.5">
                      {fromChain?.logoUrl && (
                        <img src={fromChain.logoUrl} alt="" className="h-4 w-4 rounded-full" />
                      )}
                      <span>{fromChain?.displayName || 'Select'}</span>
                    </div>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectingFor('from')
                      setSelectingType('token')
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

                <Input
                  type="number"
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="text-lg h-10"
                />
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
                <div className="text-xs text-muted-foreground">To</div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectingFor('to')
                      setSelectingType('chain')
                      setIsChainSelectOpen(true)
                    }}
                    className="flex-1 justify-between h-10 text-xs"
                  >
                    <div className="flex items-center gap-1.5">
                      {toChain?.logoUrl && (
                        <img src={toChain.logoUrl} alt="" className="h-4 w-4 rounded-full" />
                      )}
                      <span>{toChain?.displayName || 'Select'}</span>
                    </div>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectingFor('to')
                      setSelectingType('token')
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
              </div>
            </Card>

            {quote && (
              <Card className="p-2">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rate</span>
                    <span>{quote.details.rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span>~{quote.details.timeEstimate}s</span>
                  </div>
                  {quote.fees.relayer && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fee</span>
                      <span>${quote.fees.relayer.amountUsd}</span>
                    </div>
                  )}
                </div>
              </Card>
            )}

            <Button
              onClick={executeSwap}
              disabled={!quote || isSwapping || !isConnected}
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
                <div className="text-xs text-muted-foreground">
                  Select multiple tokens from your wallet to swap to a single token
                </div>

                <div className="space-y-2">
                  {batchTokens.map((bt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-2 p-2 border rounded">
                        {bt.token.metadata?.logoURI && (
                          <img src={bt.token.metadata.logoURI} alt="" className="h-4 w-4 rounded-full" />
                        )}
                        <span className="text-xs">{bt.token.symbol}</span>
                      </div>
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={bt.amount}
                        onChange={(e) => {
                          const updated = [...batchTokens]
                          updated[i].amount = e.target.value
                          setBatchTokens(updated)
                        }}
                        className="w-24 h-8 text-xs"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setBatchTokens(batchTokens.filter((_, idx) => idx !== i))}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTokenSelectOpen(true)}
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
                        setSelectingType('chain')
                        setIsChainSelectOpen(true)
                      }}
                      className="flex-1 justify-between h-8 text-xs"
                    >
                      <div className="flex items-center gap-1.5">
                        {toChain?.logoUrl && (
                          <img src={toChain.logoUrl} alt="" className="h-4 w-4 rounded-full" />
                        )}
                        <span>{toChain?.displayName || 'Select'}</span>
                      </div>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectingFor('to')
                        setSelectingType('token')
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
                            {swap.fromAmount} on Chain {swap.fromChain}
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
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="space-y-2 mt-2">
            <Card className="p-3">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium">Slippage Tolerance (bps)</label>
                  <Input
                    type="number"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                    className="mt-1 h-8 text-xs"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Current: {(parseFloat(slippage) / 100).toFixed(2)}%
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-xs font-medium">Search Token by Contract</label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      placeholder="0x..."
                      value={contractAddressSearch}
                      onChange={(e) => setContractAddressSearch(e.target.value)}
                      className="h-8 text-xs"
                    />
                    <Button
                      onClick={() => searchTokenByContract(contractAddressSearch)}
                      size="sm"
                      className="h-8 text-xs"
                    >
                      <Search className="h-3 w-3" />
                    </Button>
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
                        } else {
                          setToChain(chain)
                        }
                        setIsChainSelectOpen(false)
                        setSearchTerm('')
                      }}
                      className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-pointer"
                    >
                      {chain.logoUrl && (
                        <img src={chain.logoUrl} alt="" className="h-5 w-5 rounded-full" />
                      )}
                      <div className="text-xs">{chain.displayName}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isTokenSelectOpen} onOpenChange={setIsTokenSelectOpen}>
          <DialogContent className="max-w-[380px]">
            <DialogHeader>
              <DialogTitle className="text-sm">Select Token</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Input
                placeholder="Search tokens..."
                value={tokenSearchTerm}
                onChange={(e) => setTokenSearchTerm(e.target.value)}
                className="h-8 text-xs"
              />
              <ScrollArea className="h-[300px]">
                <div className="space-y-1">
                  {filteredCurrencies.map((currency) => (
                    <div
                      key={`${currency.chainId}-${currency.address}`}
                      onClick={() => {
                        if (selectingFor === 'from') {
                          setFromToken(currency)
                        } else {
                          setToToken(currency)
                        }
                        if (selectingType === 'token' && batchTokens.length < 10) {
                          setBatchTokens([...batchTokens, { token: currency, amount: '' }])
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
                  ))}
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
