import { useState, useCallback } from 'react'
import {
  type Abi,
  type Address,
  type ContractFunctionName,
  type ContractFunctionArgs,
  type ContractFunctionReturnType,
  type Log,
  createPublicClient,
  http,
  encodeFunctionData,
  decodeFunctionResult,
  } from 'viem'
import { useWallet } from './useWallet'
import { getChainById, getSimulationRpcUrl } from '@/lib/blockchain/chains'
import { config } from '../config'

/**
 * Represents an asset balance change during transaction simulation
 */
export interface AssetChange {
  /** Token information */
  token: {
    /** Token contract address */
    address: Address
    /** Token decimals */
    decimals?: number
    /** Token symbol */
    symbol?: string
  }

  /** Balance change details */
  value: {
    /** Change amount (positive or negative) */
    diff: bigint
    /** Balance before transaction */
    pre: bigint
    /** Balance after transaction */
    post: bigint
  }
}

/**
 * Parameters for a single contract call to simulate
 */
export interface SimulateWriteCall<
  TAbi extends Abi = Abi,
  TName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'> = ContractFunctionName<TAbi, 'nonpayable' | 'payable'>
> {
  /** Contract address to call */
  contractAddress: Address
  /** Chain ID where the contract is deployed */
  chainId: number
  /** Contract ABI */
  abi: TAbi
  /** Function name to call */
  functionName: TName
  /** Function arguments */
  args: ContractFunctionArgs<TAbi, 'nonpayable' | 'payable', TName>
  /** ETH value to send (for payable functions) */
  value?: bigint
}

/**
 * Result from a single simulated contract call
 */
export interface CallResult<
  TAbi extends Abi = Abi,
  TName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'> = ContractFunctionName<TAbi, 'nonpayable' | 'payable'>
> {
  /** Return value from the contract function */
  result: ContractFunctionReturnType<TAbi, 'nonpayable' | 'payable', TName> | undefined
  /** Event logs emitted during the call */
  logs: Log[]
  /** Execution status */
  status: 'success' | 'failure'
  /** Gas consumed by the call */
  gasUsed?: bigint
  /** Error details if the call reverted */
  error?: {
    message: string
  }
}

export type SimulateOneTransactionResult<
  TAbi extends Abi,
  TName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'>
> = {
  callResult: CallResult<TAbi, TName>
  assetChanges?: ReadonlyArray<AssetChange>
}

export type SimulateTwoTransactionsResult<
  TAbi1 extends Abi,
  TName1 extends ContractFunctionName<TAbi1, 'nonpayable' | 'payable'>,
  TAbi2 extends Abi,
  TName2 extends ContractFunctionName<TAbi2, 'nonpayable' | 'payable'>
> = {
  firstCallResult: CallResult<TAbi1, TName1>
  secondCallResult: CallResult<TAbi2, TName2>
  assetChanges?: ReadonlyArray<AssetChange>
}

export interface UseSimulateWriteContractsReturn {
  simulateOneTransaction: <
    TAbi extends Abi,
    TName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'>
  >(
    call: SimulateWriteCall<TAbi, TName>
  ) => Promise<SimulateOneTransactionResult<TAbi, TName>>
  simulateTwoTransactions: <
    TAbi1 extends Abi,
    TName1 extends ContractFunctionName<TAbi1, 'nonpayable' | 'payable'>,
    TAbi2 extends Abi,
    TName2 extends ContractFunctionName<TAbi2, 'nonpayable' | 'payable'>
  >(
    first: SimulateWriteCall<TAbi1, TName1>,
    second: SimulateWriteCall<TAbi2, TName2>
  ) => Promise<SimulateTwoTransactionsResult<TAbi1, TName1, TAbi2, TName2>>
  error: Error | null
  loading: boolean
}

/**
 * Simulate contract write calls before execution
 * 
 * @example
 * ```typescript
 * const { simulateOneTransaction, simulateTwoTransactions } = useSimulateWriteContracts()
 * 
 * // 1) Strongly typed single-call simulation
 * const one = await simulateOneTransaction({
 *   contractAddress: tokenAddress,
 *   chainId: 8453,
 *   abi: ERC20_ABI,
 *   functionName: 'transfer' as const,
 *   args: [recipient as Address, 1n] as [Address, bigint],
 * })
 * // one.callResult.result is typed to the return value of transfer
 * if (one.callResult.status === 'success') {
 *   const value = one.callResult.result // typed
 * }
 * 
 * // 2) Strongly typed two-call simulation (e.g., approve then swap)
 * const two = await simulateTwoTransactions(
 *   {
 *     contractAddress: tokenAddress,
 *     chainId: 8453,
 *     abi: ERC20_ABI,
 *     functionName: 'approve' as const,
 *     args: [spender as Address, 1n] as [Address, bigint],
 *   },
 *   {
 *     contractAddress: swapManager,
 *     chainId: 8453,
 *     abi: SWAP_MANAGER_ABI,
 *     functionName: 'swapExactTokenAmountForEth' as const,
 *     args: [tokenAddress as Address, 1n, 0n] as [Address, bigint, bigint],
 *   }
 * )
 * // two.firstCallResult.result is typed to the return value of approve; two.secondCallResult.result is typed to the return value of swap
 * if (two.secondCallResult.status === 'success') {
 *   const out = two.secondCallResult.result // typed
 * }
 * ```
 */
export function useSimulateWriteContracts(): UseSimulateWriteContractsReturn {
  const { address: walletAddress } = useWallet()
  const effectiveAddress = walletAddress
  
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)

  /**
   * Simulates a single transaction
   */
  const simulateSingleTransaction = useCallback(async <
    TAbi extends Abi,
    TName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'>
  >(
    txData: SimulateWriteCall<TAbi, TName>
  ): Promise<CallResult<TAbi, TName>> => {
    try {
      const chain = getChainById(txData.chainId)
      if (!chain) {
        throw new Error(`Unsupported chain ID: ${txData.chainId}`)
      }

      const publicClient = createPublicClient({
        chain,
        transport: http(getSimulationRpcUrl(txData.chainId)),
      })

      // Note: We need to cast here due to viem's complex generic constraints
      // The types are correct but TypeScript can't infer through the generic boundaries
      const { result } = await publicClient.simulateContract({
        abi: txData.abi,
        address: txData.contractAddress,
        functionName: txData.functionName,
        args: txData.args,
        value: txData.value,
        account: effectiveAddress as Address,
      } as any)

      return {
        result: result as ContractFunctionReturnType<TAbi, 'nonpayable' | 'payable', TName>,
        logs: [],
        status: 'success' as const,
        gasUsed: undefined,
      }
    } catch (err: any) {
      return {
        result: undefined,
        logs: [],
        status: 'failure' as const,
        gasUsed: undefined,
        error: {
          message: err.message || 'Call failed',
        },
      }
    }
  }, [effectiveAddress])

  /**
   * Simulates multiple transactions atomically
   */
  const simulateMultipleTransactionsAtomic = useCallback(async (
    transactions: SimulateWriteCall[]
  ): Promise<{ callResults: CallResult[]; assetChanges?: ReadonlyArray<AssetChange> }> => {
    if (transactions.length === 0) {
      return { callResults: [], assetChanges: undefined }
    }

    // Verify all transactions are on the same chain
    const chainId = transactions[0].chainId
    if (!transactions.every(tx => tx.chainId === chainId)) {
      throw new Error('All transactions must be on the same chain for atomic simulation')
    }

    let chain = getChainById(chainId)
    if (!chain) {
      throw new Error(`Unsupported chain ID: ${chainId}`)
    }

    const networkConfig = config.networks[chainId as keyof typeof config.networks]
    if (networkConfig?.simulateV1RpcSupportedRpcUrl) {
      chain = {
        ...chain,
        rpcUrls: {
          default: { http: [networkConfig.simulateV1RpcSupportedRpcUrl] },
        },
      }
    }

    const publicClient = createPublicClient({
      chain,
      transport: http(getSimulationRpcUrl(chainId)),
    })

    try {
      const callsWithABI = transactions.map((txData) => ({
        to: txData.contractAddress,
        data: encodeFunctionData({
          abi: txData.abi,
          functionName: txData.functionName,
          args: txData.args,
        }),
        value: txData.value || undefined,
        abi: txData.abi,
        functionName: txData.functionName,
      }))

      // Execute atomic simulation
      // Note: simulateCalls is an RPC-specific method, not part of standard viem
      const simulateResponse = await publicClient.simulateCalls({
        calls: callsWithABI.map(call => ({ to: call.to, data: call.data, value: call.value })),
        account: effectiveAddress as Address,
        traceAssetChanges: true,
      })

      if (!simulateResponse.results) {
        throw new Error(`simulateCalls failed`)
      }

      const callResults = Array.isArray(simulateResponse.results) 
        ? simulateResponse.results.map((result, i: number) => ({
            result: result.result || result.data 
              ? decodeFunctionResult({ 
                  abi: callsWithABI[i].abi, 
                  data: result.data, 
                  functionName: callsWithABI[i].functionName 
                }) 
              : null,
            logs: result.logs || [],
            status: result.status,
            gasUsed: result.gasUsed,
            error: result.error ? {
              message: result.error.message,
            } : undefined,
          })) 
        : []

      return { callResults: callResults, assetChanges: simulateResponse.assetChanges }
    } catch (err: any) {
      throw new Error(`simulateCalls failed: ${err}`)
    }
  }, [effectiveAddress])

  /**
   * Simulates multiple transactions sequentially
   */
  const simulateMultipleTransactionsSequential = useCallback(async (
    transactions: SimulateWriteCall[]
  ): Promise<CallResult[]> => {
    const results: CallResult[] = []
    
    for (const txData of transactions) {
      const result = await simulateSingleTransaction(txData)
      results.push(result)
    }
    
    return results
  }, [simulateSingleTransaction])

  /**
   * Simulates contract calls with automatic strategy selection
   */
  const simulateOneTransaction = useCallback(async <
    TAbi extends Abi,
    TName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'>
  >(
    call: SimulateWriteCall<TAbi, TName>
  ): Promise<SimulateOneTransactionResult<TAbi, TName>> => {
    const transactions = [call]

    setLoading(true)
    setError(null)

    try {
      const chainId = transactions[0].chainId
      if (transactions.some(tx => tx.chainId !== chainId)) {
        throw new Error('All simulated transactions in one call must be on the same chain')
      }

      const chain = getChainById(chainId)
      if (!chain) {
        throw new Error(`Unsupported chain ID: ${transactions[0].chainId}`)
      }

      const networkConfig = config.networks[chainId as keyof typeof config.networks]

      // Single transaction without simulateV1: use direct simulation
      if (!networkConfig?.simulateV1RpcSupportedRpcUrl && transactions.length === 1) {
        const result = await simulateSingleTransaction(transactions[0])
        const simulationResultsData: SimulateOneTransactionResult<TAbi, TName> = {
          callResult: result as any,
          assetChanges: undefined,
        }
        setLoading(false)
        return simulationResultsData
      }

      try {
        const atomic = await simulateMultipleTransactionsAtomic(transactions)
        const simulationResultsData: SimulateOneTransactionResult<TAbi, TName> = {
          callResult: atomic.callResults[0] as any,
          assetChanges: atomic.assetChanges,
        }
        setLoading(false)

        return simulationResultsData
      } catch (atomicError) {
        console.warn('Atomic simulation failed, falling back to sequential:', atomicError)
        // Fall back to sequential simulation
        const callResults = await simulateMultipleTransactionsSequential(transactions)
        const simulationResultsData: SimulateOneTransactionResult<TAbi, TName> = {
          callResult: callResults[0] as any,
          assetChanges: undefined,
        }
        setLoading(false)
        return simulationResultsData
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      console.error('Simulation failed:', error)
      setLoading(false)
      return {
        callResult: undefined as any,
        assetChanges: undefined,
      }
    }
  }, [simulateSingleTransaction, simulateMultipleTransactionsAtomic, simulateMultipleTransactionsSequential])

  const simulateTwoTransactions = useCallback(async <
    TAbi1 extends Abi,
    TName1 extends ContractFunctionName<TAbi1, 'nonpayable' | 'payable'>,
    TAbi2 extends Abi,
    TName2 extends ContractFunctionName<TAbi2, 'nonpayable' | 'payable'>
  >(
    first: SimulateWriteCall<TAbi1, TName1>,
    second: SimulateWriteCall<TAbi2, TName2>
  ): Promise<SimulateTwoTransactionsResult<TAbi1, TName1, TAbi2, TName2>> => {
    const transactions = [first, second]

    setLoading(true)
    setError(null)

    try {
      const chainId = first.chainId
      if (second.chainId !== chainId) {
        throw new Error('Both transactions must be on the same chain')
      }

      const chain = getChainById(chainId)
      if (!chain) {
        throw new Error(`Unsupported chain ID: ${chainId}`)
      }

      

      try {
        const atomic = await simulateMultipleTransactionsAtomic(transactions)
        const simulationResultsData: SimulateTwoTransactionsResult<TAbi1, TName1, TAbi2, TName2> = {
          firstCallResult: atomic.callResults[0] as any,
          secondCallResult: atomic.callResults[1] as any,
          assetChanges: atomic.assetChanges,
        }
        setLoading(false)
        return simulationResultsData
      } catch (atomicError) {
        console.warn('Atomic simulation failed, falling back to sequential:', atomicError)
        const callResults = await simulateMultipleTransactionsSequential(transactions)
        const simulationResultsData: SimulateTwoTransactionsResult<TAbi1, TName1, TAbi2, TName2> = {
          firstCallResult: callResults[0] as any,
          secondCallResult: callResults[1] as any,
          assetChanges: undefined,
        }
        setLoading(false)
        return simulationResultsData
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      console.error('Simulation failed:', error)
      setLoading(false)
      throw error
    }
  }, [simulateMultipleTransactionsAtomic, simulateMultipleTransactionsSequential])

  return {
    simulateOneTransaction,
    simulateTwoTransactions,
    error,
    loading,
  }
}