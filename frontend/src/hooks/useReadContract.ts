
import { 
  type Abi, 
  type ContractFunctionName,
  type ContractFunctionReturnType,
} from 'viem'
import { type UseQueryResult, } from '@tanstack/react-query'
import { useContractRead} from './useBlockchainClient'
import { type ReadContractParams } from '../lib/blockchain/types'

/**
 * Parameters for reading a single contract
 */
export interface UseReadContractParams<
  TAbi extends Abi = Abi,
  TName extends ContractFunctionName<TAbi, 'pure' | 'view'> = ContractFunctionName<TAbi, 'pure' | 'view'>
> extends ReadContractParams<TAbi, TName> {
  /** Query options */
  options?: {
    /** Enable/disable query */
    enabled?: boolean
    /** Refetch interval in ms */
    refetchInterval?: number
    /** Stale time in ms */
    staleTime?: number
    /** Block number to read from */
    blockNumber?: bigint
  }
}

/**
 * Hook for reading contract data with type safety
 * 
 * @dev IMPORTANT: If the data returned from a read call is a set of return parameters or is or includes a returned struct, it will ALWAYS be in tuple form, make sure to interpret it as such!
 * 
 * @returns Query result with typed data
 * 
 * @example
 * ```typescript
 * // Simple contract read
 * const { data: balanceUntyped, isLoading } = useReadContract({
 *   contractAddress: tokenAddress,
 *   chainId: 8453,
 *   abi: ERC20_ABI,
 *   functionName: 'balanceOf',
 *   args: [userAddress],
 * });
 * 
 * const balance = balanceUntyped as bigint | undefined
 * 
 * // With options
 * const { data: totalSupplyUntyped } = useReadContract({
 *   contractAddress: tokenAddress,
 *   chainId: 8453,
 *   abi: ERC20_ABI,
 *   functionName: 'totalSupply',
 *   options: {
 *     refetchInterval: 10000, // Refetch every 10 seconds
 *     blockNumber: 12345678n  // Read from specific block
 *   }
 * });
 * 
 * const totalSupply = totalSupplyUntyped as bigint | undefined
 * ```
 */
export function useReadContract<
  TAbi extends Abi = Abi,
  TName extends ContractFunctionName<TAbi, 'pure' | 'view'> = ContractFunctionName<TAbi, 'pure' | 'view'>
>(params: UseReadContractParams<TAbi, TName>): UseQueryResult<ContractFunctionReturnType<TAbi, 'pure' | 'view', TName>> {
  const { contractAddress, chainId, abi, functionName, args, options } = params
  
  const result = useContractRead({
    params: {
      contractAddress,
      chainId,
      abi,
      functionName,
      args,
      blockNumber: options?.blockNumber,
    },
    options: {
      enabled: options?.enabled,
      refetchInterval: options?.refetchInterval,
      staleTime: options?.staleTime,
    }
  })
  
  return result
}

