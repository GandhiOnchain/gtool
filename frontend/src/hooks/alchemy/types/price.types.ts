import { Network } from '../../../lib/alchemy/config';

// ===== TYPE DEFINITIONS FROM ALCHEMY SDK =====
// These types are extracted from the alchemy-sdk package for easier reference by AI assistants

// Request types for token prices
export interface TokenAddressRequest {
  /** The network to get prices for. */
  network: Network;
  /** The contract address to get prices for. */
  address: string;
}

// Token price information
export interface TokenPrice {
  /** The currency the price is denominated in (e.g. 'usd'). */
  currency: string;
  /** The price value as a string to preserve precision. */
  value: string;
  /** ISO timestamp of when the price was last updated. */
  lastUpdatedAt: string;
}

// Token price error information
export interface TokenPriceError {
  /** The error message describing why the request failed. */
  message: string;
}

// Result for token price by address
export interface TokenPriceByAddressResult {
  /** The network the token is on. */
  network: Network;
  /** The token's contract address. */
  address: string;
  /** Array of price data for the token. Empty if there was an error. */
  prices: TokenPrice[];
  /** Error information if the request failed, null otherwise. */
  error: TokenPriceError | null;
}

// Result for token price by symbol
export interface TokenPriceBySymbolResult {
  /** The token symbol that was queried. */
  symbol: string;
  /** Array of price data for the token. Empty if there was an error. */
  prices: TokenPrice[];
  /** Error information if the request failed, null otherwise. */
  error: TokenPriceError | null;
}

// Response types for token prices
export interface GetTokenPriceByAddressResponse {
  /** The token price data for each requested address. */
  data: TokenPriceByAddressResult[];
}

export interface GetTokenPriceBySymbolResponse {
  /** The token price data for each requested symbol. */
  data: TokenPriceBySymbolResult[];
}

// Historical price data point
export interface HistoricalPriceDataPoint {
  /** Price value as a string to preserve precision */
  value: string;
  /** ISO timestamp for the price data point */
  timestamp: string;
}

// Historical price intervals
export enum HistoricalPriceInterval {
  /** 5-minute intervals */
  FIVE_MINUTE = "5m",
  /** 1-hour intervals */
  ONE_HOUR = "1h",
  /** 1-day intervals */
  ONE_DAY = "1d"
}

// Historical price responses
export interface HistoricalPriceBySymbolResponse {
  /** Token symbol that was queried */
  symbol: string;
  /** Currency the prices are denominated in */
  currency: string;
  /** Array of historical price data points */
  data: HistoricalPriceDataPoint[];
}

export interface HistoricalPriceByAddressResponse {
  /** Network that was queried */
  network: Network;
  /** Contract address that was queried */
  address: string;
  /** Currency the prices are denominated in */
  currency: string;
  /** Array of historical price data points */
  data: HistoricalPriceDataPoint[];
}