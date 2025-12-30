import type { Abi, Address, ContractFunctionName, ContractFunctionArgs } from 'viem'

/**
 * Viewability of a function for a read-only operation
 */
type Viewability = 'pure' | 'view';

/**
 * Parameters for reading data from a smart contract
 * 
 * @example
 * ```typescript
 * const params: ReadContractParams<typeof ERC20_ABI, 'balanceOf'> = {
 *   contractAddress: '0x...',
 *   chainId: 1,
 *   abi: ERC20_ABI,
 *   functionName: 'balanceOf',
 *   args: ['0xuser...']
 * }
 * ```
 */
export interface ReadContractParams<
  TAbi extends Abi,
  TName extends ContractFunctionName<TAbi, Viewability>
> {
  /** Contract address to read from */
  contractAddress: Address
  /** Chain ID where the contract is deployed */
  chainId: number
  /** Contract ABI */
  abi: TAbi
  /** Function name to call */
  functionName: TName
  /** Function arguments */
  args?: ContractFunctionArgs<TAbi, Viewability, TName>
  /** Block number to read from (defaults to latest) */
  blockNumber?: bigint
}

/**
 * Basic contract configuration with address, ABI, and chain
 * 
 * @example
 * ```typescript
 * const config: ContractConfig = {
 *   address: '0x...',
 *   abi: ERC20_ABI,
 *   chainId: 1
 * }
 * ```
 */
export interface ContractConfig {
  /** Contract address */
  address: Address
  /** Contract ABI */
  abi: Abi
  /** Chain ID where contract is deployed */
  chainId: number
}

/**
 * Network/chain configuration
 * 
 * @example
 * ```typescript
 * const network: NetworkConfig = {
 *   chainId: 1,
 *   slug: 'ethereum',
 *   name: 'Ethereum Mainnet',
 *   rpcUrl: 'https://eth.rpc.url',
 *   explorerUrl: 'https://etherscan.io'
 * }
 * ```
 */
export interface NetworkConfig {
  /** Chain ID */
  chainId: number
  /** URL-friendly identifier */
  slug: string
  /** Human-readable name */
  name: string
  /** RPC endpoint URL */
  rpcUrl: string
  /** Block explorer URL */
  explorerUrl: string
}

/**
 * Toast notification messages for different transaction states
 * 
 * @example
 * ```typescript
 * const toasts: ToastConfig = {
 *   success: 'Transaction successful!',
 *   error: 'Transaction failed',
 *   pending: 'Transaction pending...',
 *   switching: 'Switching chains...'
 * }
 * ```
 */
export interface ToastConfig {
  /** Message shown on success */
  success?: string
  /** Message shown on error */
  error?: string
  /** Message shown while pending */
  pending?: string
  /** Message shown while switching chains */
  switching?: string
}

/**
 * Parsed blockchain event from a transaction log
 * 
 * @example
 * ```typescript
 * const event: ParsedEvent = {
 *   eventName: 'Transfer',
 *   decodedArgs: {
 *     from: '0xsender...',
 *     to: '0xreceiver...',
 *     value: 1000000000000000000n // 1 ETH
 *   },
 *   address: '0xtoken...',
 *   blockNumber: 12345678n,
 *   transactionHash: '0xtxhash...',
 *   logIndex: 0,
 *   data: '0x...',
 *   topics: ['0xevent_signature...', '0xindexed_param...']
 * }
 * ```
 */
export interface ParsedEvent {
  /** Event name (e.g., 'Transfer', 'Approval') or 'Unknown' if decoding failed */
  eventName: string;
  
  /** Decoded event arguments (structure depends on event ABI) */
  decodedArgs?: any;
  
  /** Contract address that emitted this event */
  address: string;
  
  /** Block number where this event was emitted */
  blockNumber: bigint;
  
  /** Transaction hash that created this event */
  transactionHash: string;
  
  /** Index of this log within the transaction (for ordering) */
  logIndex: number;
  
  /** Raw hex-encoded event data */
  data: string;
  
  /** Indexed event parameters (topics[0] is the event signature) */
  topics: string[];
}

/**
 * Base error class for blockchain-related errors
 */
export class BlockchainError extends Error {
  constructor(
    message: string,
    public code?: string,
    public data?: unknown
  ) {
    super(message)
    this.name = 'BlockchainError'
  }
}

/**
 * Error thrown when an ABI file cannot be loaded
 */
export class AbiLoadError extends BlockchainError {
  constructor(abiFileName: string, cause?: unknown) {
    super(`Failed to load ABI: ${abiFileName}`, 'ABI_LOAD_ERROR', cause)
    this.name = 'AbiLoadError'
  }
}

/**
 * Error thrown when a contract is not found in deployments
 */
export class ContractNotFoundError extends BlockchainError {
  constructor(contractKey: string, chainId: number) {
    super(
      `Contract ${contractKey} not found on chain ${chainId}`,
      'CONTRACT_NOT_FOUND',
      { contractKey, chainId }
    )
    this.name = 'ContractNotFoundError'
  }
}

/**
 * Error thrown when chain switching fails
 */
export class ChainSwitchError extends BlockchainError {
  constructor(fromChainId: number, toChainId: number, cause?: unknown) {
    super(
      `Failed to switch from chain ${fromChainId} to ${toChainId}`,
      'CHAIN_SWITCH_ERROR',
      { fromChainId, toChainId, cause }
    )
    this.name = 'ChainSwitchError'
  }
}