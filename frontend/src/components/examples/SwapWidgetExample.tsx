/**
 * SwapWidgetExample.tsx
 * 
 * This file demonstrates how to use all the blockchain hooks in a real-world scenario.
 * It implements a token swap widget for VIE tokens using the VieTokenSwapManager contract.
 * 
 * Key features demonstrated:
 * 1. Reading contract data (token balances)
 * 2. Simulating transactions before execution
 * 3. Generating permit signatures for gasless approvals
 * 4. Executing swap transactions
 * 5. Parsing and displaying events from transactions
 * 6. Watching live events with automatic balance updates
 * 7. Sending native gas tokens (ETH)
 * 
 * This example is designed to show AI assistants how to properly use each hook
 * with correct typing, error handling, and user feedback.
 */

import React, { useState, useEffect, } from 'react'
import { formatUnits, parseUnits, type Address, } from 'viem'
import { useAccount, useBalance } from 'wagmi'

// Import all our custom hooks
import { useReadContract } from '@/hooks/useReadContract'
import { useWriteContractLifecycle } from '@/hooks/useWriteContractLifecycle'
import { useSimulateWriteContracts } from '@/hooks/useSimulateWriteContracts'
import { useSendNativeGasTokenLifecycle } from '@/hooks/useSendNativeGasTokenLifecycle'
import { usePermitSignature } from '@/hooks/useSignatures'
import { useBlockchainClient } from '@/hooks/useBlockchainClient'
import { getTypedLogs, useWatchEvent } from '@/hooks/useWatchEvent'

// Import blockchain config utilities
import { getDeployedContract, getIndependentAbi } from '@/blockchain-config'
import { parseEventsFromTransaction } from '@/lib/blockchain/events'
import type { ParsedEvent } from '@/lib/blockchain/types'
import { JSONStringifyBigIntHelper } from '@/lib/blockchain/bigint'

// Constants - Replace these with actual addresses
const CHAIN_ID = 8453 as const // Base mainnet
const VIE_TOKEN_ADDRESS = '0x298b18b846df66ea0e4913ea5cba2ec9e5c399d8' as const
const SWAP_MANAGER_ADDRESS = '0x9d734c03953b6f700d9008d6a78e873f5b3c9340' as const

// Get ABIs
const ERC20_ABI = getIndependentAbi('ERC20')
const SWAP_MANAGER_CONTRACT = getDeployedContract({ 
  chainId: CHAIN_ID, 
  contractAddress: SWAP_MANAGER_ADDRESS
})

export function SwapWidgetExample() {
  const { address: userAddress } = useAccount()
  const publicClient = useBlockchainClient({ chainId: CHAIN_ID })

  // State for swap widget
  const [swapMode, setSwapMode] = useState<'buy' | 'sell'>('buy')
  const [inputAmount, setInputAmount] = useState('')
  const [quotedAmount, setQuotedAmount] = useState<string | null>(null)
  
  // State for ETH transfer
  const [recipientAddress, setRecipientAddress] = useState('')
  const [ethAmount, setEthAmount] = useState('')
  
  // State for events display
  const [recentEvents, setRecentEvents] = useState<ParsedEvent[]>([])
  const [lastTxHash, setLastTxHash] = useState<string | null>(null)

  /**
   * 1. CONTRACT READ EXAMPLE
   * Read user's VIE token balance using the generic ERC20 ABI
   * This demonstrates how to use getIndependentAbi for standard contracts
   */
  const { 
    data: vieBalance, 
    refetch: refetchBalance,
    isRefetching: isRefetchingBalance
  } = useReadContract({
    contractAddress: VIE_TOKEN_ADDRESS,
    chainId: CHAIN_ID,
    abi: ERC20_ABI,
    functionName: 'balanceOf' as const,
    args: userAddress ? [userAddress as Address] : undefined,
    options: {
      enabled: !!userAddress,
      refetchInterval: 5000 // Refetch every 5 seconds
    }
  })

  /**
   * Read user's ETH balance using wagmi's useBalance hook
   * This is simpler than using contract reads for native tokens
   */
  const { data: ethBalanceData } = useBalance({
    address: userAddress,
    chainId: CHAIN_ID
  })

  /**
   * 2. SIMULATION HOOK EXAMPLE
   * Simulate swap transactions to get quotes and check for errors
   * This demonstrates proper use of useSimulateWriteContracts with typed returns
   */
  const { simulateOneTransaction, simulateTwoTransactions, loading: isQuoting } = useSimulateWriteContracts()

  // Quote function that uses simulation
  const getQuote = async () => {
    if (!inputAmount || !userAddress) return

    try {
      const amount = parseUnits(inputAmount, 18) // Assuming 18 decimals

      if (swapMode === 'buy') {
        // For buying, simulate the swap directly
        const buyCall = {
          contractAddress: SWAP_MANAGER_ADDRESS as Address,
          abi: SWAP_MANAGER_CONTRACT.abi,
          functionName: 'swapExactEthAmountForToken' as const,
          args: [VIE_TOKEN_ADDRESS as Address, amount, 0n] as [`0x${string}`, bigint, bigint],
          value: amount,
          chainId: CHAIN_ID
        }
        
        const result = await simulateOneTransaction(buyCall)

        const firstResult = result.callResult
        if (firstResult?.status === 'success' && firstResult?.result !== undefined) {
          const outputAmount = firstResult.result
          setQuotedAmount(formatUnits(outputAmount, 18))
        } else {
          setQuotedAmount(null)
        }
      } else {
        // For selling, we need to simulate 2 transactions:
        // 1. Approve the swap manager to spend tokens
        // 2. Execute the swap
        const approveCall = {
          contractAddress: VIE_TOKEN_ADDRESS as Address,
          abi: ERC20_ABI,
          functionName: 'approve' as const,
          args: [SWAP_MANAGER_ADDRESS, amount] as [`0x${string}`, bigint],
          value: 0n,

          chainId: CHAIN_ID
        }
        
        const swapCall = {
          contractAddress: SWAP_MANAGER_ADDRESS as Address,
          abi: SWAP_MANAGER_CONTRACT.abi,
          functionName: 'swapExactTokenAmountForEth' as const,
          args: [VIE_TOKEN_ADDRESS, amount, 0n] as [`0x${string}`, bigint, bigint],
          value: 0n,

          chainId: CHAIN_ID
        }
        
        const result = await simulateTwoTransactions(approveCall, swapCall)

        // The swap result is in the second transaction
        const secondResult = result.secondCallResult
        if (secondResult?.status === 'success' && secondResult?.result !== undefined) {
          const outputAmount = secondResult.result
          setQuotedAmount(formatUnits(outputAmount, 18))
        } else {
          setQuotedAmount(null)
        }
      }
    } catch (error) {
      console.error('Quote error:', error)
      setQuotedAmount(null)
    }
  }

  // Get quote when input changes
  useEffect(() => {
    if (inputAmount) {
      const debounce = setTimeout(getQuote, 500)
      return () => clearTimeout(debounce)
    } else {
      setQuotedAmount(null)
    }
  }, [inputAmount, swapMode])

  /**
   * 3. PERMIT SIGNATURE EXAMPLE
   * Generate permit signature for gasless token approval
   * This demonstrates EIP-2612 permit functionality
   */
  const { signPermit, reset: resetPermitSignature } = usePermitSignature()

  const generatePermitForSwap = async () => {
    if (!userAddress || !inputAmount || swapMode !== 'sell') return null

    try {
      const amount = parseUnits(inputAmount, 18)
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600) // 1 hour from now

      const result = await signPermit({
        token: VIE_TOKEN_ADDRESS,
        spender: SWAP_MANAGER_ADDRESS,
        value: amount,
        deadline,
        chainId: CHAIN_ID
      })

      resetPermitSignature()

      return { ...result, deadline }
    } catch (error) {
      console.error('Permit signature failed:', error)
      return null
    }
  }

  /**
   * 4. WRITE CONTRACT LIFECYCLE EXAMPLE
   * Execute the swap transaction with full lifecycle management
   * This demonstrates proper transaction execution with status tracking
   */
  const {
    write: executeSwap,
    state: swapState,
    reset: resetSwap,
  } = useWriteContractLifecycle({
    onSuccess: (txHash) => console.log('Swap successful:', txHash),
    onError: (error) => console.error('Swap failed:', error),
    successMessage: `Successfully ${swapMode === 'buy' ? 'bought' : 'sold'} VIE tokens!`,
    errorMessage: `Failed to ${swapMode} VIE tokens`
  })

  const handleBuyVieTokens = async () => {
    if (!userAddress || !inputAmount || !quotedAmount) return

    const ethAmount = parseUnits(inputAmount, 18)
    // Use 95% of quoted amount as minimum to account for slippage
    const minimumTokenAmount = (parseUnits(quotedAmount, 18) * 95n) / 100n

    // Execute the buy swap
    await executeSwap({
      contractAddress: SWAP_MANAGER_ADDRESS,
      abi: SWAP_MANAGER_CONTRACT.abi,
      functionName: 'swapExactEthAmountForToken',
      args: [
        VIE_TOKEN_ADDRESS as Address,
        ethAmount,
        minimumTokenAmount
      ],
      value: ethAmount,
      chainId: CHAIN_ID
    })
  }

  const handleSellVieTokens = async () => {
    if (!userAddress || !inputAmount || !quotedAmount) return

    const tokenAmount = parseUnits(inputAmount, 18)
    // Use 95% of quoted amount as minimum to account for slippage
    const minimumEthAmount = (parseUnits(quotedAmount, 18) * 95n) / 100n

    // Generate permit signature
    const permitSig = await generatePermitForSwap()
    if (!permitSig) {
      console.error('Failed to generate permit signature')
      return
    }

    // Execute the sell swap
    await executeSwap({
      contractAddress: SWAP_MANAGER_ADDRESS,
      abi: SWAP_MANAGER_CONTRACT.abi,
      functionName: 'swapExactTokenAmountForEthWithPermitSignature',
      args: [
        VIE_TOKEN_ADDRESS as Address,
        tokenAmount,
        minimumEthAmount,
        {
          v: permitSig.v!,
          r: permitSig.r!,
          s: permitSig.s!,
          deadline: permitSig.deadline
        }
      ] as const,
      value: 0n,
      chainId: CHAIN_ID
    })
  }

  const handleSwap = async () => {
    if (swapMode === 'buy') {
      await handleBuyVieTokens()
    } else {
      await handleSellVieTokens()
    }
  }

  // Watch for successful transaction
  useEffect(() => {
    if (swapState.txHash && swapState.status === 'success') {
      setLastTxHash(swapState.txHash)
      // Refetch balance after successful swap
      setTimeout(() => refetchBalance(), 2000)
      resetSwap()
    }
  }, [
	swapState.txHash,
	swapState.status,
	refetchBalance,
	resetSwap
])

  /**
   * 5. EVENT PARSING EXAMPLE
   * Parse events from the last transaction
   * This demonstrates how to extract and display blockchain events
   */
  useEffect(() => {
    if (lastTxHash && publicClient) {
      parseEventsFromTransaction({
        txHash: lastTxHash,
        chainId: CHAIN_ID
      }).then(events => {
        setRecentEvents(events)
      }).catch(console.error)
    }
  }, [lastTxHash, publicClient])

  /**
   * 6. WATCH EVENT EXAMPLE
   * Watch for ALL Transfer events on the VIE token in real-time
   * This demonstrates the useWatchEvent hook with proper typing
   */
  const { 
    logs: transferLogs, 
    isWatching,
    clearLogs 
  } = useWatchEvent({
    chainId: CHAIN_ID,
    contractAddress: VIE_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    eventName: 'Transfer',
    enabled: true, // immediately start watching
    pollingInterval: 2000, // Poll every 2 seconds
    onLogs: (logs) => {
      console.log('New transfer events:', logs)

      // If you're an AI reading this: it's VERY IMPORTANT to use getTypedLogs
      const typedLogs = getTypedLogs<typeof ERC20_ABI, 'Transfer'>(ERC20_ABI, 'Transfer', logs)
      // Check if any transfers involve the user and refetch balance
      if (userAddress && typedLogs.some(log => {
        const args = log.args
        return args?.from === userAddress || args?.to === userAddress
      })) {
        console.log('User balance may have changed, refetching...')
        refetchBalance()
      }
    }
  })

  /**
   * 7. SEND NATIVE GAS TOKEN EXAMPLE
   * Send ETH to any address
   * This demonstrates the useSendNativeGasTokenLifecycle hook
   */
  const {
    send: sendEth,
    state: sendEthState,
    txHash: sendEthTxHash
  } = useSendNativeGasTokenLifecycle({
    onSuccess: (txHash) => console.log('ETH sent successfully:', txHash),
    onError: (error) => console.error('Failed to send ETH:', error),
    successMessage: 'Successfully sent ETH!',
    errorMessage: 'Failed to send ETH'
  })

  const handleSendEth = async () => {
    if (!recipientAddress || !ethAmount) return

    try {
      const amount = parseUnits(ethAmount, 18)
      
      await sendEth({
        to: recipientAddress as Address,
        value: amount,
        chainId: CHAIN_ID
      })
    } catch (error) {
      console.error('Failed to send ETH:', error)
    }
  }

  // Clear inputs on successful ETH send
  useEffect(() => {
    if (sendEthTxHash && sendEthState.status === 'success') {
      setRecipientAddress('')
      setEthAmount('')
    }
  }, [sendEthTxHash, sendEthState.status])

  const typedTransferLogs = getTypedLogs<typeof ERC20_ABI, 'Transfer'>(ERC20_ABI, 'Transfer', transferLogs)

  /**
   * UI RENDERING
   * This section demonstrates how to display blockchain data and handle user interactions
   */
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Token Balances Display */}
      <div className="bg-gray-100 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Your Balances</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span>VIE Token Balance: {vieBalance ? formatUnits(vieBalance as bigint, 18) : '0'} VIE</span>
            {isRefetchingBalance && (
              <svg className="animate-spin h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </div>
          <div>
            ETH Balance: {ethBalanceData ? formatUnits(ethBalanceData.value, ethBalanceData.decimals) : '0'} ETH
          </div>
        </div>
      </div>

      {/* Swap Widget */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">VIE Token Swap</h2>
        
        {/* Swap Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
          onClick={() => setSwapMode('buy')}
            className={`px-4 py-2 rounded ${
              swapMode === 'buy' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Buy VIE
          </button>
          <button
            onClick={() => setSwapMode('sell')}
            className={`px-4 py-2 rounded ${
              swapMode === 'sell' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Sell VIE
          </button>
        </div>

        {/* Input Amount */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Amount ({swapMode === 'buy' ? 'ETH' : 'VIE'})
          </label>
          <input
            type="number"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            placeholder="0.0"
            className="w-full px-3 py-2 border rounded-lg"
            disabled={['pending', 'preparing'].includes(swapState.status)}
          />
        </div>

        {/* Quote Display */}
        {quotedAmount && (
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">You will receive:</div>
            <div className="text-lg font-semibold">
              {quotedAmount} {swapMode === 'buy' ? 'VIE' : 'ETH'}
            </div>
          </div>
        )}

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={
            !inputAmount || 
            !quotedAmount || 
            ['pending', 'preparing'].includes(swapState.status) ||
            isQuoting
          }
          className={`w-full py-3 rounded-lg font-medium ${
            swapState.status === 'idle' && inputAmount && quotedAmount
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {swapState.status === 'idle' 
            ? `Swap ${swapMode === 'buy' ? 'ETH for VIE' : 'VIE for ETH'}`
            : swapState.status === 'preparing'
            ? 'Preparing...'
            : swapState.status === 'pending'
            ? 'Confirming...'
            : swapState.status === 'success'
            ? 'Success!'
            : 'Processing...'
          }
        </button>

        {/* Transaction Status */}
        {swapState.error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">
            Error: {swapState.error.message}
          </div>
        )}
      </div>

      {/* Send ETH Widget */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Send ETH</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Amount (ETH)
            </label>
            <input
              type="number"
              value={ethAmount}
              onChange={(e) => setEthAmount(e.target.value)}
              placeholder="0.0"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <button
            onClick={handleSendEth}
            disabled={
              !recipientAddress || 
              !ethAmount || 
              sendEthState.status !== 'idle'
            }
            className={`w-full py-2 rounded-lg ${
              sendEthState.status === 'idle' && recipientAddress && ethAmount
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {sendEthState.status === 'idle' 
              ? 'Send ETH'
              : sendEthState.status === 'success'
              ? 'Sent!'
              : 'Sending...'
            }
          </button>
        </div>
      </div>

      {/* Events Display */}
      {recentEvents.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Recent Transaction Events</h2>
          <div className="space-y-3">
            {recentEvents.map((event, index) => (
              <div key={index} className="bg-white p-3 rounded border">
                <div className="font-medium">{event.eventName}</div>
                <div className="text-sm text-gray-600">
                  Contract: {event.address.slice(0, 10)}...
                </div>
                {event.decodedArgs && (
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {JSON.stringify(event.decodedArgs, JSONStringifyBigIntHelper, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Transfer Events Table */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">
              Live VIE Token Transfers
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isWatching ? 'Polling every 2 seconds...' : 'Not watching'}
            </p>
          </div>
          <div className="flex gap-2">
            {typedTransferLogs.length > 0 && (
              <>
                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded">
                  {typedTransferLogs.length} transfers
                </span>
                <button
                  onClick={clearLogs}
                  className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Clear
                </button>
              </>
            )}
          </div>
        </div>
        
        {typedTransferLogs.length === 0 ? (
          <div className="bg-white rounded p-8 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Waiting for Transfer events...</p>
            <p className="text-sm mt-1">Transfers will appear here in real-time</p>
          </div>
        ) : (
          <div className="bg-white rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      From
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      To
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Block
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {typedTransferLogs.slice().reverse().map((log, index) => {
                    const args = log.args
                    const from = args?.from || '0x'
                    const to = args?.to || '0x'
                    const value = (args as { value: bigint }).value || 0n
                    const isUserInvolved = userAddress && 
                      (from.toLowerCase() === userAddress.toLowerCase() || 
                       to.toLowerCase() === userAddress.toLowerCase())
                    
                    return (
                      <tr key={index} className={`hover:bg-gray-50 ${isUserInvolved ? 'bg-yellow-50' : ''}`}>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {from.slice(0, 6)}...{from.slice(-4)}
                            </code>
                            {userAddress && from.toLowerCase() === userAddress.toLowerCase() && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">You</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {to.slice(0, 6)}...{to.slice(-4)}
                            </code>
                            {userAddress && to.toLowerCase() === userAddress.toLowerCase() && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">You</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium">
                          {formatUnits(value, 18)} VIE
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-500">
                          {log.blockNumber?.toString()}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {typedTransferLogs.length > 10 && (
              <div className="px-4 py-2 bg-gray-50 text-center text-xs text-gray-500">
                Showing latest {Math.min(typedTransferLogs.length, 10)} of {typedTransferLogs.length} transfers
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * SUMMARY FOR AI ASSISTANTS
 * 
 * This example demonstrates a complete lifecycle of blockchain interactions:
 * 
 * 1. Reading Data:
 *    - Use useReadContract with proper typing (TAbi, TName generics)
 *    - Pass the ABI directly, never do resolution in the hook
 *    - Handle null params when address is not connected
 * 
 * 2. Simulating Transactions:
 *    - Use useSimulateWriteContracts for getting quotes and checking validity
 *    - The simulate functions returns typed results based on the ABI
 *    - Always check callResults[0].status === 'success' before using the result
 * 
 * 3. Permit Signatures:
 *    - Use usePermitSignature for gasless token approvals
 *    - Generate permits before transactions that need approvals
 *    - Include permit parameters in the contract call
 * 
 * 4. Writing Contracts:
 *    - Use useWriteContractLifecycle for full transaction lifecycle
 *    - Provide custom toast messages for better UX
 *    - Handle all states: idle, preparing, pending, success, error
 * 
 * 5. Sending Native Tokens:
 *    - Use useSendNativeGasToken for ETH transfers
 *    - Same lifecycle pattern as contract writes
 *    - No ABI needed, just to address and value
 * 
 * 6. Event Parsing:
 *    - Use parseEventsFromTransaction after successful transactions
 *    - Events are automatically decoded using contract ABIs
 *    - Display decoded arguments for transparency
 * 
 * 7. Live Event Watching:
 *    - Use useWatchEvent for real-time event monitoring
 *    - Always uses polling for reliability
 *    - Conditional watching with the 'enabled' parameter
 *    - Accumulates logs in state with optional callbacks
 *    - Automatically refetch balances when user is involved in transfers
 * 
 * Key Patterns:
 * - Always get ABIs using getDeployedContract (highly preferred, given the contract is in deployments.ts) or getIndependentAbi
 * - Use proper TypeScript generics for compile-time safety
 * - Handle loading and error states in the UI
 * - Provide clear user feedback with toasts and status indicators
 * - Watch events to keep UI in sync with blockchain state
 * 
 * IMPORTANT: This list of hooks is NOT exhaustive. There are many more hooks in the codebase.
 */