import { useState, useCallback, useEffect, useRef } from 'react'
import {
  type Abi,
  type Address,
  type Hash,
  type ContractFunctionName,
  type ContractFunctionArgs,
  encodeFunctionData,
} from 'viem'
import { useSendTransaction, useWaitForTransactionReceipt, useSwitchChain, useChainId } from 'wagmi'
import { toast } from 'sonner'
import { useWallet } from './useWallet'
import { BlockchainError, ChainSwitchError } from '../lib/blockchain/types'

/**
 * Parameters for writing to a contract
 */
export interface WriteContractParams<
  TAbi extends Abi = Abi,
  TName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'> = ContractFunctionName<TAbi, 'nonpayable' | 'payable'>
> {
  /** Contract address to interact with */
  contractAddress: Address
  /** Chain ID for the transaction */
  chainId: number
  /** Contract ABI */
  abi: TAbi
  /** Function name to call */
  functionName: TName
  /** Function arguments */
  args: ContractFunctionArgs<TAbi, 'nonpayable' | 'payable', TName>
  /** ETH value to send (in wei) */
  value?: bigint
}

/**
 * Transaction lifecycle status
 */
export type WriteStatus =
  | 'idle'
  | 'preparing'
  | 'ready'
  | 'switching-chain'
  | 'pending'
  | 'confirming'
  | 'success'
  | 'error'

/**
 * Current state of the write transaction lifecycle
 */
export interface WriteLifecycleState {
  /** Current status of the transaction */
  status: WriteStatus
  /** Whether any operation is in progress */
  isLoading: boolean
  /** Transaction hash once submitted */
  txHash: Hash | null
  /** Error if transaction failed */
  error: Error | null
}

/**
 * Prepared transaction data
 */
export interface PreparedWrite {
  /** Target contract address */
  to: Address
  /** Encoded function call data */
  data: `0x${string}`
  /** ETH value to send */
  value?: bigint
  /** Contract ABI (for reference) */
  abi: Abi
  /** Function name (for reference) */
  functionName: string
  /** Function arguments (for reference) */
  args: readonly unknown[]
}

/**
 * Options for the write contract lifecycle hook
 */
export interface WriteContractOptions {
  /** Callback when transaction succeeds */
  onSuccess?: (txHash: Hash) => void
  /** Callback when transaction fails */
  onError?: (error: Error) => void
  /** Custom success message for toast */
  successMessage?: string
  /** Custom error message for toast */
  errorMessage?: string
}

export interface UseWriteContractLifecycleReturn<
  TAbi extends Abi = Abi,
  TName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'> = ContractFunctionName<TAbi, 'nonpayable' | 'payable'>
> {
  /** Transaction state */
  state: WriteLifecycleState
  /** Execute write */
  write: <T extends TAbi, N extends ContractFunctionName<T, 'nonpayable' | 'payable'>>(
    params: WriteContractParams<T, N>
  ) => Promise<void>
  /** Reset state */
  reset: () => void
  /** Loading */
  isLoading: boolean
  /** Error */
  error: Error | null
  /** TX hash */
  txHash: Hash | null
  /** Status */
  status: WriteStatus
  /** Write params */
  writeData: WriteContractParams<TAbi, TName> | null
}

/**
 * Manage contract write transaction lifecycle
 * 
 * @example
 * ```typescript
 * const { write, state } = useWriteContractLifecycle({
 *   onSuccess: (txHash) => console.log('Success!', txHash),
 *   successMessage: 'Transfer completed!'
 * })
 * 
 * await write({
 *   contractAddress: tokenAddress,
 *   chainId: 8453,
 *   abi: ERC20_ABI,
 *   functionName: 'transfer',
 *   args: [recipient, amount],
 * })
 * ```
 */
export function useWriteContractLifecycle<
  TAbi extends Abi = Abi,
  TName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'> = ContractFunctionName<TAbi, 'nonpayable' | 'payable'>
>(options: WriteContractOptions): UseWriteContractLifecycleReturn<TAbi, TName> {
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  const scheduleDismiss = (id: string, ms: number) => { setTimeout(() => toast.dismiss(id), ms) }
  const onSuccess = options.onSuccess
  const onError = options.onError
  const successMessage = options.successMessage || 'Transaction completed successfully!'
  const errorMessage = options.errorMessage || 'Transaction failed. Please try again.'

  const { address, isConnected } = useWallet()
  const currentChainId = useChainId()
  const { switchChain } = useSwitchChain()
  
  const [writeData, setWriteData] = useState<WriteContractParams<TAbi, TName> | null>(null)
  const [state, setState] = useState<WriteLifecycleState>({
    status: 'idle',
    isLoading: false,
    txHash: null,
    error: null,
  })

  // Use refs to store callbacks to avoid including them in useEffect dependencies
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)
  const successMessageRef = useRef(successMessage)
  const errorMessageRef = useRef(errorMessage)

  // Update refs when callbacks change
  useEffect(() => {
    onSuccessRef.current = onSuccess
    onErrorRef.current = onError
    successMessageRef.current = successMessage
    errorMessageRef.current = errorMessage
  }, [onSuccess, onError, successMessage, errorMessage])

  // Send the transaction
  const {
    sendTransaction,
    data: sendData,
    error: sendError,
    isPending: isSending,
  } = useSendTransaction()

  // Wait for transaction confirmation
  const {
    isLoading: isConfirming,
    isSuccess,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: sendData,
  })

  /**
   * Prepare write transaction by encoding function data
   */
  const prepareWrite = useCallback(async <T extends Abi, N extends ContractFunctionName<T, 'nonpayable' | 'payable'>>(
    params: WriteContractParams<T, N>
  ): Promise<PreparedWrite> => {
    try {
      setState(prev => ({ ...prev, status: 'preparing', isLoading: true }))

      // Check if function is payable
      const fn = params.abi.find(
        (item) => item.type === 'function' && item.name === params.functionName
      )
      
      if (params.value && fn && 'stateMutability' in fn && fn.stateMutability !== 'payable') {
        throw new Error(`Function ${params.functionName} is not payable but value was provided`)
      }

      // Encode the function data
      const data = encodeFunctionData({
        abi: params.abi,
        functionName: params.functionName,
        args: params.args,
      } as any)

      const preparedWrite: PreparedWrite = {
        to: params.contractAddress,
        data,
        value: params.value,
        abi: params.abi,
        functionName: params.functionName as string,
        args: params.args as readonly unknown[],
      }

      setState(prev => ({ 
        ...prev, 
        status: 'ready', 
        isLoading: false,
      }))

      return preparedWrite
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      
      setState({
        status: 'error',
        error: errorObj,
        txHash: null,
        isLoading: false,
      })
      
      throw errorObj
    }
  }, [])

  /**
   * Handle chain switching if needed
   */
  const handleChainSwitch = useCallback(async (targetChainId: number): Promise<void> => {
    if (currentChainId === targetChainId) {
      return
    }

    try {
      setState(prev => ({ ...prev, status: 'switching-chain', isLoading: true }))

      switchChain({ chainId: targetChainId })
      
      toast.dismiss('chain-switch')
      toast.success('Network switched successfully', { id: 'chain-switch-success' })

      // Give a small delay to ensure the chain switch is complete
      await sleep(2000)

      // Fallback: ensure toasts are cleared after 5s (non-blocking)
      scheduleDismiss('chain-switch-success', 5000)
      scheduleDismiss('chain-switch', 5000)

    } catch (switchError) {
      toast.dismiss('chain-switch')
      toast.dismiss('chain-switch-success')
      const errorMsg = 'Failed to switch network. Please switch manually.'
      const chainError = new ChainSwitchError(currentChainId, targetChainId, switchError)
      
      toast.error(errorMsg)
      setState({
        status: 'error',
        error: chainError,
        txHash: null,
        isLoading: false,
      })
      
      throw chainError
    }
  }, [currentChainId, switchChain])

  /**
   * Execute the prepared write transaction
   */
  const executePreparedWrite = useCallback(async (preparedWrite: PreparedWrite): Promise<void> => {
    try {
      sendTransaction({
        to: preparedWrite.to,
        data: preparedWrite.data,
        value: preparedWrite.value,
      })
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      const blockchainError = new BlockchainError('Transaction execution failed', 'TX_EXECUTION_ERROR', errorObj)
      
      setState({
        status: 'error',
        error: blockchainError,
        txHash: null,
        isLoading: false,
      })
      
      throw blockchainError
    }
  }, [sendTransaction])

  // Update state based on transaction lifecycle
  useEffect(() => {
    if (sendError || confirmError) {
      const error = sendError || confirmError
      setState({
        status: 'error',
        error: error as Error,
        txHash: sendData || null,
        isLoading: false,
      })
      toast.dismiss('tx-pending')
      toast.error(errorMessageRef.current)
      setTimeout(() => { toast.dismiss('tx-confirming'); toast.dismiss('tx-pending') }, 5000)
      onErrorRef.current?.(error as Error)
    } else if (isSending) {
      setState({
        status: 'pending',
        error: null,
        txHash: null,
        isLoading: true,
      })
      toast.loading('Please confirm the transaction in your wallet...', { id: 'tx-pending' })
      setTimeout(() => toast.dismiss('tx-pending'), 5000)
    } else if (isConfirming) {
      setState({
        status: 'confirming',
        error: null,
        txHash: sendData || null,
        isLoading: true,
      })
      toast.dismiss('tx-pending')
      toast.loading('Transaction submitted. Waiting for confirmation...', { id: 'tx-confirming' })
      setTimeout(() => toast.dismiss('tx-confirming'), 5000)
    } else if (isSuccess) {
      setState({
        status: 'success',
        error: null,
        txHash: sendData || null,
        isLoading: false,
      })
      toast.dismiss('tx-confirming')
      toast.success(successMessageRef.current, { id: 'tx-success' })
      setTimeout(() => toast.dismiss('tx-success'), 5000)
      onSuccessRef.current?.(sendData!)
    }
  }, [sendError, confirmError, isSending, isConfirming, isSuccess, sendData])

  /**
   * Execute a write contract transaction with automatic preparation and chain switching
   */
  const write = useCallback(async <T extends TAbi, N extends ContractFunctionName<T, 'nonpayable' | 'payable'>>(
    params: WriteContractParams<T, N>
  ): Promise<void> => {
    if (!isConnected || !address) {
      const error = new BlockchainError('Wallet not connected', 'WALLET_NOT_CONNECTED')
      setState({
        status: 'error',
        error,
        txHash: null,
        isLoading: false,
      })
      toast.error('Please connect your wallet first', { duration: 5000 })
      throw error
    }

    try {
      setWriteData(params as any)
      
      // Handle chain switching if needed
      await handleChainSwitch(params.chainId)
      
      // Prepare the write transaction
      const preparedWrite = await prepareWrite(params)
      
      // Execute the transaction
      await executePreparedWrite(preparedWrite)
    } catch (error) {
      // Errors are already handled in the individual functions
      console.error('Write contract execution failed:', error)
    }
  }, [isConnected, address, handleChainSwitch, prepareWrite, executePreparedWrite])

  /**
   * Reset the write state
   */
  const reset = useCallback(() => {
    setState({
      status: 'idle',
      error: null,
      txHash: null,
      isLoading: false,
    })
    setWriteData(null)
  }, [])

  return {
    state,
    write,
    reset,
    isLoading: state.isLoading,
    error: state.error,
    txHash: state.txHash,
    status: state.status,
    writeData,
  }
}