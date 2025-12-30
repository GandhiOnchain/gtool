import { useState, useCallback } from 'react';
import { alchemy, getAlchemyNetwork } from '../../../lib/alchemy/config';
import { Network as AlchemyNetwork } from 'alchemy-sdk';
import { GetTokenPriceByAddressResponse } from '../types';

/**
 * Hook for fetching current token price by address
 *
 * @example
 * ```typescript
 * const TokenPriceDisplay = ({ tokenAddress }) => {
 *   const {
 *     data: priceResponse,
 *     isLoading,
 *     error,
 *     fetchTokenPrice
 *   } = useTokenPricesByAddress();
 *
 *   useEffect(() => {
 *     fetchTokenPrice({
 *       addresses: [{ chainId: 1, address: tokenAddress }] // Ethereum mainnet
 *     });
 *   }, [tokenAddress, fetchTokenPrice]);
 *
 *   if (isLoading) return <div>Loading price...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   const tokenData = priceResponse?.data[0];
 *   if (tokenData?.error) return <div>Error: {tokenData.error.message}</div>;
 *
 *   return (
 *     <div>
 *       <p>Price: ${tokenData?.prices[0]?.value || 'N/A'}</p>
 *       <small>Last updated: {tokenData?.prices[0]?.lastUpdatedAt}</small>
 *     </div>
 *   );
 * };
 * ```
 */
export function useTokenPricesByAddress() {
  const [data, setData] = useState<GetTokenPriceByAddressResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch current token prices by contract addresses
   *
   * @param params - Object containing all parameters:
   *   - addresses: Array of objects containing:
   *     * chainId: number - The blockchain network ID (e.g., 1 = Ethereum, 137 = Polygon, 10 = Optimism)
   *     * address: string - The token contract address (e.g., '0xA0b86a33E6Fe17E1B1F493f67e37f43e3DC9e456')
   * @returns Promise<GetTokenPriceByAddressResponse> - See type definition above for structure
   *
   * Note: The prices array may be empty if price data is not available or if an error occurred.
   * Always check if prices[0] exists before accessing its properties.
   */
  const fetchTokenPrice = useCallback(async (params: {
    addresses: Array<{ chainId: number; address: string }>;
  }): Promise<GetTokenPriceByAddressResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert chainIds to Alchemy Networks
      const tokenRequests = params.addresses.map(({ chainId, address }) => ({
        network: getAlchemyNetwork(chainId) as unknown as AlchemyNetwork,
        address,
      }));

      const response = await alchemy.prices.getTokenPriceByAddress(tokenRequests as any);
      setData(response as GetTokenPriceByAddressResponse);
      return response as GetTokenPriceByAddressResponse;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch token price');
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
    fetchTokenPrice,
  };
}