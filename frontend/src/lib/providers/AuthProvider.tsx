import React from 'react'
import { PrivyProvider } from '@privy-io/react-auth'
import { WagmiProvider as PrivyWagmiProvider } from '@privy-io/wagmi'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from '../blockchain/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '../../config'
import { JSONStringifyBigIntHelper } from '../blockchain/bigint'

// Create a single query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'status' in error && 
            typeof error.status === 'number' && error.status >= 400 && error.status < 500) {
          return false
        }
        return failureCount < 3
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      queryKeyHashFn: (key) => {
        return JSON.stringify(key, JSONStringifyBigIntHelper)
      },
    },
  },
})

export interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // If Privy is not configured, use standard Wagmi with InjectedConnector
  if (!config.privy.appId) {
    return (
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={wagmiConfig}>
            {children}
          </WagmiProvider>
        </QueryClientProvider>
      </React.StrictMode>
    )
  }

  // Otherwise use Privy + Wagmi
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <PrivyProvider appId={config.privy.appId!} clientId={config.privy.clientId!}>
          <PrivyWagmiProvider config={wagmiConfig}>
            {children}
          </PrivyWagmiProvider>
        </PrivyProvider>
      </QueryClientProvider>
    </React.StrictMode>
  )
}

// Export query client for use in other parts of the app
export { queryClient } 