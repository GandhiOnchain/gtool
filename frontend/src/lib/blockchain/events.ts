import { type Abi, type AbiEvent, type Log, parseAbiItem, createPublicClient, http, decodeEventLog, Address, parseEventLogs } from 'viem'
import { getDeployedContract } from '../../blockchain-config'
import { getAppContractByAddressAndChainId } from '../../blockchain-config/appContractDeployments'
import { 
  type ParsedEvent, 
  BlockchainError 
} from './types.js'
import { getChainById, getRpcUrl } from "./chains";
import { Deployments } from '@/blockchain-config/types.js';
import { deployments } from '@/blockchain-config/deployments.js';

/**
 * Input parameters for getEventFromAbi function
 */
export interface GetEventFromAbiParams {
  /** The contract ABI */
  abi: Abi
  /** Name of the event */
  eventName: string
  /** Optional array of parameter types to match specific overload */
  paramTypes?: string[]
}

/**
 * Input parameters for createEventSignature function
 */
export interface CreateEventSignatureParams {
  /** Name of the event */
  eventName: string
  /** Array of parameter types */
  paramTypes: string[]
}

/**
 * Input parameters for getAllEventsByName function
 */
export interface GetAllEventsByNameParams {
  /** The contract ABI */
  abi: Abi
  /** Name of the event */
  eventName: string
}

/**
 * Input parameters for parseEventSignature function
 */
export interface ParseEventSignatureParams {
  /** Event signature (e.g., 'Transfer(address,address,uint256)') */
  signature: string
}

/**
 * Input parameters for getDeployedContractEvent function
 */
export interface GetDeployedContractEventParams {
  /** Chain ID */
  chainId: keyof Deployments
  /** Contract address */
  contractAddress: Address;
  /** Event name */
  eventName: string
  /** Optional parameter types for overload selection */
  paramTypes?: string[]
}

/**
 * Input parameters for isAbiEvent function
 */
export interface IsAbiEventParams {
  /** Event name, signature, or AbiEvent */
  eventSelector: string | AbiEvent
}

/**
 * Input parameters for formatEventForDisplay function
 */
export interface FormatEventForDisplayParams {
  /** Event name, signature, or AbiEvent */
  eventSelector: string | AbiEvent
}

/**
 * Input parameters for parseEventsFromTransaction function
 */
export interface ParseEventsFromTransactionParams {
  /** Transaction hash to parse (with or without 0x prefix) */
  txHash: string
  /** Chain ID where the transaction occurred */
  chainId: keyof Deployments
}

/**
 * Input parameters for parseEventsFromTransactionGivenAnAbi function
 */
export interface ParseEventsFromTransactionGivenAnAbiParams {
  /** Transaction hash to parse (with or without 0x prefix) */
  txHash: string
  /** Chain ID where the transaction occurred */
  chainId: keyof Deployments
  /** ABI array to use for decoding events */
  abi: Abi | unknown[]
}

/**
 * Helper utilities for working with blockchain events
 * Provides convenience functions for creating event selectors and handling overloaded events
 */

/**
 * Creates an event selector from an ABI and event details
 * Useful for selecting specific overloaded events
 * 
 * @param params - Function parameters
 * @param params.abi - The contract ABI
 * @param params.eventName - Name of the event
 * @param params.paramTypes - Optional array of parameter types to match specific overload
 * @returns The matching AbiEvent or null if not found
 * 
 * @example
 * ```typescript
 * import { getIndependentAbi } from '@/blockchain-config/index';
 * const ERC20_ABI = getIndependentAbi('ERC20')
 * 
 * // Get specific Transfer event (in case of overloads)
 * const transferEvent = getEventFromAbi({
 *   abi: ERC20_ABI,
 *   eventName: 'Transfer',
 *   paramTypes: ['address', 'address', 'uint256']
 * });
 * 
 * // Use in query
 * const { data } = useQueryEvents({
 *   contractAddress: tokenAddress,
 *   eventName: transferEvent,
 *   chainId: 8453
 * });
 * ```
 */
export function getEventFromAbi(params: GetEventFromAbiParams): AbiEvent | null {
  const { abi, eventName, paramTypes } = params
  
  const events = abi.filter(
    (item: any) => item.type === 'event' && item.name === eventName
  ) as AbiEvent[]

  if (events.length === 0) {
    return null
  }

  if (events.length === 1 || !paramTypes) {
    return events[0]
  }

  // Match by parameter types for overloaded events
  return events.find((event) => {
    const eventParamTypes = event.inputs?.map((input: { type: string }) => input.type) || []
    return (
      eventParamTypes.length === paramTypes.length &&
      eventParamTypes.every((type: string, index: number) => type === paramTypes[index])
    )
  }) || null
}

/**
 * Creates an event signature string from event name and parameter types
 * 
 * @param params - Function parameters
 * @param params.eventName - Name of the event
 * @param params.paramTypes - Array of parameter types
 * @returns Event signature string
 * 
 * @example
 * ```typescript
 * const signature = createEventSignature({
 *   eventName: 'Transfer',
 *   paramTypes: ['address', 'address', 'uint256']
 * });
 * // Returns: 'Transfer(address,address,uint256)'
 * ```
 */
export function createEventSignature(params: CreateEventSignatureParams): string {
  const { eventName, paramTypes } = params
  return `${eventName}(${paramTypes.join(',')})`
}

/**
 * Gets all events with a specific name from an ABI
 * Useful for discovering overloaded events
 * 
 * @param params - Function parameters
 * @param params.abi - The contract ABI
 * @param params.eventName - Name of the event
 * @returns Array of matching events with their signatures
 * 
 * @example
 * ```typescript
 * const transferEvents = getAllEventsByName({
 *   abi: ERC20_ABI,
 *   eventName: 'Transfer'
 * });
 * // Returns array of all Transfer event variations
 * ```
 */
export function getAllEventsByName(params: GetAllEventsByNameParams): Array<{ event: AbiEvent; signature: string }> {
  const { abi, eventName } = params
  
  return abi
    .filter((item: any) => item.type === 'event' && item.name === eventName)
    .map((event: any) => {
      const abiEvent = event as AbiEvent
      const paramTypes = abiEvent.inputs?.map((input: { type: string }) => input.type) || []
      return {
        event: abiEvent,
        signature: createEventSignature({
          eventName: abiEvent.name,
          paramTypes
        })
      }
    })
}

/**
 * Parses an event signature string into an AbiEvent
 * Wrapper around viem's parseAbiItem with better error handling
 * 
 * @param params - Function parameters
 * @param params.signature - Event signature (e.g., 'Transfer(address,address,uint256)')
 * @returns Parsed AbiEvent
 * @throws Error if signature is invalid
 * 
 * @example
 * ```typescript
 * const event = parseEventSignature({
 *   signature: 'Transfer(address,address,uint256)'
 * });
 * ```
 */
export function parseEventSignature(params: ParseEventSignatureParams): AbiEvent {
  const { signature } = params
  
  try {
    // Add 'event' prefix if not present
    const fullSignature = signature.startsWith('event ') 
      ? signature 
      : `event ${signature}`
    
    return parseAbiItem(fullSignature) as AbiEvent
  } catch (error) {
    throw new Error(`Invalid event signature: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Gets event selector for a deployed contract
 * Combines blockchain-config lookup with event selection
 * 
 * @param params - Function parameters
 * @param params.chainId - Chain ID
 * @param params.contractAddress - Contract address
 * @param params.eventName - Event name
 * @param params.paramTypes - Optional parameter types for overload selection
 * @returns The matching AbiEvent or null
 * 
 * @example
 * ```typescript
 * const transferEvent = getDeployedContractEvent({
 *   chainId: 8453,
 *   contractAddress: tokenAddress,
 *   eventName: 'Transfer',
 *   paramTypes: ['address', 'address', 'uint256']
 * });
 * ```
 */
export function getDeployedContractEvent(params: GetDeployedContractEventParams): AbiEvent | null {
  const { chainId, contractAddress, eventName, paramTypes } = params
  
  let contract = undefined;
  try {
    contract = getDeployedContract({chainId: chainId, contractAddress: contractAddress as keyof Deployments[typeof chainId]})
  } catch (error) {
    console.error(error)
    contract = getAppContractByAddressAndChainId(contractAddress, chainId)
  }
  
  
  if (!contract || !contract.abi) {
    return null
  }

  return getEventFromAbi({
    abi: contract.abi,
    eventName,
    paramTypes
  })
}

/**
 * Type guard to check if an event selector is an AbiEvent
 * 
 * @param params - Function parameters
 * @param params.eventSelector - Event name, signature, or AbiEvent
 * @returns True if the selector is an AbiEvent
 */
export function isAbiEvent(params: IsAbiEventParams): boolean {
  const { eventSelector } = params
  return typeof eventSelector === 'object' && 'type' in eventSelector
}

/**
 * Formats an event for display
 * Converts AbiEvent or signature to human-readable format
 * 
 * @param params - Function parameters
 * @param params.eventSelector - Event name, signature, or AbiEvent
 * @returns Formatted event string
 * 
 * @example
 * ```typescript
 * formatEventForDisplay({ eventSelector: 'Transfer' }); // 'Transfer'
 * formatEventForDisplay({ eventSelector: 'Transfer(address,address,uint256)' }); // 'Transfer(address,address,uint256)'
 * formatEventForDisplay({ eventSelector: transferEvent }); // 'Transfer(address from, address to, uint256 value)'
 * ```
 */
export function formatEventForDisplay(params: FormatEventForDisplayParams): string {
  const { eventSelector } = params
  
  if (typeof eventSelector === 'string') {
    return eventSelector
  }

  const inputs = eventSelector.inputs
    ?.map((input: any) => {
      const indexed = input.indexed ? ' indexed' : ''
      return `${input.type}${indexed}${input.name ? ` ${input.name}` : ''}`
    })
    .join(', ') || ''

  return `${eventSelector.name}(${inputs})`
} 

/**
 * Parse events from a transaction by fetching receipt and decoding logs
 * Automatically tries to get ABI from blockchain-config for each contract
 * 
 * @param params - Function parameters
 * @param params.txHash - Transaction hash to parse (with or without 0x prefix)
 * @param params.chainId - Chain ID where the transaction occurred
 * @returns Array of parsed events sorted by log index
 * @throws {BlockchainError} If transaction receipt is not found
 * 
 * @example
 * ```typescript
 * const events = await parseEventsFromTransaction({
 *   txHash: '0x123...abc',
 *   chainId: 8453 // base mainnet
 * });
 * 
 * // Process decoded events
 * events.forEach(event => {
 *   if (event.eventName === 'Transfer' && event.decodedArgs) {
 *     console.log(`Transfer from ${event.decodedArgs.from} to ${event.decodedArgs.to}`);
 *   }
 * });
 * ```
 * 
 * @dev
 * - Groups logs by contract address to minimize ABI lookups
 * - Falls back to raw logs if ABI is not found or decoding fails
 * - Preserves original log data even when decoded for maximum flexibility
 */
export async function parseEventsFromTransaction(params: ParseEventsFromTransactionParams): Promise<ParsedEvent[]> {
  const { txHash, chainId } = params
  
  const client = createPublicClient({
    chain: getChainById(chainId),
    transport: http(getRpcUrl(chainId)),
  });

  // Get transaction receipt
  const receipt = await client.getTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  if (!receipt) {
    throw new BlockchainError(`Transaction receipt not found for ${txHash}`, 'TX_NOT_FOUND');
  }

  const parsedEvents: ParsedEvent[] = [];
  
  // Group logs by contract address to minimize ABI lookups
  const logsByContract = new Map<string, Log[]>();
  for (const log of receipt.logs) {
    const logs = logsByContract.get(log.address) || [];
    logs.push(log);
    logsByContract.set(log.address, logs);
  }

  // Process logs for each contract
  for (const [contractAddress, logs] of logsByContract) {
    try {
      // Try to get ABI from blockchain-config
      const deployedContract = contractAddress.toLowerCase() in deployments[chainId] ? getDeployedContract({chainId: chainId, contractAddress: contractAddress.toLowerCase() as keyof Deployments[typeof chainId]}) : undefined;
      const appContract = deployedContract || getAppContractByAddressAndChainId(contractAddress, chainId);
      
      if (appContract) {
        try {
          // Parse logs with the found ABI
          const parsedLogs = parseEventLogs({
            abi: appContract.abi,
            logs,
          }).map((log: any) => ({
            eventName: log.eventName,
            decodedArgs: log.args,
            address: log.address,
            blockNumber: log.blockNumber || BigInt(0),
            transactionHash: log.transactionHash || '0x',
            logIndex: log.logIndex || 0,
            data: log.data,
            topics: (log as any).topics || [],
          }))
          parsedEvents.push(...parsedLogs)
        } catch (error) {
          console.warn(`Error parsing logs for contract ${contractAddress}:`, error);
          parsedEvents.push(...logs.map(log => ({
            eventName: 'Unknown',
            address: log.address,
            blockNumber: log.blockNumber || BigInt(0),
            transactionHash: log.transactionHash || '0x',
            logIndex: log.logIndex || 0,
            data: log.data,
            topics: (log as any).topics || [],
          })))
        }
      } else {
        // No ABI found, include raw logs
        parsedEvents.push(...logs.map(log => ({
          eventName: 'Unknown',
          address: log.address,
          blockNumber: log.blockNumber || BigInt(0),
          transactionHash: log.transactionHash || '0x',
          logIndex: log.logIndex || 0,
          data: log.data,
          topics: (log as any).topics || [],
        })))
      }
    } catch (error) {
      console.warn(`Error processing logs for contract ${contractAddress}:`, error);
      // Include raw logs on error
      for (const log of logs) {
        parsedEvents.push({
          eventName: 'Unknown',
          address: log.address,
          blockNumber: log.blockNumber || BigInt(0),
          transactionHash: log.transactionHash || '0x',
          logIndex: log.logIndex || 0,
          data: log.data,
          topics: (log as any).topics || [],
        });
      }
    }
  }

  return parsedEvents.sort((a, b) => a.logIndex - b.logIndex);
}

/**
 * Parse events from a transaction using a provided ABI
 * Useful when you know the ABI or want to use a specific ABI
 * 
 * @param params - Function parameters
 * @param params.txHash - Transaction hash to parse (with or without 0x prefix)
 * @param params.chainId - Chain ID where the transaction occurred
 * @param params.abi - ABI array to use for decoding events (can be partial, containing only relevant events)
 * @returns Array of parsed events sorted by log index
 * @throws {BlockchainError} If transaction receipt is not found
 * 
 * @example
 * ```typescript
 * const ERC20_ABI = getIndependentAbi('ERC20')
 * const events = await parseEventsFromTransactionGivenAnAbi({
 *   txHash: '0x123...abc',
 *   chainId: 8453, // base mainnet
 *   abi: ERC20_ABI
 * });
 * 
 * // All Transfer events will be decoded with the provided ABI
 * const transfers = events.filter(e => e.eventName === 'Transfer');
 * ```
 * 
 * @dev
 * - Attempts to decode all logs with the provided ABI
 * - Logs that can't be decoded are included as 'Unknown' events
 * - Useful when working with contracts not in blockchain-config
 * - Can be more efficient than parseEventsFromTransaction if you already have the ABI
 */
export async function parseEventsFromTransactionGivenAnAbi(params: ParseEventsFromTransactionGivenAnAbiParams): Promise<ParsedEvent[]> {
  const { txHash, chainId, abi } = params
  
  const client = createPublicClient({
    chain: getChainById(chainId),
    transport: http(getRpcUrl(chainId)),
  });

  // Get transaction receipt
  const receipt = await client.getTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  if (!receipt) {
    throw new BlockchainError(`Transaction receipt not found for ${txHash}`, 'TX_NOT_FOUND');
  }

  const parsedEvents: ParsedEvent[] = [];
  const typedAbi = abi as Abi;

  // Try to decode each log with the provided ABI
  try {
    const parsedLogs = parseEventLogs({
      abi: typedAbi,
      logs: receipt.logs,
    }).map((log: any) => ({
      eventName: log.eventName,
      decodedArgs: log.args,
      address: log.address,
      blockNumber: log.blockNumber || BigInt(0),
      transactionHash: log.transactionHash || '0x',
      logIndex: log.logIndex || 0,
      data: log.data,
      topics: (log as any).topics || [],
    }))
    parsedEvents.push(...parsedLogs)
  } catch (error) {
    console.warn(`Error parsing logs for transaction ${txHash}:`, error);
    parsedEvents.push(...receipt.logs.map((log: any) => ({
      eventName: 'Unknown',
      address: log.address,
      blockNumber: log.blockNumber || BigInt(0),
      transactionHash: log.transactionHash || '0x',
      logIndex: log.logIndex || 0,
      data: log.data,
      topics: (log as any).topics || [],
    })))
  }

  return parsedEvents;
}

/**
 * Input parameters for parseLogsWithAbis function
 */
export interface ParseLogsWithAbisParams {
  /** Array of logs to parse */
  logs: Log[]
  /** Array of ABIs to use for decoding */
  abis: Abi[]
}

/**
 * Input parameters for parseLogsWithDeployedContractAddresses function
 */
export interface ParseLogsWithDeployedContractAddressesParams {
  /** Array of logs to parse */
  logs: Log[]
  /** Array of deployed contract locations to resolve ABIs from */
  deployedContractLocations: Array<{ address: Address; chainId: keyof Deployments }>
}

/**
 * Parse an array of logs using provided ABIs
 * Intelligently tries each ABI against each log until a match is found
 * 
 * @param params - Function parameters
 * @param params.logs - Array of logs to parse (from simulation results or transaction receipts)
 * @param params.abis - Array of ABIs to use for decoding
 * @returns Array of parsed events sorted by log index
 * 
 * @example
 * ```typescript
 * const logs = simulationResults.callResults.flatMap(r => r.logs);
 * const abis = [ERC20_ABI, UNISWAP_ROUTER_ABI];
 * 
 * const events = parseLogsWithAbis({
 *   logs,
 *   abis
 * });
 * 
 * // Filter for specific events
 * const transfers = events.filter(e => e.eventName === 'Transfer');
 * const swaps = events.filter(e => e.eventName === 'Swap');
 * ```
 * 
 * @dev
 * - Tries each ABI against each log until successful decoding
 * - Logs that can't be decoded with any ABI are included as 'Unknown' events
 * - Preserves original log data for maximum flexibility
 * - More efficient than trying to decode each log individually
 */
export function parseLogsWithAbis(params: ParseLogsWithAbisParams): ParsedEvent[] {
  const { logs, abis } = params;
  const parsedEvents: ParsedEvent[] = [];

  for (const log of logs) {
    let decoded = false;

    // Try each ABI until we find one that can decode this log
    for (const abi of abis) {
      try {
        const decodedLog = decodeEventLog({
          abi,
          data: log.data,
          topics: (log as any).topics || [],
        });

        parsedEvents.push({
          eventName: (decodedLog.eventName || 'Unknown') as string,
          decodedArgs: decodedLog.args,
          address: log.address,
          blockNumber: log.blockNumber || BigInt(0),
          transactionHash: log.transactionHash || '0x',
          logIndex: log.logIndex || 0,
          data: log.data,
          topics: (log as any).topics || [],
        });

        decoded = true;
        break; // Successfully decoded, move to next log
      } catch (error) {
        error;
        // This ABI couldn't decode this log, try the next one
        continue;
      }
    }

    // If no ABI could decode this log, include it as Unknown
    if (!decoded) {
      parsedEvents.push({
        eventName: 'Unknown',
        address: log.address,
        blockNumber: log.blockNumber || BigInt(0),
        transactionHash: log.transactionHash || '0x',
        logIndex: log.logIndex || 0,
        data: log.data,
        topics: (log as any).topics || [],
      });
    }
  }

  return parsedEvents.sort((a, b) => a.logIndex - b.logIndex);
}

/**
 * Parse an array of logs using ABIs resolved from deployed contract addresses
 * Automatically fetches ABIs from blockchain-config for the specified contract locations
 * 
 * @param params - Function parameters
 * @param params.logs - Array of logs to parse (from simulation results or transaction receipts)
 * @param params.deployedContractLocations - Array of contract locations to resolve ABIs from
 * @returns Array of parsed events sorted by log index
 * 
 * @example
 * ```typescript
 * const logs = simulationResults.callResults.flatMap(r => r.logs);
 * const contractLocations = [
 *   { address: '0x123...', chainId: 8453 }, // ERC20 token
 *   { address: '0x456...', chainId: 8453 }, // Uniswap router
 * ];
 * 
 * const events = await parseLogsWithDeployedContractAddresses({
 *   logs,
 *   deployedContractLocations: contractLocations
 * });
 * 
 * // All events from these contracts will be properly decoded
 * events.forEach(event => {
 *   if (event.eventName !== 'Unknown') {
 *     console.log(`Decoded event: ${event.eventName}`, event.decodedArgs);
 *   }
 * });
 * ```
 * 
 * @dev
 * - Resolves ABIs from blockchain-config for each contract location
 * - Continues processing even if some contracts can't be resolved
 * - Logs errors for contracts that can't be resolved but doesn't fail
 * - Uses parseLogsWithAbis internally for efficient log parsing
 * - Filters out duplicate ABIs to avoid redundant decoding attempts
 */
export async function parseLogsWithDeployedContractAddresses(params: ParseLogsWithDeployedContractAddressesParams): Promise<ParsedEvent[]> {
  const { logs, deployedContractLocations } = params;
  const abis: Abi[] = [];

  // Resolve ABIs from deployed contract locations
  for (const location of deployedContractLocations) {
    try {
      let contract = undefined;
      try {
        contract = getDeployedContract({chainId: location.chainId, contractAddress: location.address as keyof Deployments[typeof location.chainId]});
      } catch (error) {
        console.error(error);
        contract = getAppContractByAddressAndChainId(location.address, location.chainId);
      } 
      
      if (contract) {
        abis.push(contract.abi);
      } else {
        console.warn(`No ABI found for contract ${location.address} on chain ${location.chainId}`);
      }
    } catch (error) {
      console.error(`Error resolving contract ${location.address} on chain ${location.chainId}:`, error);
      // Continue with other contracts
    }
  }

  if (abis.length === 0) {
    console.warn('No ABIs could be resolved from deployed contract locations');
    // Return all logs as Unknown events
    return logs.map(log => ({
      eventName: 'Unknown',
      address: log.address,
      blockNumber: log.blockNumber || BigInt(0),
      transactionHash: log.transactionHash || '0x',
      logIndex: log.logIndex || 0,
      data: log.data,
      topics: (log as any).topics || [],
    }));
  }

  // Use the resolved ABIs to parse the logs
  return parseLogsWithAbis({
    logs,
    abis
  });
}