import { useState, useCallback } from 'react';
import { alchemy, getAlchemyNetwork, getNetworkDetails } from '../../../lib/alchemy/config';
import { Network as AlchemyNetwork } from 'alchemy-sdk';
import { isSpamToken } from '../../../lib/alchemy/spam';
import { GetTokensByWalletResponse } from '../types';

/**
 * Hook for fetching all token balances held by a wallet
 *
 * @example
 * ```typescript
 * const { data, isLoading, error, fetchTokensByWallet } = useGetTokensByWallet();
 *
 * useEffect(() => {
 *   // Get all tokens across multiple chains with full metadata and prices
 *   fetchTokensByOwnerOnMultipleChains({
 *     walletAddress: '0x123...abc',
 *     chainIds: [1, 137, 10] // Ethereum, Polygon, Optimism
 *   });
 *
 *   // Or with custom options
 *   fetchTokensByOwnerOnMultipleChains({
 *     walletAddress: '0x123...abc',
 *     chainIds: [1, 137],
 *     withMetadata: true,
 *     withPrices: false, // Skip pricing data for faster response
 *     includeNativeTokens: true
 *   });
 * }, [fetchTokensByOwnerOnMultipleChains]);
 * ```
 */
export function useTokensByOwnerOnMultipleChains() {
  const [data, setData] = useState<GetTokensByWalletResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch all token balances for a specific wallet address across multiple chains
   *
   * @param params - Object containing all parameters:
   *   - walletAddress: string - The wallet address to get token balances for (e.g., '0x123...abc')
   *   - chainIds: number[] - Array of chain IDs to query (e.g., [1, 137, 10] for Ethereum, Polygon, Optimism)
   *   - withMetadata?: boolean - Include token metadata (name, symbol, decimals, etc.) (default: true)
   *   - withPrices?: boolean - Include token prices (default: true)
   *   - includeNativeTokens?: boolean - Include native tokens like ETH, MATIC (default: true)
   * @returns Promise<GetTokensByWalletResponse> - See type definition above for structure
   */
  const fetchTokensByOwnerOnMultipleChains = useCallback(async (params: {
    walletAddress: string;
    chainIds: number[];
    withMetadata?: boolean;
    withPrices?: boolean;
    includeNativeTokens?: boolean;
  }): Promise<GetTokensByWalletResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert chainIds to networks and create portfolio addresses
      const networks = params.chainIds.map(chainId => getAlchemyNetwork(chainId) as unknown as AlchemyNetwork);
      const portfolioAddresses = [{
        address: params.walletAddress,
        networks: networks,
      }];

      const response = await alchemy.portfolio.getTokensByWallet(
        portfolioAddresses,
        params.withMetadata ?? true,
        params.withPrices ?? true,
        params.includeNativeTokens ?? true
      );
      const formattedResponse = (response as any as GetTokensByWalletResponse);
      formattedResponse.data.tokens = formattedResponse.data.tokens
        .map((token) => {
          return {
            ...token,
            tokenBalance: token.tokenBalance.startsWith("0x") ? BigInt(token.tokenBalance).toString() : token.tokenBalance,
            tokenMetadata: {
              name: token.tokenMetadata?.name ?? (!token.tokenAddress ? getNetworkDetails(token.network).name : null),
              symbol: token.tokenMetadata?.symbol ?? (!token.tokenAddress ? getNetworkDetails(token.network).nativeGasTokenSymbol : null),
              decimals: token.tokenMetadata?.decimals ?? null,
              logo: token.tokenMetadata?.logo ?? null,
            },
          }
        })
        // Filter spam tokens by local list of spam tokens
        .filter((token) => !isSpamToken(token.network, token.tokenAddress));
      setData(formattedResponse);
      return formattedResponse;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch tokens for wallet');
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
    fetchTokensByOwnerOnMultipleChains,
  };
}