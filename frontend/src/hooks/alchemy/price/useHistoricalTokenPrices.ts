import { useState, useCallback } from 'react';
import { alchemy, getAlchemyNetwork } from '../../../lib/alchemy/config';
import { Network as AlchemyNetwork } from 'alchemy-sdk';
import { HistoricalPriceByAddressResponse, HistoricalPriceInterval } from '../types';

/**
 * Hook for fetching historical token prices by address
 *
 * @example
 * ```typescript
 * const TokenPriceChart = ({ tokenAddress }) => {
 *   const {
 *     data: priceHistory,
 *     isLoading,
 *     error,
 *     fetchHistoricalPrices
 *   } = useHistoricalTokenPrices();
 *
 *   useEffect(() => {
 *     fetchHistoricalPrices({
 *       chainId: 1, // Ethereum mainnet
 *       address: tokenAddress,
 *       interval: HistoricalPriceInterval.ONE_DAY,
 *       startTime: '2024-01-01',
 *       endTime: '2024-01-31'
 *     });
 *   }, [tokenAddress, fetchHistoricalPrices]);
 *
 *   if (isLoading) return <div>Loading chart...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   const chartData = {
 *     labels: priceHistory?.data.map(p => new Date(p.timestamp).toLocaleDateString()) || [],
 *     datasets: [{
 *       label: 'Token Price',
 *       data: priceHistory?.data.map(p => parseFloat(p.value)) || [],
 *       borderColor: 'blue',
 *       fill: false,
 *     }]
 *   };
 *
 *   return <Line data={chartData} />;
 * };
 * ```
 */
export function useHistoricalTokenPrices() {
  const [data, setData] = useState<HistoricalPriceByAddressResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch historical token prices by contract address
   *
   * @param params - Object containing all parameters:
   *   - chainId: number - The blockchain network ID (e.g., 1 = Ethereum, 137 = Polygon, 10 = Optimism)
   *   - address: string - The token contract address (e.g., '0xA0b86a33E6Fe17E1B1F493f67e37f43e3DC9e456')
   *   - interval: HistoricalPriceInterval - Time interval between data points:
   *     * HistoricalPriceInterval.FIVE_MINUTE: 5-minute intervals
   *     * HistoricalPriceInterval.ONE_HOUR: 1-hour intervals
   *     * HistoricalPriceInterval.ONE_DAY: 1-day intervals
   *   - startTime: string | number - Start time in ISO-8601 format (e.g., '2024-01-01') or Unix timestamp
   *   - endTime: string | number - End time in ISO-8601 format (e.g., '2024-01-31') or Unix timestamp
   * @returns Promise<HistoricalPriceByAddressResponse> - See type definition above for structure
   */
  const fetchHistoricalPrices = useCallback(async (params: {
    chainId: number;
    address: string;
    interval: HistoricalPriceInterval;
    startTime: string | number;
    endTime: string | number;
  }): Promise<HistoricalPriceByAddressResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert chainId to Alchemy Network
      const network = getAlchemyNetwork(params.chainId) as unknown as AlchemyNetwork;

      const response = await alchemy.prices.getHistoricalPriceByAddress(
        network,
        params.address,
        params.startTime,
        params.endTime,
        params.interval
      );
      setData(response as any as HistoricalPriceByAddressResponse);
      return response as any as HistoricalPriceByAddressResponse;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch historical token prices');
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
    fetchHistoricalPrices,
  };
}