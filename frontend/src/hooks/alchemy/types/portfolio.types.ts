import { Network } from '../../../lib/alchemy/config';
import { TokenPrice } from './price.types';

// Token metadata response
export interface TokenMetadataResponse {
  /** The token's name. Is null if not defined. */
  name: string | null;
  /** The token's symbol. Is null if not defined. */
  symbol: string | null;
  /** The number of decimals of the token. Is null if not defined. */
  decimals: number | null;
  /** URL link to the token's logo. Is null if not available. */
  logo: string | null;
}

// Portfolio address for multi-chain queries
export interface PortfolioAddress {
  /** Array of network identifiers (e.g., eth-mainnet). */
  networks: Network[];
  /** Wallet address. */
  address: string;
}

// Response for tokens by wallet
export interface GetTokensByWalletResponse {
  data: {
    tokens: Array<{
      /** The token contract address. If undefined or null, the token is a native token! */
      tokenAddress?: string | null;
      /** The blockchain network where the token is located. */
      network: Network;
      /** The wallet address for which the token data applies. */
      address: string;
      /** The quantity of the token held, represented as a raw string (e.g., in wei). */
      tokenBalance: string;
      /** Optional metadata about the token. */
      tokenMetadata?: TokenMetadataResponse;
      /** Optional pricing data for the token. */
      tokenPrices?: TokenPrice[];
    }>;
    /** A string used for pagination to retrieve additional results if available. */
    pageKey: string;
  };
}

// Response for token balances by wallet (simplified)
export interface GetTokenBalancesByWalletResponse {
  data: {
    tokens: Array<{
      /** The network where the token resides. */
      network: Network;
      /** The wallet address associated with the token balance. */
      address: string;
      /** The contract address of the token. If undefined or null, the token is a native token! */
      tokenAddress?: string | null;
      /** The balance of the token, represented as a raw string value. */
      tokenBalance: string;
    }>;
    /** A string used for pagination. */
    pageKey: string;
  };
}