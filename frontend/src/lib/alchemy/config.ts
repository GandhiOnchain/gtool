import { Alchemy, Network as AlchemyNetwork } from 'alchemy-sdk';
import { config } from '../../config';

/**
 * Alchemy SDK Configuration
 * 
 * Set up your Alchemy API key in env.json:
 * VITE_ALCHEMY_API_KEY=your_api_key_here
 * 
 * You can get an API key from: https://dashboard.alchemy.com/
 */

const alchemySettings = {
  apiKey: config.alchemy.apiKey || 'demo',
};

// Validate API key
if (!alchemySettings.apiKey) {
  console.warn(
    'Alchemy API key not found. Please set VITE_ALCHEMY_API_KEY in your environment variables in env.json.'
  );
}

// Create and export default Alchemy instance (ETH mainnet)
export const alchemy = new Alchemy({
  ...alchemySettings
});

// Export settings for reference
export { alchemySettings };

/**
 * Network details
 * @param name - The name of the network
 * @param nativeGasTokenSymbol - The symbol of the native gas token
 * @param nativeGasTokenName - The name of the native gas token
 */
export type NetworkDetails = {
  name: string;
  nativeGasTokenSymbol: string;
  nativeGasTokenName: string;
}

// Redefine here for the AI to reference easier!
export enum Network {
  // Ethereum family
  ETH_MAINNET = "eth-mainnet",

  // Optimism
  OPT_MAINNET = "opt-mainnet",

  // Arbitrum
  ARB_MAINNET = "arb-mainnet",
  ARBNOVA_MAINNET = "arbnova-mainnet",

  // Polygon
  MATIC_MAINNET = "polygon-mainnet",
  MATIC_MAINNET_OLD = "matic-mainnet",

  // Base
  BASE_MAINNET = "base-mainnet",
  BASE_SEPOLIA = "base-sepolia",
  
  // zkSync Era
  ZKSYNC_MAINNET = "zksync-mainnet",

  // Astar
  ASTAR_MAINNET = "astar-mainnet",

  // Linea
  LINEA_MAINNET = "linea-mainnet",

  // Fantom
  FANTOM_MAINNET = "fantom-mainnet",

  // ZetaChain
  ZETACHAIN_MAINNET = "zetachain-mainnet",

  // Blast
  BLAST_MAINNET = "blast-mainnet",

  // Mantle
  MANTLE_MAINNET = "mantle-mainnet",

  // Scroll
  SCROLL_MAINNET = "scroll-mainnet",

  // Gnosis (xDai)
  GNOSIS_MAINNET = "gnosis-mainnet",

  // BNB Chain
  BNB_MAINNET = "bnb-mainnet",

  // Avalanche
  AVAX_MAINNET = "avax-mainnet",

  // Celo
  CELO_MAINNET = "celo-mainnet",

  // Metis
  METIS_MAINNET = "metis-mainnet",

  // opBNB
  OPBNB_MAINNET = "opbnb-mainnet",

  // Berachain
  BERACHAIN_MAINNET = "berachain-mainnet",

  // Soneium
  SONEIUM_MAINNET = "soneium-mainnet",

  // World Chain
  WORLDCHAIN_MAINNET = "worldchain-mainnet",

  // Rootstock
  ROOTSTOCK_MAINNET = "rootstock-mainnet",

  // Zora
  ZORA_MAINNET = "zora-mainnet",

  // Frax (Fraxtal)
  FRAX_MAINNET = "frax-mainnet",

  // CrossFi (only testnet present in your list)
  CROSSFI_TESTNET = "crossfi-testnet",

  // ApeChain
  APECHAIN_MAINNET = "apechain-mainnet",

  // Lumia
  LUMIA_PRISM = "lumia-prism",

  // Unichain
  UNICHAIN_MAINNET = "unichain-mainnet",

  // Sonic
  SONIC_MAINNET = "sonic-mainnet",

  // Abstract
  ABSTRACT_MAINNET = "abstract-mainnet",

  // Ink
  INK_MAINNET = "ink-mainnet",

  // Sei
  SEI_MAINNET = "sei-mainnet",

  // Ronin
  RONIN_MAINNET = "ronin-mainnet",

  // Superseed
  SUPERSEED_MAINNET = "superseed-mainnet",

  // Tea (only Sepolia in your list)
  TEA_SEPOLIA = "tea-sepolia",

  // Story
  STORY_MAINNET = "story-mainnet",

  // Botanix
  BOTANIX_MAINNET = "botanix-mainnet",
  BOTANIX_TESTNET = "botanix-testnet",

  // Humanity
  HUMANITY_MAINNET = "humanity-mainnet",

  // Rise (testnet only)
  RISE_TESTNET = "rise-testnet",

  // Hyperliquid (app-chain id in your list)
  HYPERLIQUID_MAINNET = "hyperliquid-mainnet",

  SHAPE_MAINNET = "shape-mainnet",
}

export const CHAIN_ID_TO_NETWORK: Record<number, Network> = {
  // Ethereum
  1: Network.ETH_MAINNET,

  // Optimism
  10: Network.OPT_MAINNET,

  // Arbitrum
  42161: Network.ARB_MAINNET,
  42170: Network.ARBNOVA_MAINNET,

  // Polygon
  137: Network.MATIC_MAINNET,

  // Base
  8453: Network.BASE_MAINNET,
  84532: Network.BASE_SEPOLIA,

  // zkSync Era
  324: Network.ZKSYNC_MAINNET,

  // Astar
  592: Network.ASTAR_MAINNET,

  // Linea
  59144: Network.LINEA_MAINNET,

  // Fantom
  250: Network.FANTOM_MAINNET,

  // ZetaChain
  7000: Network.ZETACHAIN_MAINNET,

  // Blast
  81457: Network.BLAST_MAINNET,

  // Mantle
  5000: Network.MANTLE_MAINNET,

  // Scroll
  534352: Network.SCROLL_MAINNET,

  // Gnosis (xDai)
  100: Network.GNOSIS_MAINNET,

  // BNB Chain
  56: Network.BNB_MAINNET,

  // Avalanche
  43114: Network.AVAX_MAINNET,

  // Celo
  42220: Network.CELO_MAINNET,

  // Metis
  1088: Network.METIS_MAINNET,

  // opBNB
  204: Network.OPBNB_MAINNET,

  // Berachain
  80094: Network.BERACHAIN_MAINNET,

  // Soneium
  1868: Network.SONEIUM_MAINNET,

  // World Chain
  480: Network.WORLDCHAIN_MAINNET,

  // Rootstock
  30: Network.ROOTSTOCK_MAINNET,

  // Zora
  7777777: Network.ZORA_MAINNET,

  // Frax (Fraxtal)
  252: Network.FRAX_MAINNET,

  // CrossFi (your list only includes 4158)
  4158: Network.CROSSFI_TESTNET,

  // ApeChain
  33139: Network.APECHAIN_MAINNET,

  // Lumia
  994873017: Network.LUMIA_PRISM,

  // Unichain
  130: Network.UNICHAIN_MAINNET,

  // Sonic
  146: Network.SONIC_MAINNET,

  // Abstract
  2741: Network.ABSTRACT_MAINNET,

  // Ink
  57073: Network.INK_MAINNET,

  // Sei
  1329: Network.SEI_MAINNET,

  // Ronin
  2020: Network.RONIN_MAINNET,

  // Superseed
  5330: Network.SUPERSEED_MAINNET,

  // Tea (Sepolia)
  667: Network.TEA_SEPOLIA,

  // Story
  1514: Network.STORY_MAINNET,

  // Botanix
  3636: Network.BOTANIX_MAINNET,
  3637: Network.BOTANIX_TESTNET,

  // Humanity
  332: Network.HUMANITY_MAINNET,

  // Rise
  202020: Network.RISE_TESTNET,

  // Hyperliquid
  999: Network.HYPERLIQUID_MAINNET,

  // Shape
  360: Network.SHAPE_MAINNET,
} as const;

const NETWORK_DETAILS: Record<Network, NetworkDetails> = {
  // Ethereum
  [Network.ETH_MAINNET]: {
    name: "Ethereum",
    nativeGasTokenSymbol: "ETH",
    nativeGasTokenName: "Ether",
  },

  // Optimism
  [Network.OPT_MAINNET]: {
    name: "Optimism",
    nativeGasTokenSymbol: "ETH",
    nativeGasTokenName: "Ether",
  },

  // Arbitrum
  [Network.ARB_MAINNET]: {
    name: "Arbitrum One",
    nativeGasTokenSymbol: "ETH",
    nativeGasTokenName: "Ether",
  },
  [Network.ARBNOVA_MAINNET]: {
    name: "Arbitrum Nova",
    nativeGasTokenSymbol: "ETH",
    nativeGasTokenName: "Ether",
  },

  // Polygon
  [Network.MATIC_MAINNET]: {
    name: "Polygon",
    nativeGasTokenSymbol: "POL",
    nativeGasTokenName: "Pol",
  },
  [Network.MATIC_MAINNET_OLD]: {
    name: "Polygon",
    nativeGasTokenSymbol: "POL",
    nativeGasTokenName: "Pol",
  },

  // Base
  [Network.BASE_MAINNET]: {
    name: "Base",
    nativeGasTokenSymbol: "ETH",
    nativeGasTokenName: "Ether",
  },
  [Network.BASE_SEPOLIA]: {
    name: "Base Sepolia",
    nativeGasTokenSymbol: "ETH",
    nativeGasTokenName: "Ether",
  },

  // zkSync Era
  [Network.ZKSYNC_MAINNET]: {
    name: "zkSync Era",
    nativeGasTokenSymbol: "ETH",
    nativeGasTokenName: "Ether",
  },

  // Astar
  [Network.ASTAR_MAINNET]: {
    name: "Astar",
    nativeGasTokenSymbol: "ASTR",
    nativeGasTokenName: "Astar",
  },

  // Linea
  [Network.LINEA_MAINNET]: {
    name: "Linea",
    nativeGasTokenSymbol: "ETH",
    nativeGasTokenName: "Ether",
  },

  // Fantom
  [Network.FANTOM_MAINNET]: {
    name: "Fantom",
    nativeGasTokenSymbol: "FTM",
    nativeGasTokenName: "Fantom",
  },

  // ZetaChain
  [Network.ZETACHAIN_MAINNET]: {
    name: "ZetaChain",
    nativeGasTokenSymbol: "ZETA",
    nativeGasTokenName: "Zeta",
  },

  // Blast
  [Network.BLAST_MAINNET]: {
    name: "Blast",
    nativeGasTokenSymbol: "ETH",
    nativeGasTokenName: "Ether",
  },

  // Mantle
  [Network.MANTLE_MAINNET]: {
    name: "Mantle",
    nativeGasTokenSymbol: "MNT",
    nativeGasTokenName: "Mantle",
  },

  // Scroll
  [Network.SCROLL_MAINNET]: {
    name: "Scroll",
    nativeGasTokenSymbol: "ETH",
    nativeGasTokenName: "Ether",
  },

  // Gnosis (xDai)
  [Network.GNOSIS_MAINNET]: {
    name: "Gnosis",
    nativeGasTokenSymbol: "xDAI",
    nativeGasTokenName: "xDai",
  },

  // BNB Chain
  [Network.BNB_MAINNET]: {
    name: "BNB Smart Chain",
    nativeGasTokenSymbol: "BNB",
    nativeGasTokenName: "BNB",
  },

  // Avalanche
  [Network.AVAX_MAINNET]: {
    name: "Avalanche C-Chain",
    nativeGasTokenSymbol: "AVAX",
    nativeGasTokenName: "Avalanche",
  },

  // Celo
  [Network.CELO_MAINNET]: {
    name: "Celo",
    nativeGasTokenSymbol: "CELO",
    nativeGasTokenName: "Celo",
  },

  // Metis
  [Network.METIS_MAINNET]: {
    name: "Metis",
    nativeGasTokenSymbol: "METIS",
    nativeGasTokenName: "Metis",
  },

  // opBNB
  [Network.OPBNB_MAINNET]: {
    name: "opBNB",
    nativeGasTokenSymbol: "BNB",
    nativeGasTokenName: "BNB",
  },

  // Berachain
  [Network.BERACHAIN_MAINNET]: {
    name: "Berachain",
    nativeGasTokenSymbol: "BERA",
    nativeGasTokenName: "Berachain",
  },

  // Soneium
  [Network.SONEIUM_MAINNET]: {
    name: "Soneium",
    nativeGasTokenSymbol: "ETH",
    nativeGasTokenName: "Ether",
  },

  // World Chain
  [Network.WORLDCHAIN_MAINNET]: {
    name: "World Chain",
    nativeGasTokenSymbol: "ETH",
    nativeGasTokenName: "Ether",
  },

  // Rootstock
  [Network.ROOTSTOCK_MAINNET]: {
    name: "Rootstock",
    nativeGasTokenSymbol: "RBTC",
    nativeGasTokenName: "Rootstock Bitcoin",
  },

  // Zora
  [Network.ZORA_MAINNET]: {
    name: "Zora",
    nativeGasTokenSymbol: "ETH",
    nativeGasTokenName: "Ether",
  },

  // Frax (Fraxtal)
  [Network.FRAX_MAINNET]: {
    name: "Fraxtal",
    nativeGasTokenSymbol: "FRAX",
    nativeGasTokenName: "Frax",
  },

  // CrossFi Testnet
  [Network.CROSSFI_TESTNET]: {
    name: "CrossFi Testnet",
    nativeGasTokenSymbol: "XFI",
    nativeGasTokenName: "CrossFi",
  },

  // ApeChain
  [Network.APECHAIN_MAINNET]: {
    name: "ApeChain",
    nativeGasTokenSymbol: "APE",
    nativeGasTokenName: "ApeCoin",
  },

  // Lumia
  [Network.LUMIA_PRISM]: {
    name: "Lumia Prism",
    nativeGasTokenSymbol: "LUMIA",
    nativeGasTokenName: "Lumia",
  },

  // Unichain
  [Network.UNICHAIN_MAINNET]: {
    name: "Unichain",
    nativeGasTokenSymbol: "ETH",
    nativeGasTokenName: "Ether",
  },

  // Sonic
  [Network.SONIC_MAINNET]: {
    name: "Sonic",
    nativeGasTokenSymbol: "S",
    nativeGasTokenName: "Sonic",
  },

  // Abstract
  [Network.ABSTRACT_MAINNET]: {
    name: "Abstract",
    nativeGasTokenSymbol: "ETH",
    nativeGasTokenName: "Ether",
  },

  // Ink
  [Network.INK_MAINNET]: {
    name: "Ink",
    nativeGasTokenSymbol: "ETH",
    nativeGasTokenName: "Ether",
  },

  // Sei
  [Network.SEI_MAINNET]: {
    name: "Sei",
    nativeGasTokenSymbol: "SEI",
    nativeGasTokenName: "Sei",
  },

  // Ronin
  [Network.RONIN_MAINNET]: {
    name: "Ronin",
    nativeGasTokenSymbol: "RON",
    nativeGasTokenName: "Ronin",
  },

  // Superseed
  [Network.SUPERSEED_MAINNET]: {
    name: "Superseed",
    nativeGasTokenSymbol: "ETH",
    nativeGasTokenName: "Ether",
  },

  // Tea Sepolia
  [Network.TEA_SEPOLIA]: {
    name: "Tea Sepolia",
    nativeGasTokenSymbol: "TEA",
    nativeGasTokenName: "Tea",
  },

  // Story
  [Network.STORY_MAINNET]: {
    name: "Story",
    nativeGasTokenSymbol: "IP",
    nativeGasTokenName: "IP",
  },

  // Botanix
  [Network.BOTANIX_MAINNET]: {
    name: "Botanix",
    nativeGasTokenSymbol: "BTC",
    nativeGasTokenName: "Bitcoin",
  },
  [Network.BOTANIX_TESTNET]: {
    name: "Botanix Testnet",
    nativeGasTokenSymbol: "BTC",
    nativeGasTokenName: "Bitcoin",
  },

  // Humanity
  [Network.HUMANITY_MAINNET]: {
    name: "Humanity Protocol",
    nativeGasTokenSymbol: "H",
    nativeGasTokenName: "Humanity",
  },

  // Rise Testnet
  [Network.RISE_TESTNET]: {
    name: "RISE Testnet",
    nativeGasTokenSymbol: "ETH",
    nativeGasTokenName: "Ether",
  },

  // Hyperliquid
  [Network.HYPERLIQUID_MAINNET]: {
    name: "Hyperliquid",
    nativeGasTokenSymbol: "HYPE",
    nativeGasTokenName: "Hype",
  },

  // Shape
  [Network.SHAPE_MAINNET]: {
    name: "Shape",
    nativeGasTokenSymbol: "ETH",
    nativeGasTokenName: "Ether",
  },
};

/**
 * Convert chainId to Alchemy Network enum
 * @param chainId - The chain ID to convert
 * @returns Alchemy Network enum
 * @throws Error if chainId is not supported
 */
export function getAlchemyNetwork(chainId: number): Network {
  const network = CHAIN_ID_TO_NETWORK[chainId];
  if (!network) {
    throw new Error(`Unsupported chainId: ${chainId}. Supported chains: ${Object.keys(CHAIN_ID_TO_NETWORK).join(', ')}`);
  }
  return network;
}

/**
 * Get network details by Alchemy network
 * @param network - The Alchemy network to get details for
 * @returns Network details (name, native gas token symbol, native gas token name)
 */
export function getNetworkDetails(network: Network): NetworkDetails {
  return NETWORK_DETAILS[network];
}

/**
 * Create a new Alchemy instance with custom settings
 * @param apiKey - Your Alchemy API key
 * @param network - The network to connect to
 * @returns New Alchemy instance
 */
export function createAlchemyInstance(apiKey: string, network: Network): Alchemy {
  if (network === Network.MATIC_MAINNET_OLD) {
    network = Network.MATIC_MAINNET;
  }
  return new Alchemy({
    apiKey,
    network: network as unknown as AlchemyNetwork,
  });
}
