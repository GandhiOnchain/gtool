import { useState, useCallback } from 'react';
import { alchemy } from '../../../lib/alchemy/config';
import { HistoricalPriceBySymbolResponse, HistoricalPriceInterval } from '../types';

/**
 * Hook for fetching historical token prices by symbol
 *
 * @example
 * ```typescript
 * const { data, isLoading, error, fetchHistoricalPricesBySymbol } = useHistoricalTokenPricesBySymbol();
 *
 * useEffect(() => {
 *   fetchHistoricalPricesBySymbol({
 *     symbol: 'ETH',
 *     startTime: '2024-01-01',
 *     endTime: '2024-01-31',
 *     interval: HistoricalPriceInterval.ONE_DAY
 *   });
 * }, [fetchHistoricalPricesBySymbol]);
 * ```
 */
export function useHistoricalTokenPricesBySymbol() {
  const [data, setData] = useState<HistoricalPriceBySymbolResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch historical token prices by token symbol
   *
   * @param params - Object containing all parameters:
   *   - symbol: string - The token symbol to get historical prices for (e.g., 'ETH', 'BTC', 'USDC')
   *   - startTime: string | number - Start time in ISO-8601 format (e.g., '2024-01-01') or Unix timestamp in seconds
   *   - endTime: string | number - End time in ISO-8601 format (e.g., '2024-01-31') or Unix timestamp in seconds
   *   - interval: HistoricalPriceInterval - Time interval between data points:
   *     * HistoricalPriceInterval.FIVE_MINUTE: 5-minute intervals
   *     * HistoricalPriceInterval.ONE_HOUR: 1-hour intervals
   *     * HistoricalPriceInterval.ONE_DAY: 1-day intervals
   * @returns Promise<HistoricalPriceBySymbolResponse> - See type definition above for structure
   */
  const fetchHistoricalPricesBySymbol = useCallback(async (params: {
    symbol: string;
    startTime: string | number;
    endTime: string | number;
    interval: HistoricalPriceInterval;
  }): Promise<HistoricalPriceBySymbolResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await alchemy.prices.getHistoricalPriceBySymbol(
        params.symbol,
        params.startTime,
        params.endTime,
        params.interval
      );
      setData(response as HistoricalPriceBySymbolResponse);
      return response as HistoricalPriceBySymbolResponse;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch historical token prices by symbol');
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
    fetchHistoricalPricesBySymbol,
  };
}