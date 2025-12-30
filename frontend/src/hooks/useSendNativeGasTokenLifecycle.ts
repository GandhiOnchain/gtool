import { useState, useCallback, useEffect, useRef } from 'react'
import { type Address, type Hash } from 'viem'
import { useSendTransaction, useWaitForTransactionReceipt, useSwitchChain, useChainId } from 'wagmi'
import { toast } from 'sonner'
import { useWallet } from './useWallet'
import { BlockchainError, ChainSwitchError } from '../lib/blockchain/types'

export interface SendNativeGasTokenParams {
  /** Recipient */
  to: Address
  /** Chain ID */
  chainId: number
  /** Amount (wei) */
  value: bigint
}

export type SendStatus =
  | 'idle'
  | 'switching-chain'
  | 'pending'
  | 'confirming'
  | 'success'
  | 'error'

export interface SendLifecycleState {
  /** Current status */
  status: SendStatus
  /** Loading state */
  isLoading: boolean
  /** Transaction hash */
  txHash: Hash | null
  /** Error */
  error: Error | null
}

export interface SendOptions {
  /** Success callback */
  onSuccess?: (txHash: Hash) => void
  /** Error callback */
  onError?: (error: Error) => void
  /** Success message */
  successMessage?: string
  /** Error message */
  errorMessage?: string
}

export interface UseSendNativeGasTokenReturn {
  /** Transaction state */
  state: SendLifecycleState
  /** Send tokens */
  send: (params: SendNativeGasTokenParams) => Promise<void>
  /** Reset state */
  reset: () => void
  /** Loading */
  isLoading: boolean
  /** Error */
  error: Error | null
  /** TX hash */
  txHash: Hash | null
  /** Status */
  status: SendStatus
}

/**
 * Send native gas tokens (ETH, MATIC, etc.)
 * 
 * @example
 * ```typescript
 * const { send, state } = useSendNativeGasTokenLifecycle({
 *   onSuccess: (txHash) => console.log('Success!', txHash),
 *   successMessage: 'ETH sent!'
 * })
 * 
 * await send({
 *   to: recipientAddress,
 *   chainId: 8453,
 *   value: parseEther('0.1')
 * })
 * ```
 */
export function useSendNativeGasTokenLifecycle(options: SendOptions): UseSendNativeGasTokenReturn {
  const onSuccess = options.onSuccess
  const onError = options.onError
  const successMessage = options.successMessage || 'Transfer completed successfully!'
  const errorMessage = options.errorMessage || 'Transfer failed. Please try again.'

  const { address, isConnected } = useWallet()
  const currentChainId = useChainId()
  const { switchChain } = useSwitchChain()
  
  const [,setSendParams] = useState<SendNativeGasTokenParams | null>(null)
  const [state, setState] = useState<SendLifecycleState>({
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
   * Handle chain switching if needed
   */
  const handleChainSwitch = useCallback(async (targetChainId: number): Promise<void> => {
    if (currentChainId === targetChainId) {
      return
    }

    try {
      setState(prev => ({ ...prev, status: 'switching-chain', isLoading: true }))
      toast.loading('Please switch to the correct network...', { id: 'chain-switch' })

      switchChain({ chainId: targetChainId })
      
      toast.dismiss('chain-switch')
      toast.success('Network switched successfully')

      // Give a small delay to ensure the chain switch is complete
      await new Promise(resolve => setTimeout(resolve, 2000))

    } catch (switchError) {
      toast.dismiss('chain-switch')
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
   * Execute the native token transfer
   */
  const executeSend = useCallback(async (params: SendNativeGasTokenParams): Promise<void> => {
    try {
      sendTransaction({
        to: params.to,
        value: params.value,
      })
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      const blockchainError = new BlockchainError('Transfer execution failed', 'TX_EXECUTION_ERROR', errorObj)
      
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
      onErrorRef.current?.(error as Error)
    } else if (isSending) {
      setState({
        status: 'pending',
        error: null,
        txHash: null,
        isLoading: true,
      })
      toast.loading('Please confirm the transaction in your wallet...', { id: 'tx-pending' })
    } else if (isConfirming) {
      setState({
        status: 'confirming',
        error: null,
        txHash: sendData || null,
        isLoading: true,
      })
      toast.dismiss('tx-pending')
      toast.loading('Transaction submitted. Waiting for confirmation...', { id: 'tx-confirming' })
    } else if (isSuccess) {
      setState({
        status: 'success',
        error: null,
        txHash: sendData || null,
        isLoading: false,
      })
      toast.dismiss('tx-confirming')
      toast.success(successMessageRef.current)
      onSuccessRef.current?.(sendData!)
    }
  }, [sendError, confirmError, isSending, isConfirming, isSuccess, sendData])

  /**
   * Send native gas token with automatic chain switching
   */
  const send = useCallback(async (params: SendNativeGasTokenParams): Promise<void> => {
    if (!isConnected || !address) {
      const error = new BlockchainError('Wallet not connected', 'WALLET_NOT_CONNECTED')
      setState({
        status: 'error',
        error,
        txHash: null,
        isLoading: false,
      })
      toast.error('Please connect your wallet first')
      throw error
    }

    try {
      setSendParams(params)
      
      // Handle chain switching if needed
      await handleChainSwitch(params.chainId)
      
      // Execute the transfer
      await executeSend(params)
    } catch (error) {
      // Errors are already handled in the individual functions
      console.error('Native token send failed:', error)
    }
  }, [isConnected, address, handleChainSwitch, executeSend])

  /**
   * Reset the send state
   */
  const reset = useCallback(() => {
    setState({
      status: 'idle',
      error: null,
      txHash: null,
      isLoading: false,
    })
    setSendParams(null)
  }, [])

  return {
    state,
    send,
    reset,
    isLoading: state.isLoading,
    error: state.error,
    txHash: state.txHash,
    status: state.status,
  }
}