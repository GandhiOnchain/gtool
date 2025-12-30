import env from './env.json'

const getEnv = (key: string, required: boolean = true) => {
    const value = env[key as keyof typeof env];
    if (required && !value) {
      console.warn(`Environment variable ${key} is not set in env.json`);
    }
    return value;
};

const customAlchemyApiKeyMissing = "<optional: fill in with your own key for higher rate limits. otherwise Alchemy will work, using our key already present in the environment>";
const environmentAlchemyApiKey = (import.meta as any).env.VITE_ALCHEMY_API_KEY || "";
const customAlchemyApiKey = getEnv('VITE_ALCHEMY_API_KEY');
const alchemyApiKey = customAlchemyApiKey === customAlchemyApiKeyMissing ? environmentAlchemyApiKey : customAlchemyApiKey;

export const config = {
  privy: {
    appId: getEnv('VITE_PRIVY_APP_ID', false),
    clientId: getEnv('VITE_PRIVY_CLIENT_ID', false),
  },
  alchemy: {
    apiKey: alchemyApiKey,
  },
  networks: {
    // Base
    8453: {
      chainId: 8453,
      name: 'Base',
      slug: 'base',
      alchemySlug: 'base-mainnet',
      rpcUrl: alchemyApiKey ? `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : "https://mainnet.base.org",
      simulateV1RpcSupportedRpcUrl: alchemyApiKey ? `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : undefined, // fill this in, if you have an rpc that supports eth_simulateV1 rpc method
      explorerUrl: 'https://basescan.org',
    },

    // Base Sepolia
    84532: {
      chainId: 84532,
      name: 'Base Sepolia',
      slug: 'base-sepolia',
      alchemySlug: 'base-sepolia',
      rpcUrl: alchemyApiKey ? `https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}` : "https://sepolia.base.org",
      simulateV1RpcSupportedRpcUrl: alchemyApiKey ? `https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}` : undefined, // fill this in, if you have an rpc that supports eth_simulateV1 rpc method
      explorerUrl: 'https://sepolia.basescan.org',
    },

    // Ethereum
    1: {
      chainId: 1,
      name: 'Ethereum',
      slug: 'ethereum',
      alchemySlug: 'eth-mainnet',
      rpcUrl: alchemyApiKey ? `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : "https://eth.merkle.io",
      simulateV1RpcSupportedRpcUrl: alchemyApiKey ? `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : undefined, // fill this in, if you have an rpc that supports eth_simulateV1 rpc method
      explorerUrl: 'https://etherscan.io',
    },

    // BNB Smart Chain
    56: {
      chainId: 56,
      name: 'BNB Smart Chain',
      slug: 'bnb',
      alchemySlug: 'bnb-mainnet',
      rpcUrl: alchemyApiKey ? `https://bnb-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : "https://bsc-dataseed1.binance.org",
      simulateV1RpcSupportedRpcUrl: alchemyApiKey ? `https://bnb-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : undefined, // fill this in, if you have an rpc that supports eth_simulateV1 rpc method
      explorerUrl: 'https://bscscan.com',
    },

    // Arbitrum
    42161: {
      chainId: 42161,
      name: 'Arbitrum',
      slug: 'arbitrum',
      alchemySlug: 'arb-mainnet',
      rpcUrl: alchemyApiKey ? `https://arb-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : "https://arb1.arbitrum.io/rpc",
      simulateV1RpcSupportedRpcUrl: alchemyApiKey ? `https://arb-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : undefined, // fill this in, if you have an rpc that supports eth_simulateV1 rpc method
      explorerUrl: 'https://arbiscan.io',
    },

    // Berachain
    80094: {
      chainId: 80094,
      name: 'Berachain',
      slug: 'berachain',
      alchemySlug: 'berachain-mainnet',
      rpcUrl: alchemyApiKey ? `https://berachain-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : "https://rpc.berachain.com",
      simulateV1RpcSupportedRpcUrl: alchemyApiKey ? `https://berachain-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : undefined, // fill this in, if you have an rpc that supports eth_simulateV1 rpc method
      explorerUrl: 'https://berascan.com',
    },

    // Avalanche
    43114: {
      chainId: 43114,
      name: 'Avalanche',
      slug: 'avalanche',
      alchemySlug: 'avax-mainnet',
      rpcUrl: alchemyApiKey ? `https://avax-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : "https://api.avax.network/ext/bc/C/rpc",
      simulateV1RpcSupportedRpcUrl: alchemyApiKey ? `https://avax-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : undefined, // fill this in, if you have an rpc that supports eth_simulateV1 rpc method
      explorerUrl: 'https://snowtrace.io',
    },

    // Hyperliquid
    999: {
      chainId: 999,
      name: 'Hyperliquid',
      slug: 'hyperliquid',
      alchemySlug: 'hyperliquid-mainnet',
      rpcUrl: alchemyApiKey ? `https://hyperliquid-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : "https://rpc.hyperliquid.xyz/evm",
      simulateV1RpcSupportedRpcUrl: alchemyApiKey ? `https://hyperliquid-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : undefined, // fill this in, if you have an rpc that supports eth_simulateV1 rpc method
      explorerUrl: 'https://liquidscan.io',
    },

    // Polygon
    137: {
      chainId: 137,
      name: 'Polygon',
      slug: 'polygon',
      alchemySlug: 'polygon-mainnet',
      rpcUrl: alchemyApiKey ? `https://polygon-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : "https://polygon-rpc.com",
      simulateV1RpcSupportedRpcUrl: alchemyApiKey ? `https://polygon-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : undefined, // fill this in, if you have an rpc that supports eth_simulateV1 rpc method
      explorerUrl: 'https://polygonscan.com',
    },

    // Optimism
    10: {
      chainId: 10,
      name: 'Optimism',
      slug: 'optimism',
      alchemySlug: 'opt-mainnet',
      rpcUrl: alchemyApiKey ? `https://opt-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : "https://mainnet.optimism.io",
      simulateV1RpcSupportedRpcUrl: alchemyApiKey ? `https://opt-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : undefined, // fill this in, if you have an rpc that supports eth_simulateV1 rpc method
      explorerUrl: 'https://explorer.optimism.io',
    },

    // Linea
    59144: {
      chainId: 59144,
      name: 'Linea',
      slug: 'linea',
      alchemySlug: 'linea-mainnet',
      rpcUrl: alchemyApiKey ? `https://linea-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : "https://rpc.linea.build",
      simulateV1RpcSupportedRpcUrl: alchemyApiKey ? `https://linea-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : undefined, // fill this in, if you have an rpc that supports eth_simulateV1 rpc method
      explorerUrl: 'https://lineascan.build',
    },

    // Scroll
    534352: {
      chainId: 534352,
      name: 'Scroll',
      slug: 'scroll',
      alchemySlug: 'scroll-mainnet',
      rpcUrl: alchemyApiKey ? `https://scroll-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : "https://rpc.scroll.io",
      simulateV1RpcSupportedRpcUrl: alchemyApiKey ? `https://scroll-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : undefined, // fill this in, if you have an rpc that supports eth_simulateV1 rpc method
      explorerUrl: 'https://scroll.blockscout.com',
    },

    // Mantle
    5000: {
      chainId: 5000,
      name: 'Mantle',
      slug: 'mantle',
      alchemySlug: 'mantle-mainnet',
      rpcUrl: alchemyApiKey ? `https://mantle-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : "https://rpc.mantle.xyz",
      simulateV1RpcSupportedRpcUrl: alchemyApiKey ? `https://mantle-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : undefined, // fill this in, if you have an rpc that supports eth_simulateV1 rpc method
      explorerUrl: 'https://mantlescan.xyz',
    },

    // Unichain
    130: {
      chainId: 130,
      name: 'Unichain',
      slug: 'unichain',
      alchemySlug: 'unichain-mainnet',
      rpcUrl: alchemyApiKey ? `https://unichain-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : "https://rpc.unichain.org",
      simulateV1RpcSupportedRpcUrl: alchemyApiKey ? `https://unichain-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : undefined, // fill this in, if you have an rpc that supports eth_simulateV1 rpc method
      explorerUrl: 'https://unichain.blockscout.com',
    },

    // Shape
    360: {
      chainId: 360,
      name: 'Shape',
      slug: 'shape',
      alchemySlug: 'shape-mainnet',
      rpcUrl: alchemyApiKey ? `https://shape-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : "https://mainnet.shape.network",
      simulateV1RpcSupportedRpcUrl: alchemyApiKey ? `https://shape-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : undefined, // fill this in, if you have an rpc that supports eth_simulateV1 rpc method
      explorerUrl: 'https://shapescan.xyz',
    },

    // Plume
    98866: {
      chainId: 98866,
      name: 'Plume',
      slug: 'plume',
      rpcUrl: "https://rpc.plume.org",
      simulateV1RpcSupportedRpcUrl: undefined, // fill this in, if you have an rpc that supports eth_simulateV1 rpc method
      explorerUrl: 'https://explorer.plume.org',
    },
  },
};
  