import { useState, useCallback } from 'react';
import { alchemy } from '../../../lib/alchemy/config';
import { GetTokenPriceBySymbolResponse } from '../types';

/**
 * Hook for fetching current token prices by symbol
 *
 * @example
 * ```typescript
 * const { data, isLoading, error, fetchTokenPriceBySymbol } = useTokenPricesBySymbol();
 *
 * useEffect(() => {
 *   fetchTokenPriceBySymbol({
 *     symbols: ['ETH', 'BTC', 'USDC']
 *   });
 * }, [fetchTokenPriceBySymbol]);
 * ```
 */
export function useTokenPricesBySymbol() {
  const [data, setData] = useState<GetTokenPriceBySymbolResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch current token prices by token symbols
   *
   * @param params - Object containing all parameters:
   *   - symbols: string[] - Array of token symbols to get prices for (e.g., ['ETH', 'BTC', 'USDC'])
   * @returns Promise<GetTokenPriceBySymbolResponse> - See type definition above for structure
   *
   * Note: The prices array may be empty if price data is not available for a symbol.
   * Always check if tokenPrices?.prices[0] exists before accessing its properties.
   */
  const fetchTokenPriceBySymbol = useCallback(async (params: {
    symbols: string[];
  }): Promise<GetTokenPriceBySymbolResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await alchemy.prices.getTokenPriceBySymbol(params.symbols);
      setData(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch token price by symbol');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    fetchTokenPriceBySymbol,
  };
}