import { useState, useCallback, useEffect, useRef } from 'react'
import {
  type Abi,
  type Address,
  type Hash,
  type ContractFunctionName,
  type ContractFunctionArgs,
  encodeFunctionData,
  createPublicClient,
  http,
} from 'viem'
import { useSendTransaction, useWaitForTransactionReceipt, useSwitchChain, useChainId } from 'wagmi'
import { toast } from 'sonner'
import { useWallet } from './useWallet'
import { BlockchainError, ChainSwitchError } from '../lib/blockchain/types'
import { getChainById, getRpcUrl } from '../lib/blockchain/chains'

const GAS_BUFFER_MULTIPLIER = 130n
const GAS_DIVISOR = 100n
const CHAIN_SWITCH_TIMEOUT_MS = 8_000

export interface WriteContractParams<
  TAbi extends Abi = Abi,
  TName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'> = ContractFunctionName<TAbi, 'nonpayable' | 'payable'>
> {
  contractAddress: Address
  chainId: number
  abi: TAbi
  functionName: TName
  args: ContractFunctionArgs<TAbi, 'nonpayable' | 'payable', TName>
  value?: bigint
}

export type WriteStatus =
  | 'idle'
  | 'preparing'
  | 'ready'
  | 'switching-chain'
  | 'pending'
  | 'confirming'
  | 'success'
  | 'error'

export interface WriteLifecycleState {
  status: WriteStatus
  isLoading: boolean
  txHash: Hash | null
  error: Error | null
}

export interface PreparedWrite {
  to: Address
  data: `0x${string}`
  value?: bigint
  gas?: bigint
  abi: Abi
  functionName: string
  args: readonly unknown[]
}

export interface WriteContractOptions {
  onSuccess?: (txHash: Hash) => void
  onError?: (error: Error) => void
  successMessage?: string
  errorMessage?: string
}

export interface UseWriteContractLifecycleReturn<
  TAbi extends Abi = Abi,
  TName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'> = ContractFunctionName<TAbi, 'nonpayable' | 'payable'>
> {
  state: WriteLifecycleState
  write: <T extends TAbi, N extends ContractFunctionName<T, 'nonpayable' | 'payable'>>(
    params: WriteContractParams<T, N>
  ) => Promise<void>
  reset: () => void
  isLoading: boolean
  error: Error | null
  txHash: Hash | null
  status: WriteStatus
  writeData: WriteContractParams<TAbi, TName> | null
}

export function useWriteContractLifecycle<
  TAbi extends Abi = Abi,
  TName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'> = ContractFunctionName<TAbi, 'nonpayable' | 'payable'>
>(options: WriteContractOptions): UseWriteContractLifecycleReturn<TAbi, TName> {
  const scheduleDismiss = (id: string, ms: number) => { setTimeout(() => toast.dismiss(id), ms) }
  const onSuccess = options.onSuccess
  const onError = options.onError
  const successMessage = options.successMessage || 'Transaction completed successfully!'
  const errorMessage = options.errorMessage || 'Transaction failed. Please try again.'

  const { address, isConnected } = useWallet()
  const currentChainId = useChainId()
  const { switchChainAsync } = useSwitchChain()

  const [writeData, setWriteData] = useState<WriteContractParams<TAbi, TName> | null>(null)
  const [state, setState] = useState<WriteLifecycleState>({
    status: 'idle',
    isLoading: false,
    txHash: null,
    error: null,
  })

  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)
  const successMessageRef = useRef(successMessage)
  const errorMessageRef = useRef(errorMessage)

  useEffect(() => {
    onSuccessRef.current = onSuccess
    onErrorRef.current = onError
    successMessageRef.current = successMessage
    errorMessageRef.current = errorMessage
  }, [onSuccess, onError, successMessage, errorMessage])

  const {
    sendTransactionAsync,
    data: sendData,
    error: sendError,
    isPending: isSending,
  } = useSendTransaction()

  const {
    isLoading: isConfirming,
    isSuccess,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: sendData,
  })

  /**
   * Get or create a cached public client for a given chainId.
   * Avoids spinning up a new HTTP connection on every gas estimate.
   */
  const clientCache = useRef<Map<number, ReturnType<typeof createPublicClient>>>(new Map())
  const getPublicClient = useCallback((chainId: number) => {
    if (!clientCache.current.has(chainId)) {
      const chain = getChainById(chainId)
      if (!chain) throw new Error(`Unsupported chain ID: ${chainId}`)
      clientCache.current.set(
        chainId,
        createPublicClient({ chain, transport: http(getRpcUrl(chainId)) })
      )
    }
    return clientCache.current.get(chainId)!
  }, [])

  /**
   * Estimate gas using simulateContract (more accurate than eth_estimateGas for
   * complex calls) with a 1.3x safety buffer. Falls back to eth_estimateGas,
   * then to undefined so the wallet uses its own estimate.
   */
  const estimateGasForCall = useCallback(async (
    params: WriteContractParams,
    from: Address
  ): Promise<bigint | undefined> => {
    try {
      const client = getPublicClient(params.chainId)
      const { request } = await client.simulateContract({
        abi: params.abi,
        address: params.contractAddress,
        functionName: params.functionName,
        args: params.args,
        value: params.value,
        account: from,
      } as any)

      const estimated = await client.estimateContractGas(request as any)
      return (estimated * GAS_BUFFER_MULTIPLIER) / GAS_DIVISOR
    } catch {
      try {
        const client = getPublicClient(params.chainId)
        const data = encodeFunctionData({
          abi: params.abi,
          functionName: params.functionName,
          args: params.args,
        } as any)
        const estimated = await client.estimateGas({
          account: from,
          to: params.contractAddress,
          data,
          value: params.value,
        })
        return (estimated * GAS_BUFFER_MULTIPLIER) / GAS_DIVISOR
      } catch {
        return undefined
      }
    }
  }, [getPublicClient])

  /**
   * Prepare encoded calldata and estimate gas in parallel.
   */
  const prepareWrite = useCallback(async <T extends Abi, N extends ContractFunctionName<T, 'nonpayable' | 'payable'>>(
    params: WriteContractParams<T, N>
  ): Promise<PreparedWrite> => {
    setState(prev => ({ ...prev, status: 'preparing', isLoading: true }))

    const fn = params.abi.find(
      (item) => item.type === 'function' && item.name === params.functionName
    )
    if (params.value && fn && 'stateMutability' in fn && fn.stateMutability !== 'payable') {
      throw new Error(`Function ${params.functionName} is not payable but value was provided`)
    }

    const [data, gasLimit] = await Promise.all([
      Promise.resolve(encodeFunctionData({
        abi: params.abi,
        functionName: params.functionName,
        args: params.args,
      } as any)),
      address ? estimateGasForCall(params as WriteContractParams, address as Address) : Promise.resolve(undefined),
    ])

    setState(prev => ({ ...prev, status: 'ready', isLoading: false }))

    return {
      to: params.contractAddress,
      data,
      value: params.value,
      gas: gasLimit,
      abi: params.abi,
      functionName: params.functionName as string,
      args: params.args as readonly unknown[],
    }
  }, [address, estimateGasForCall])

  /**
   * Switch chain and wait for the wallet to confirm the switch — no arbitrary sleep.
   */
  const handleChainSwitch = useCallback(async (targetChainId: number): Promise<void> => {
    if (currentChainId === targetChainId) return

    setState(prev => ({ ...prev, status: 'switching-chain', isLoading: true }))

    try {
      await Promise.race([
        switchChainAsync({ chainId: targetChainId }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Chain switch timed out')), CHAIN_SWITCH_TIMEOUT_MS)
        ),
      ])
      toast.success('Network switched', { id: 'chain-switch-success', duration: 3000 })
    } catch (switchError) {
      toast.dismiss('chain-switch-success')
      const chainError = new ChainSwitchError(currentChainId, targetChainId, switchError)
      toast.error('Failed to switch network. Please switch manually.')
      setState({ status: 'error', error: chainError, txHash: null, isLoading: false })
      throw chainError
    }
  }, [currentChainId, switchChainAsync])

  /**
   * Send the transaction. Gas is already baked into preparedWrite.
   * Uses sendTransactionAsync so errors are thrown directly (not via state),
   * enabling proper catch/retry without relying on wagmi's sendError state.
   */
  const executePreparedWrite = useCallback(async (preparedWrite: PreparedWrite): Promise<void> => {
    try {
      await sendTransactionAsync({
        to: preparedWrite.to,
        data: preparedWrite.data,
        value: preparedWrite.value,
        gas: preparedWrite.gas,
      })
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      const blockchainError = new BlockchainError('Transaction execution failed', 'TX_EXECUTION_ERROR', errorObj)
      setState({ status: 'error', error: blockchainError, txHash: null, isLoading: false })
      throw blockchainError
    }
  }, [sendTransactionAsync])

  useEffect(() => {
    if (sendError || confirmError) {
      const error = sendError || confirmError
      setState({ status: 'error', error: error as Error, txHash: sendData || null, isLoading: false })
      toast.dismiss('tx-pending')
      toast.error(errorMessageRef.current)
      scheduleDismiss('tx-confirming', 5000)
      scheduleDismiss('tx-pending', 5000)
      onErrorRef.current?.(error as Error)
    } else if (isSending) {
      setState({ status: 'pending', error: null, txHash: null, isLoading: true })
      toast.loading('Confirm the transaction in your wallet...', { id: 'tx-pending' })
      scheduleDismiss('tx-pending', 60_000)
    } else if (isConfirming) {
      setState({ status: 'confirming', error: null, txHash: sendData || null, isLoading: true })
      toast.dismiss('tx-pending')
      toast.loading('Waiting for confirmation...', { id: 'tx-confirming' })
      scheduleDismiss('tx-confirming', 60_000)
    } else if (isSuccess) {
      setState({ status: 'success', error: null, txHash: sendData || null, isLoading: false })
      toast.dismiss('tx-confirming')
      toast.success(successMessageRef.current, { id: 'tx-success', duration: 5000 })
      onSuccessRef.current?.(sendData!)
    }
  }, [sendError, confirmError, isSending, isConfirming, isSuccess, sendData])

  const write = useCallback(async <T extends TAbi, N extends ContractFunctionName<T, 'nonpayable' | 'payable'>>(
    params: WriteContractParams<T, N>
  ): Promise<void> => {
    if (!isConnected || !address) {
      const error = new BlockchainError('Wallet not connected', 'WALLET_NOT_CONNECTED')
      setState({ status: 'error', error, txHash: null, isLoading: false })
      toast.error('Please connect your wallet first', { duration: 5000 })
      throw error
    }

    try {
      setWriteData(params as any)

      // Chain switch must complete before sending; gas estimation hits target chain RPC
      // so it can run in parallel with the switch itself.
      const [, preparedWrite] = await Promise.all([
        handleChainSwitch(params.chainId),
        prepareWrite(params),
      ])

      await executePreparedWrite(preparedWrite)
    } catch (error) {
      console.error('Write contract execution failed:', error)
    }
  }, [isConnected, address, handleChainSwitch, prepareWrite, executePreparedWrite])

  const reset = useCallback(() => {
    setState({ status: 'idle', error: null, txHash: null, isLoading: false })
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
