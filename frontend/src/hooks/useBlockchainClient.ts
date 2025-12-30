import { useMemo } from 'react'
import { 
  type Abi, 
  type ContractFunctionName,
  type ContractFunctionReturnType,
  createPublicClient, 
  http 
} from 'viem'
import { useQuery } from '@tanstack/react-query'
import { getRpcUrl, getChainById } from '../lib/blockchain/chains'
import { 
  type ReadContractParams, 
  BlockchainError 
} from '../lib/blockchain/types'


export interface UseBlockchainClientParams {
  /** Chain ID */
  chainId: number
}

/**
 * Parameters for low-level contract read hook
 */
export interface UseReadContractParams<
  TAbi extends Abi = Abi,
  TName extends ContractFunctionName<TAbi, 'pure' | 'view'> = ContractFunctionName<TAbi, 'pure' | 'view'>
> {
  /** Contract read parameters or null */
  params: ReadContractParams<TAbi, TName>
  /** Query options */
  options?: {
    /** Whether the query should run (default: true) */
    enabled?: boolean
    /** Auto refetch interval in ms */
    refetchInterval?: number
    /** Time in ms before data is considered stale (default: 5 minutes) */
    staleTime?: number
  }
}

/**
 * Parameters for low-level multi-contract read hook
 */
export interface UseMultiReadContractParams<T extends ReadonlyArray<ReadContractParams<Abi, ContractFunctionName<Abi, 'pure' | 'view'>>> = ReadonlyArray<ReadContractParams<Abi, ContractFunctionName<Abi, 'pure' | 'view'>>>> {
  /** Array of contract read requests */
  requests: T
  /** Query options */
  options?: {
    /** Whether the query should run (default: true) */
    enabled?: boolean
    /** Auto refetch interval in ms (optional) */
    refetchInterval?: number
    /** Time in ms before data is considered stale (default: 5 minutes) */
    staleTime?: number
  }
}

/**
 * Parameters for getting current block number
 */
export interface UseBlockNumberParams {
  /** Chain ID to query */
  chainId: number
  /** Query options */
  options?: {
    /** Whether the query should run (default: true) */
    enabled?: boolean
    /** Auto refetch interval in ms (default: 12 seconds) */
    refetchInterval?: number
  }
}

/**
 * Parameters for getting ETH balance
 */
export interface UseBalanceParams {
  /** Address to check balance for */
  address: string
  /** Chain ID to check on */
  chainId: number
  /** Query options */
  options?: {
    /** Whether the query should run (default: true) */
    enabled?: boolean
    /** Auto refetch interval in ms (default: 30 seconds) */
    refetchInterval?: number
  }
}

export interface UseTransactionReceiptParams {
  /** Transaction hash */
  txHash: string
  /** Chain ID */
  chainId: number
  /** Query options */
  options?: {
    /** Enable/disable */
    enabled?: boolean
    /** Refetch interval (ms) */
    refetchInterval?: number
  }
}

/**
 * Create a blockchain client for the specified chain
 * 
 * @example
 * ```typescript
 * const client = useBlockchainClient({ chainId: 8453 });
 * if (client) {
 *   const blockNumber = await client.getBlockNumber();
 * }
 * ```
 */
export function useBlockchainClient(params: UseBlockchainClientParams) {
  const { chainId } = params

  const client = useMemo(() => {
    try {
      const chain = getChainById(chainId)
      if (!chain) {
        throw new BlockchainError(`Unsupported chain ID: ${chainId}`, 'UNSUPPORTED_CHAIN')
      }

      return createPublicClient({
        chain,
        transport: http(getRpcUrl(chainId)),
      })
    } catch (error) {
      console.error(`Failed to create client for chain ${chainId}:`, error)
      return null
    }
  }, [chainId])

  return client
}

/**
 * Read contract data
 * 
 * @example
 * ```typescript
 * const { data } = useReadContract({
 *   params: {
 *     contractAddress: tokenAddress,
 *     chainId: 8453,
 *     abi: ERC20_ABI,
 *     functionName: 'balanceOf',
 *     args: [userAddress],
 *   }
 * });
 * ```
 */
export function useContractRead<
  TAbi extends Abi = Abi,
  TName extends ContractFunctionName<TAbi, 'pure' | 'view'> = ContractFunctionName<TAbi, 'pure' | 'view'>
>(hookParams: UseReadContractParams<TAbi, TName>) {
  const { params, options } = hookParams
  
  const contractAddress = params.contractAddress
  const chainId = params.chainId
  const functionName = params.functionName
  const args = params.args
  const providedAbi = params.abi
  const blockNumber = params.blockNumber

  const {
    enabled = true,
    refetchInterval,
    staleTime = 1000 * 60 * 5 // 5 minutes default stale time
  } = options || {}

  const client = useBlockchainClient({ chainId: chainId || 84532 }) // Default to Base Sepolia if no chainId

  return useQuery({
    queryKey: [
      'readContract',
      chainId,
      contractAddress,
      functionName,
      args,
      blockNumber?.toString()
    ],
    queryFn: async () => {
      if (!params) {
        throw new BlockchainError('Contract parameters are required', 'MISSING_PARAMS')
      }

      if (!client) {
        throw new BlockchainError(`Client not available for chain ${chainId}`, 'CLIENT_UNAVAILABLE')
      }

      if (!contractAddress || !functionName) {
        throw new BlockchainError('Contract address and function name are required', 'MISSING_CONTRACT_INFO')
      }

      try {
        // Use provided ABI
        if (!providedAbi) {
          throw new BlockchainError(
            `ABI is required for contract ${contractAddress} on chain ${chainId}.`,
            'MISSING_ABI'
          )
        }
        const abi = providedAbi
        
        const result = await client.readContract({
          address: contractAddress,
          abi,
          functionName,
          ...(args && { args }),
          ...(blockNumber && { blockNumber })
        })

        return result as ContractFunctionReturnType<TAbi, 'pure' | 'view', TName>
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        throw new BlockchainError(
          `Failed to read contract ${contractAddress}.${functionName}: ${message}`,
          'CONTRACT_READ_ERROR',
          { contractAddress, functionName, args, chainId }
        )
      }
    },
    enabled: enabled && !!client && !!params && !!contractAddress && !!functionName,
    refetchInterval,
    staleTime,
    retry: (failureCount: number) => {
      return failureCount < 3
    }
  })
}

/**
 * Read multiple contracts in parallel
 * 
 * @example
 * ```typescript
 * const { data } = useMultiReadContract({
 *   requests: [
 *     {
 *       contractAddress: token1,
 *       chainId: 8453,
 *       abi: ERC20_ABI,
 *       functionName: 'balanceOf',
 *       args: [user1]
 *     }
 *   ]
 * });
 * ```
 */
export function useMultiReadContract<T extends ReadonlyArray<ReadContractParams<Abi, ContractFunctionName<Abi, 'pure' | 'view'>>> = ReadonlyArray<ReadContractParams<Abi, ContractFunctionName<Abi, 'pure' | 'view'>>>>(
  params: UseMultiReadContractParams<T>
) {
  const { requests, options } = params
  
  const {
    enabled = true,
    refetchInterval,
    staleTime = 1000 * 60 * 5
  } = options || {}

  // Group requests by chain ID for efficient client usage
  const requestsByChain = useMemo(() => {
    const groups: Record<number, T[number][]> = {}
    requests.forEach(request => {
      if (!groups[request.chainId]) {
        groups[request.chainId] = []
      }
      groups[request.chainId].push(request)
    })
    return groups
  }, [requests])

  return useQuery({
    queryKey: [
      'multiReadContract',
      requests.map(r => [
        r.chainId,
        r.contractAddress,
        r.functionName,
        r.args ?? [],
        r.abi ? 'provided-abi' : 'deployed-contract',
        r.blockNumber?.toString()
      ])
    ],
    queryFn: async () => {
      const results: Record<string, unknown> = {}

      // Process each chain's requests
      await Promise.all(
        Object.entries(requestsByChain).map(async ([chainIdStr, chainRequests]) => {
          const chainId = parseInt(chainIdStr)
          const client = createPublicClient({
            chain: getChainById(chainId)!,
            transport: http(getRpcUrl(chainId)),
          })

          // Process requests for this chain
          await Promise.all(
            chainRequests.map(async (request, index) => {
              try {
                // Get ABI from request
                if (!request.abi) {
                  throw new Error(`ABI is required for contract ${request.contractAddress}`)
                }
                const abi = request.abi

                const result = await client.readContract({
                  address: request.contractAddress,
                  abi,
                  functionName: request.functionName,
                  args: request.args || [],
                  ...(request.blockNumber && { blockNumber: request.blockNumber })
                })

                // Create unique key for this request
                const key = `${chainId}-${request.contractAddress}-${request.functionName}-${index}`
                results[key] = result
              } catch (error) {
                const key = `${chainId}-${request.contractAddress}-${request.functionName}-${index}`
                results[key] = {
                  error: error instanceof Error ? error.message : String(error)
                }
              }
            })
          )
        })
      )

      return results
    },
    enabled: enabled && requests.length > 0,
    refetchInterval,
    staleTime,
    retry: 2
  })
}

/**
 * Get current block number
 * 
 * @example
 * ```typescript
 * const { data: blockNumber } = useBlockNumber({ chainId: 8453 });
 * ```
 */
export function useBlockNumber(params: UseBlockNumberParams) {
  const { chainId, options } = params
  
  const {
    enabled = true,
    refetchInterval = 12000 // Poll every 12 seconds (Base block time)
  } = options || {}

  const client = useBlockchainClient({ chainId })

  return useQuery({
    queryKey: ['blockNumber', chainId],
    queryFn: async () => {
      if (!client) {
        throw new BlockchainError(`Client not available for chain ${chainId}`, 'CLIENT_UNAVAILABLE')
      }

      return await client.getBlockNumber()
    },
    enabled: enabled && !!client,
    refetchInterval,
    staleTime: 5000, // Consider stale after 5 seconds
  })
}

/**
 * Get ETH balance
 * 
 * @example
 * ```typescript
 * const { data: balance } = useBalance({ 
 *   address: userAddress, 
 *   chainId: 8453 
 * });
 * ```
 */
export function useBalance(params: UseBalanceParams) {
  const { address, chainId, options } = params
  
  const {
    enabled = true,
    refetchInterval = 30000 // Poll every 30 seconds
  } = options || {}

  const client = useBlockchainClient({ chainId })

  return useQuery({
    queryKey: ['balance', address, chainId],
    queryFn: async () => {
      if (!client) {
        throw new BlockchainError(`Client not available for chain ${chainId}`, 'CLIENT_UNAVAILABLE')
      }

      return await client.getBalance({
        address: address as `0x${string}`
      })
    },
    enabled: enabled && !!client && !!address,
    refetchInterval,
    staleTime: 10000, // Consider stale after 10 seconds
  })
}

/**
 * Get transaction receipt
 * 
 * @example
 * ```typescript
 * const { data: receipt } = useTransactionReceipt({ 
 *   txHash, 
 *   chainId: 8453 
 * });
 * ```
 */
export function useTransactionReceipt(params: UseTransactionReceiptParams) {
  const { txHash, chainId, options } = params
  
  const {
    enabled = true,
    refetchInterval = 5000 // Poll every 5 seconds while pending
  } = options || {}

  const client = useBlockchainClient({ chainId })

  return useQuery({
    queryKey: ['transactionReceipt', txHash, chainId],
    queryFn: async () => {
      if (!client) {
        throw new BlockchainError(`Client not available for chain ${chainId}`, 'CLIENT_UNAVAILABLE')
      }

      return await client.getTransactionReceipt({
        hash: txHash as `0x${string}`
      })
    },
    enabled: enabled && !!client && !!txHash,
    refetchInterval: (data: unknown) => {
      // Stop polling once we have the receipt
      return data ? false : refetchInterval
    },
    staleTime: Infinity, // Transaction receipts never go stale
    retry: 10 // Retry more times for pending transactions
  })
} 