import { useQuery } from '@tanstack/react-query'
import { 
  type Abi, 
  type Address, 
  type Log, 
  parseAbiItem, 
  type AbiEvent,
  type ContractEventName,
} from 'viem'
import { useBlockchainClient } from './useBlockchainClient'
import { BlockchainError } from '../lib/blockchain/types'

export interface UseQueryEventsParams<
  TAbi extends Abi = Abi,
  TEventName extends ContractEventName<TAbi> = ContractEventName<TAbi>
> {
  /** Contract address */
  contractAddress?: Address
  /** Event name/signature/ABI */
  eventName?: TEventName | AbiEvent
  /** Start block */
  fromBlock?: bigint
  /** End block */
  toBlock?: bigint
  /** Contract ABI */
  abi?: TAbi
  /** Chain ID */
  chainId: number
  /** Query options */
  options?: {
    /** Enable/disable */
    enabled?: boolean
    /** Refetch interval (ms) */
    refetchInterval?: number
    /** Stale time (ms) */
    staleTime?: number
  }
}

/**
 * Query historical blockchain events
 * 
 * @example
 * ```typescript
 * const { data } = useQueryEvents({
 *   contractAddress: tokenAddress,
 *   eventName: 'Transfer',
 *   abi: ERC20_ABI,
 *   fromBlock: 1000000n,
 *   toBlock: 1001000n,
 *   chainId: 8453
 * });
 * ```
 */
export function useQueryEvents<
  TAbi extends Abi = Abi,
  TEventName extends ContractEventName<TAbi> = ContractEventName<TAbi>
>(params: UseQueryEventsParams<TAbi, TEventName>) {
  const {
    contractAddress,
    eventName,
    fromBlock,
    toBlock,
    abi,
    chainId,
    options,
  } = params

  const {
    enabled = true,
    refetchInterval,
    staleTime = 1000 * 60 * 5, // 5 minutes default
  } = options || {}

  const client = useBlockchainClient({ chainId })

  // Validate inputs
  if (eventName && !abi) {
    throw new Error('ABI is required when eventName is specified')
  }

  return useQuery({
    queryKey: [
      'queryEvents',
      chainId,
      contractAddress,
      typeof eventName === 'string' ? eventName : eventName?.name,
      fromBlock?.toString(),
      toBlock?.toString(),
      abi ? 'with-abi' : 'no-abi'
    ],
    queryFn: async () => {
      if (!client) {
        throw new BlockchainError(`Client not available for chain ${chainId}`, 'CLIENT_UNAVAILABLE')
      }

      let logs: Log[] = []

      // Helper function to find event in ABI
      const findEventInAbi = (abiToSearch: Abi): AbiEvent | null => {
        if (typeof eventName === 'object') {
          // Already parsed ABI event
          return eventName
        }
        
        if (typeof eventName === 'string') {
          // Check if it's a signature (contains parentheses)
          if (eventName.includes('(')) {
            // Try to parse as event signature
            try {
              const parsed = parseAbiItem(`event ${eventName}`) as AbiEvent
              // Find matching event in ABI by signature
              return abiToSearch.find(
                (item: any) => 
                  item.type === 'event' && 
                  formatEventSignature(item) === formatEventSignature(parsed)
              ) as AbiEvent || null
            } catch {
              // If parsing fails, try to find by exact signature match
              return abiToSearch.find(
                (item: any) => 
                  item.type === 'event' && 
                  formatEventSignature(item) === eventName
              ) as AbiEvent || null
            }
          } else {
            // Simple name match - return first matching event
            return abiToSearch.find(
              (item: any) => item.type === 'event' && item.name === eventName
            ) as AbiEvent || null
          }
        }
        
        return null
      }

      // Helper to format event signature for comparison
      const formatEventSignature = (event: AbiEvent): string => {
        const inputs = event.inputs?.map((input: any) => input.type).join(',') || ''
        return `${event.name}(${inputs})`
      }

      // Query logic
      if (contractAddress && eventName && abi) {
        // Query specific event from specific contract
        const event = findEventInAbi(abi)
        
        if (!event) {
          throw new Error(`Event ${typeof eventName === 'string' ? eventName : eventName.name} not found in ABI`)
        }

        logs = await client.getLogs({
          address: contractAddress,
          event: event as any,
          fromBlock,
          toBlock,
        })
      } else if (contractAddress && abi && !eventName) {
        // Query all events from specific contract using ABI
        const events = abi.filter((item: any) => item.type === 'event')
        
        // Query logs for each event and combine
        const allLogs = await Promise.all(
          events.map((event: any) =>
            client.getLogs({
              address: contractAddress,
              event: event as any,
              fromBlock,
              toBlock,
            })
          )
        )
        
        logs = allLogs.flat()
      } else if (contractAddress) {
        // Query all raw logs from contract without event filtering
        logs = await client.getLogs({
          address: contractAddress,
          fromBlock,
          toBlock,
        })
      } else {
        // Query all logs in the block range
        logs = await client.getLogs({
          fromBlock,
          toBlock,
        })
      }

      return {
        logs,
        count: logs.length,
        contractAddress,
        eventName: typeof eventName === 'string' ? eventName : eventName?.name,
        fromBlock,
        toBlock,
        chainId,
      }
    },
    enabled: enabled && !!client,
    refetchInterval,
    staleTime,
    retry: 2,
  })
}