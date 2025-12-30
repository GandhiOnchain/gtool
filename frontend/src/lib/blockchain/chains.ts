import { defineChain } from 'viem'
import { config } from '../../config'

// Define chains based on config
export const base = defineChain({
  id: 8453,
  name: 'Base',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [config.networks[8453].rpcUrl] },
  },
  blockExplorers: {
    default: { 
      name: 'BaseScan', 
      url: config.networks[8453].explorerUrl,
      apiUrl: 'https://api.basescan.org/api'
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 5022,
    },
  },
})

export const baseSepolia = defineChain({
  id: 84532,
  name: 'Base Sepolia',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [config.networks[84532].rpcUrl] }
  },
  blockExplorers: {
    default: { 
      name: 'BaseScan', 
      url: config.networks[84532].explorerUrl,
      apiUrl: 'https://api-sepolia.basescan.org/api'
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 1059647,
    },
  },
})

export const ethereum = defineChain({
  id: 1,
  name: 'Ethereum',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  blockTime: 12_000,
  rpcUrls: {
    default: {
      http: [config.networks[1].rpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: config.networks[1].explorerUrl,
      apiUrl: 'https://api.etherscan.io/api',
    },
  },
  contracts: {
    ensUniversalResolver: {
      address: '0xeeeeeeee14d718c2b47d9923deab1335e144eeee',
      blockCreated: 23_085_558,
    },
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 14_353_601,
    },
  },
})

// BNB Smart Chain
export const bsc = defineChain({
  id: 56,
  name: 'BNB Smart Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: { http: [config.networks[56].rpcUrl] },
  },
  blockExplorers: {
    default: {
      name: 'BscScan',
      url: config.networks[56].explorerUrl,
      apiUrl: 'https://api.bscscan.com/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 15921452,
    },
  },
})

// Arbitrum One
export const arbitrum = defineChain({
  id: 42161,
  name: 'Arbitrum One',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [config.networks[42161].rpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: 'Arbiscan',
      url: config.networks[42161].explorerUrl,
      apiUrl: 'https://api.arbiscan.io/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 7654707,
    },
  },
})

// Berachain (testnet)
export const berachain = defineChain({
  id: 80094,
  name: 'Berachain',
  nativeCurrency: {
    decimals: 18,
    name: 'BERA Token',
    symbol: 'BERA',
  },
  rpcUrls: {
    default: {
      http: [config.networks[80094].rpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: 'Berascan',
      url: config.networks[80094].explorerUrl,
    },
  },
  testnet: true,
})

// Avalanche
export const avalanche = defineChain({
  id: 43114,
  name: 'Avalanche',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  rpcUrls: {
    default: {
      http: [config.networks[43114].rpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: 'SnowTrace',
      url: config.networks[43114].explorerUrl,
      apiUrl: 'https://api.snowtrace.io/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 11907934,
    },
  },
})

// Hyperliquid
export const hyperliquid = defineChain({
  id: 999,
  name: 'Hyperliquid',
  nativeCurrency: {
    decimals: 18,
    name: 'HYPE',
    symbol: 'HYPE',
  },
  rpcUrls: {
    default: {
      http: [config.networks[999].rpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: 'Liquidscan',
      url: config.networks[999].explorerUrl,
    },
  },
})

// Polygon
export const polygon = defineChain({
  id: 137,
  name: 'Polygon',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: {
      http: [config.networks[137].rpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: 'PolygonScan',
      url: config.networks[137].explorerUrl,
      apiUrl: 'https://api.polygonscan.com/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 25770160,
    },
  },
})

// Optimism
export const optimism = defineChain({
  id: 10,
  name: 'OP Mainnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [config.networks[10].rpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: 'Optimism Explorer',
      url: config.networks[10].explorerUrl,
      apiUrl: 'https://api-optimistic.etherscan.io/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 4286263,
    },
  },
})

// Linea
export const linea = defineChain({
  id: 59144,
  name: 'Linea',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [config.networks[59144].rpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: 'Linea Explorer',
      url: config.networks[59144].explorerUrl,
      apiUrl: 'https://api.lineascan.build/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 42,
    },
  },
})

// Scroll
export const scroll = defineChain({
  id: 534352,
  name: 'Scroll',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [config.networks[534352].rpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: 'Scroll Explorer',
      url: config.networks[534352].explorerUrl,
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 14,
    },
  },
})

// Mantle
export const mantle = defineChain({
  id: 5000,
  name: 'Mantle',
  nativeCurrency: {
    decimals: 18,
    name: 'Mantle',
    symbol: 'MNT',
  },
  rpcUrls: {
    default: {
      http: [config.networks[5000].rpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: 'Mantle Explorer',
      url: config.networks[5000].explorerUrl,
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 304717,
    },
  },
})

// Unichain
export const unichain = defineChain({
  id: 130,
  name: 'Unichain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [config.networks[130].rpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: 'Unichain Explorer',
      url: config.networks[130].explorerUrl,
    },
  },
  testnet: true,
})

// Shape
export const shape = defineChain({
  id: 360,
  name: 'Shape',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [config.networks[360].rpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: 'Shape Explorer',
      url: config.networks[360].explorerUrl,
    },
  },
})

// Plume
export const plume = defineChain({
  id: 98866,
  name: 'Plume',
  nativeCurrency: { name: 'Plume', symbol: 'PLUME', decimals: 18 },
  rpcUrls: {
    default: { http: [config.networks[98866].rpcUrl] },
  },
  blockExplorers: {
    default: {
      name: 'Plume Explorer',
      url: config.networks[98866].explorerUrl,
    },
  },
})

// Export chains array and lookup
export const supportedChains = [
  base, 
  baseSepolia, 
  ethereum, 
  bsc, 
  arbitrum, 
  berachain, 
  avalanche, 
  hyperliquid, 
  polygon, 
  optimism, 
  linea, 
  scroll, 
  mantle, 
  unichain, 
  shape,
  plume
] as const
export const defaultChain = baseSepolia

// Chain lookup by ID
export const chainById = {
  [base.id]: base,
  [baseSepolia.id]: baseSepolia,
  [ethereum.id]: ethereum,
  [bsc.id]: bsc,
  [arbitrum.id]: arbitrum,
  [berachain.id]: berachain,
  [avalanche.id]: avalanche,
  [hyperliquid.id]: hyperliquid,
  [polygon.id]: polygon,
  [optimism.id]: optimism,
  [linea.id]: linea,
  [scroll.id]: scroll,
  [mantle.id]: mantle,
  [unichain.id]: unichain,
  [shape.id]: shape,
  [plume.id]: plume,
} as const

export type SupportedChainId = keyof typeof chainById

// Helper to get chain config
export function getChainById(chainId: number) {
  return chainById[chainId as SupportedChainId]
}

// Helper to get RPC URL for a chain
export function getRpcUrl(chainId: number): string {
  const networkConfig = config.networks[chainId as keyof typeof config.networks]
  if (!networkConfig) {
    throw new Error(`Unsupported chain ID: ${chainId}`)
  }
  return networkConfig.rpcUrl
}

// Helper to get simulation RPC URL for a chain
export function getSimulationRpcUrl(chainId: number): string {
  const networkConfig = config.networks[chainId as keyof typeof config.networks]
  if (!networkConfig) {
    throw new Error(`Unsupported chain ID: ${chainId}`)
  }
  return networkConfig.simulateV1RpcSupportedRpcUrl || networkConfig.rpcUrl
}

// Helper to get explorer URL
export function getExplorerUrl(chainId: number): string {
  const networkConfig = config.networks[chainId as keyof typeof config.networks]
  if (!networkConfig) {
    throw new Error(`Unsupported chain ID: ${chainId}`)
  }
  return networkConfig.explorerUrl
} 