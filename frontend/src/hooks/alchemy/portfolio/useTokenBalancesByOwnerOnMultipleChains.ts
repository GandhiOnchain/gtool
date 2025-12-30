import { useState, useCallback } from 'react';
import { alchemy, getAlchemyNetwork } from '../../../lib/alchemy/config';
import { Network as AlchemyNetwork } from 'alchemy-sdk';
import { isSpamToken } from '../../../lib/alchemy/spam';
import { GetTokenBalancesByWalletResponse } from '../types';

/**
 * Hook for fetching token balances for a wallet (alias for useGetTokensByWallet)
 *
 * @example
 * ```typescript
 * const { data, isLoading, error, fetchTokenBalancesByWallet } = useGetTokenBalancesByWallet();
 *
 * useEffect(() => {
 *   fetchTokenBalancesByOwnerOnMultipleChains({
 *     walletAddress: '0x123...abc',
 *     chainIds: [1, 137, 10] // Ethereum, Polygon, Optimism
 *   });
 * }, [fetchTokenBalancesByOwnerOnMultipleChains]);
 * ```
 */
export function useTokenBalancesByOwnerOnMultipleChains() {
  const [data, setData] = useState<GetTokenBalancesByWalletResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch token balances for a specific wallet address across multiple chains (simplified response without metadata/prices)
   *
   * @param params - Object containing all parameters:
   *   - walletAddress: string - The wallet address to get token balances for (e.g., '0x123...abc')
   *   - chainIds: number[] - Array of chain IDs to query (e.g., [1, 137, 10] for Ethereum, Polygon, Optimism)
   *   - includeNativeTokens?: boolean - Include native tokens like ETH, MATIC (default: true)
   * @returns Promise<GetTokenBalancesByWalletResponse> - See type definition above for structure
   */
  const fetchTokenBalancesByOwnerOnMultipleChains = useCallback(async (params: {
    walletAddress: string;
    chainIds: number[];
    includeNativeTokens?: boolean;
  }): Promise<GetTokenBalancesByWalletResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert chainIds to networks and create portfolio addresses
      const networks = params.chainIds.map(chainId => getAlchemyNetwork(chainId) as unknown as AlchemyNetwork);
      const portfolioAddresses = [{
        address: params.walletAddress,
        networks: networks,
      }];

      const response = await alchemy.portfolio.getTokenBalancesByWallet(
        portfolioAddresses,
        params.includeNativeTokens ?? true
      );
      const formattedResponse = (response as any as GetTokenBalancesByWalletResponse);
      formattedResponse.data.tokens = formattedResponse.data.tokens
        .map((token) => ({
          ...token,
          tokenBalance: token.tokenBalance.startsWith("0x") ? BigInt(token.tokenBalance).toString() : token.tokenBalance,
        }))
        // Filter spam tokens by local list of spam tokens
        .filter((token) => !isSpamToken(token.network, token.tokenAddress));
      setData(formattedResponse);
      return formattedResponse;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch token balances for wallet');
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
    fetchTokenBalancesByOwnerOnMultipleChains,
  };
}