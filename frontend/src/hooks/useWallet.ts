import { useAccount, useConnect, type UseConnectReturnType, useDisconnect, type Connector } from 'wagmi'
import { usePrivy } from '@privy-io/react-auth'
import { config } from '../config'

/**
 * Unified wallet state interface that abstracts over different wallet providers
 * @interface WalletState
 */
interface WalletState {
  /** 
   * The connected wallet's Ethereum address
   * undefined when no wallet is connected
   * @example '0x742d35Cc6634C0532925a3b844Bc9e7595f5e8e8'
   */
  address: string | undefined
  
  /** 
   * Whether a wallet is currently connected
   * true when address is available and connection is active
   */
  isConnected: boolean
  
  /** 
   * Function to initiate wallet connection
   * Behavior depends on the provider (Privy login or Wagmi connector)
   * @returns void - Connection happens asynchronously
   */
  connect: () => void
  
  /** 
   * Function to disconnect the current wallet
   * Clears the connection and resets wallet state
   * @returns void
   */
  disconnect: () => void
  
  /** 
   * Available wallet connectors (only for standard Wagmi mode)
   * undefined in Privy mode
   * @example [MetaMaskConnector, WalletConnectConnector, ...]
   */
  connectors?: readonly any[]
}

/**
 * Unified wallet hook that works with both Privy and standard Wagmi
 * Automatically chooses the right provider based on configuration
 * 
 * @returns {WalletState} Unified wallet state and methods
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { address, isConnected, connect, disconnect } = useWallet();
 *   
 *   if (!isConnected) {
 *     return <button onClick={connect}>Connect Wallet</button>;
 *   }
 *   
 *   return (
 *     <div>
 *       <p>Connected: {address}</p>
 *       <button onClick={disconnect}>Disconnect</button>
 *     </div>
 *   );
 * }
 * ```
 * 
 * @dev
 * - Detects Privy mode by checking if config.privy.appId is set
 * - In Privy mode: Uses Privy's authentication flow (social login + embedded wallets)
 * - In Wagmi mode: Uses standard wallet connectors (MetaMask, WalletConnect, etc.)
 * - Provides consistent interface regardless of underlying provider
 * - For Wagmi mode, automatically connects with the first available connector
 */
export const useWallet = (): WalletState => {
  const isPrivyMode = !!config.privy.appId

  // Privy hooks
  const privyResult = usePrivy()
  
  // Standard Wagmi hooks  
  const wagmiAccount = useAccount()
  const wagmiConnect = useConnect()
  const wagmiDisconnect = useDisconnect()

  if (isPrivyMode) {
    // Use Privy
    return {
      address: privyResult.user?.wallet?.address,
      isConnected: !!privyResult.user?.wallet?.address,
      connect: privyResult.login,
      disconnect: privyResult.logout,
    }
  } else {
    // Use standard Wagmi
    return {
      address: wagmiAccount.address,
      isConnected: wagmiAccount.isConnected,
      connect: () => {
        // Connect with first available connector
        if (wagmiConnect.connectors?.length) {
          connectStandardWagmiWithFallback(wagmiConnect)
        }
      },
      disconnect: () => wagmiDisconnect.disconnect(),
      connectors: wagmiConnect.connectors,
    }
  }
} 

const connectStandardWagmiWithFallback = async (wagmiConnect: UseConnectReturnType) => {
  const preferredConnectors = ['injected', 'io.metamask', 'com.coinbase.wallet', 'me.rainbow', 'app.phantom']
  
  const connectors = [...wagmiConnect.connectors];
  
  // Reorder to put preferred connectors first
  connectors.sort((a, b) => {
    const aIndex = preferredConnectors.indexOf(a.id);
    const bIndex = preferredConnectors.indexOf(b.id);
    
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  const tryConnect = async (connector: Connector, i: number) => {
    try {
      wagmiConnect.connect({ connector });
      return
    } catch (error) {
      console.warn(`❌ Attempt ${i + 1} failed:`, (error as Error).message);
      if ((error as Error).message?.includes('User rejected') || 
          (error as Error).name === 'UserRejectedRequestError') {
        throw error;
      }
      if (i === connectors.length - 1) {
        throw new Error(`All ${connectors.length} connection attempts failed`);
      }

      await new Promise(resolve => setTimeout(resolve, 100));
      tryConnect(connector, i + 1);
    }
  }
  
  if (connectors.length) {
    await tryConnect(connectors[0], 0);
  }
}