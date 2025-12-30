

import { useEffect, useState, useRef, useCallback } from 'react'
import { 
  type Abi,
  type Address,
  type Log,
  type ContractEventName,
  type ContractEventArgs,
  type AbiEvent,
  decodeEventLog
} from 'viem'
import { useBlockchainClient } from './useBlockchainClient'

/**
 * Parameters for useWatchEvent hook
 */
export interface UseWatchEventParameters<
  TAbi extends Abi = Abi,
  TEventName extends ContractEventName<TAbi> = ContractEventName<TAbi>
> {
  /** Chain ID to watch events on */
  chainId?: number
  /** Contract address to watch */
  contractAddress?: Address;
  /** Contract ABI */
  abi: TAbi | readonly unknown[]
  /** Event name to watch */
  eventName?: TEventName
  /** Specific event ABI */
  event?: AbiEvent;
  /** Indexed event arguments to filter */
  args?: ContractEventArgs<TAbi, TEventName>
  /** Whether to batch logs between polling intervals */
  batch?: boolean
  /** Error callback */
  onError?: (error: Error) => void
  /** Polling interval in ms (default: 1000) */
  pollingInterval?: number
  /** Block number to start watching from */
  fromBlock?: bigint
  /** Whether to enable strict mode */
  strict?: boolean
  /** Whether to start watching events (default: true) */
  enabled?: boolean
  /** Callback when new logs are received */
  onLogs?: (logs: Log[]) => void
}

/**
 * Return type for useWatchEvent hook
 */
export interface UseWatchEventReturnType {
  /** Accumulated logs array */
  logs: Log[]
  /** Whether currently watching */
  isWatching: boolean
  /** Function to manually stop watching */
  unwatch: (() => void) | undefined
  /** Clear accumulated logs */
  clearLogs: () => void
  /** Any error that occurred */
  error: Error | null
}

/**
 * Watch blockchain events in real-time
 * 
 * @example
 * ```typescript
 * const { logs, unwatch } = useWatchEvent({
 *   address: tokenAddress,
 *   abi: ERC20_ABI,
 *   eventName: 'Transfer',
 *   pollingInterval: 2000,
 *   onLogs: (newLogs) => console.log('New transfers:', newLogs)
 * })
 * ```
 */
export function useWatchEvent<
  TAbi extends Abi,
  TEventName extends ContractEventName<TAbi> = ContractEventName<TAbi>
>(
  parameters: UseWatchEventParameters<TAbi, TEventName>
): UseWatchEventReturnType {
  const publicClient = useBlockchainClient({ chainId: parameters.chainId || 8453 })
  
  // Extract our custom parameters
  const { 
    enabled = true, 
    onLogs: userOnLogs,
    ...watchEventParams 
  } = parameters

  // State for accumulated logs
  const [logs, setLogs] = useState<Log[]>([])
  const [isWatching, setIsWatching] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  // Ref to store the unwatch function
  const unwatchRef = useRef<(() => void) | undefined>()

  // Clear logs function
  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  // Internal onLogs handler that accumulates logs and calls user callback
  const handleLogs = useCallback((newLogs: Log[]) => {
    // Add new logs to state
    setLogs(prevLogs => [...prevLogs, ...newLogs])
    
    // Call user's onLogs callback if provided
    if (userOnLogs) {
      try {
        userOnLogs(newLogs)
      } catch (err) {
        console.error('Error in onLogs callback:', err)
      }
    }
  }, [userOnLogs])

  // Effect to manage event watching
  useEffect(() => {
    // Only watch if enabled and we have a client
    if (!enabled || !publicClient) {
      setIsWatching(false)
      return
    }

    let unwatch: (() => void) | undefined

    const startWatching = async () => {
      try {
        setError(null)
        setIsWatching(true)

        // Build the watch parameters
        const watchParams: any = {
          onLogs: handleLogs,
          onError: (err: Error) => {
            console.log('onError', err)
            setError(err)
            // Call user's onError if provided
            if (watchEventParams.onError) {
              watchEventParams.onError(err)
            }
          }
        }

        // Add optional parameters
        if (watchEventParams.event) watchParams.event = watchEventParams.event
        if (watchEventParams.eventName) watchParams.event = watchEventParams.abi.find((item: any) => item.name === watchEventParams.eventName && item.type === 'event') as AbiEvent
        if (watchEventParams.contractAddress) watchParams.address = watchEventParams.contractAddress
        if (watchEventParams.args) watchParams.args = watchEventParams.args
        if (watchEventParams.batch !== undefined) watchParams.batch = watchEventParams.batch
        // Always use polling for reliability
        watchParams.poll = true
        if (watchEventParams.pollingInterval !== undefined) watchParams.pollingInterval = watchEventParams.pollingInterval
        if (watchEventParams.fromBlock !== undefined) watchParams.fromBlock = watchEventParams.fromBlock
        if (watchEventParams.strict !== undefined) watchParams.strict = watchEventParams.strict

        console.log('watchParams', watchParams)
        // Start watching events
        unwatch = publicClient.watchEvent(watchParams)

        unwatchRef.current = unwatch
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to start watching events'))
        setIsWatching(false)
      }
    }

    startWatching()

    // Cleanup function
    return () => {
      if (unwatch) {
        unwatch()
      }
      unwatchRef.current = undefined
      setIsWatching(false)
    }
  }, [
	enabled,
	publicClient,
	handleLogs,
	watchEventParams.event,
	watchEventParams.contractAddress,
	watchEventParams.fromBlock,
	watchEventParams.strict,
	watchEventParams,
	watchEventParams.onError,
	watchEventParams.abi,
	watchEventParams.args,
	watchEventParams.batch,
	watchEventParams.pollingInterval,
	watchEventParams.eventName
])

  return {
    logs,
    isWatching,
    unwatch: unwatchRef.current,
    clearLogs,
    error
  }
}

/**
 * Type alias for strongly typed logs
 */
export type TypedLog<
  TAbi extends Abi,
  TEventName extends ContractEventName<TAbi>
> = Log<bigint, number, false, AbiEvent, true, TAbi, TEventName>

/**
 * Helper to get properly typed logs from the hook
 * Use this when you need to access typed event args
 * 
 * @example
 * ```typescript
 * const { logs } = useWatchEvent({ 
 *   address: tokenAddress,
 *   abi: ERC20_ABI,
 *   eventName: 'Transfer'
 * })
 * 
 * // Cast logs to get typed args
 * const typedLogs = getTypedLogs<typeof ERC20_ABI, 'Transfer'>(ERC20_ABI, 'Transfer', logs)
 * typedLogs.forEach(log => {
 *   if (log.args) {
 *     console.log(log.args.from, log.args.to, log.args.value)
 *   }
 * })
 * ```
 */
export function getTypedLogs<
  TAbi extends Abi,
  TEventName extends ContractEventName<TAbi>
>(
  abi: TAbi,
  eventName: TEventName,
  logs: Log[]
): TypedLog<TAbi, TEventName>[] {
  return logs.map((log) =>{
    if (!(log as unknown as {args: any}).args) {
      // Parse the log to extract typed args
      try {
        const parsedLog = decodeEventLog({
          abi,
          data: log.data,
          topics: log.topics,
        })
        return { ...log, args: parsedLog.args } as TypedLog<TAbi, TEventName>
      } catch (error) {
        console.error('Error decoding event log:', error)
      }
    }
    return log as TypedLog<TAbi, TEventName>
  }) as TypedLog<TAbi, TEventName>[]
}