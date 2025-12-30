import { useState, useCallback } from 'react';
import { alchemy, createAlchemyInstance, getAlchemyNetwork } from '../../../lib/alchemy/config';
import {
  GetOwnersForContractOptions,
  GetOwnersForContractResponse,
  GetOwnersForContractWithoutTokenBalancesAlchemyResponse
} from '../types';

/**
 * Hook for fetching all unique owners of NFTs for a specific contract
 *
 * @example
 * ```typescript
 * const { data, isLoading, error, fetchOwnersByContractOnSpecificChain } = useOwnersByContractOnSpecificChain();
 *
 * useEffect(() => {
 *   fetchOwnersByContractOnSpecificChain({
 *     contractAddress: '0x123...abc',
 *     chainId: 1, // Ethereum mainnet
 *     options: { withTokenBalances: false }
 *   });
 * }, [fetchOwnersByContractOnSpecificChain]);
 *
 * // Response will have:
 * // data.owners: NftContractOwner[] - Array of owner objects with ownerAddress property
 * // data.pageKey?: string - For pagination if >50k owners
 * // data.totalCount?: number - If includeCount was true
 * ```
 */
export function useOwnersByContractOnSpecificChain() {
  const [data, setData] = useState<GetOwnersForContractResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch all unique owners of NFTs for a specific contract
   *
   * @param params - Object containing all parameters:
   *   - contractAddress: string - The NFT contract address to get owners for (e.g., '0x123...abc')
   *   - chainId: number - The chain ID where the NFT contract exists
   *   - options?: GetOwnersForContractOptions - Optional settings:
   *     * withTokenBalances?: boolean - Include the number of tokens each owner holds (default false)
   *     * block?: string - The block number in hex or decimal to fetch owners for
   *     * pageKey?: string - Optional page key to paginate the next page for large requests
   *     * includeCount?: boolean - If true, include total count of owners in the response. Only applicable when `withTokenBalances` is not set to `true`
   * @returns Promise<GetOwnersForContractResponse> - See type definition above for structure
   *
   * Note: The response always returns owners as NftContractOwner[] objects with ownerAddress property.
   * When withTokenBalances is true, the objects will also include tokenBalances array.
   * When withTokenBalances is false, the objects only contain ownerAddress.
   */
  const fetchOwnersByContractOnSpecificChain = useCallback(async (params: {
    contractAddress: string;
    chainId: number;
    options?: GetOwnersForContractOptions;
  }): Promise<GetOwnersForContractResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const network = getAlchemyNetwork(params.chainId);
      const alchemyForNetwork = createAlchemyInstance(alchemy.config.apiKey, network);

      const response = await alchemyForNetwork.nft.getOwnersForContract(params.contractAddress, params.options);
      if (!params.options?.withTokenBalances) {
        (response as any as GetOwnersForContractResponse).owners = (response as any as GetOwnersForContractWithoutTokenBalancesAlchemyResponse).owners.map((owner) => ({
          ownerAddress: owner
        }));
      }
      const formattedResponse = (response as any as GetOwnersForContractResponse);
      setData(formattedResponse);
      return formattedResponse;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch owners for contract');
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
    fetchOwnersByContractOnSpecificChain,
  };
}