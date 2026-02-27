import { useState, useCallback } from 'react';
import { alchemy, getAlchemyNetwork } from '../../../lib/alchemy/config';
import { Network as AlchemyNetwork } from 'alchemy-sdk';
import { GetNftsByWalletResponse, GetNftsForOwnerOptions } from '../types';

/**
 * Hook for fetching NFTs owned by a specific address
 *
 * @example
 * ```typescript
 * const NftGallery = ({ ownerAddress }) => {
 *   const {
 *     data: nfts,
 *     isLoading,
 *     error,
 *     fetchNftsByOwner
 *   } = useNftsByOwner();
 *
 *   useEffect(() => {
 *     fetchNftsByOwnerOnMultipleChains({
 *       ownerAddress,
 *       chainIds: [1, 137, 10] // Ethereum, Polygon, Optimism
 *     });
 *   }, [ownerAddress, fetchNftsByOwnerOnMultipleChains]);
 *
 *   if (isLoading) return <div>Loading NFTs...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div className="nft-grid">
 *       {nfts?.ownedNfts.map((nft) => (
 *         <div key={`${nft.contract.address}-${nft.tokenId}`}>
 *           <img src={nft.image?.originalUrl} alt={nft.name} />
 *           <p>{nft.name}</p>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * };
 * ```
 */
export function useNftsByOwnerOnMultipleChains() {
  const [data, setData] = useState<GetNftsByWalletResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch all NFTs owned by a specific address
   *
   * @param params - Object containing all parameters:
   *   - ownerAddress: string - The wallet address to get NFTs for (e.g., '0x123...abc')
   *   - options?: GetNftsForOwnerOptions - Optional filtering and pagination options:
   *     * pageKey?: string - Token for pagination from previous response
   *     * pageSize?: number - Number of NFTs to return (default 100, max 100)
   *     * withMetadata?: boolean - Skip fetching metadata for faster response (default false)
   * @returns Promise<GetNftsByWalletResponse> - See type definition above for structure
   */
  const fetchNftsByOwnerOnMultipleChains = useCallback(async (params: {
    ownerAddress: string;
    chainIds: number[];
    options?: GetNftsForOwnerOptions;
  }): Promise<GetNftsByWalletResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert chainIds to networks and create portfolio addresses
      const networks = params.chainIds.map(chainId => getAlchemyNetwork(chainId) as unknown as AlchemyNetwork);
      const portfolioAddresses = [{
        address: params.ownerAddress,
        networks: networks,
      }];

      const response = await alchemy.portfolio.getNftsByWallet(portfolioAddresses, !!params.options?.withMetadata, params.options?.pageKey, params.options?.pageSize);
      if (params.options?.withMetadata && response?.data?.ownedNfts?.length && response?.data?.ownedNfts[0].raw?.metadata) {
        response.data.ownedNfts = response.data.ownedNfts.map((nft: any) => ({
          ...nft,
          metadata: nft,
        }));
      }

      const formattedResponse = (response as any as GetNftsByWalletResponse);
      formattedResponse.data.ownedNfts = formattedResponse.data.ownedNfts.map((nft) => ({
        ...nft,
        balance: nft.balance.startsWith("0x") ? BigInt(nft.balance).toString() : nft.balance,
      }));
      setData(formattedResponse);
      return formattedResponse;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch NFTs for owner');
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
    fetchNftsByOwnerOnMultipleChains,
  };
}