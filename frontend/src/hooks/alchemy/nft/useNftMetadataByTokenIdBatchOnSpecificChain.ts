import { useState, useCallback } from 'react';
import { alchemy, createAlchemyInstance, getAlchemyNetwork } from '../../../lib/alchemy/config';
import { GetNftMetadataBatchResponse, NftMetadataBatchToken } from '../types';

/**
 * Hook for fetching NFT metadata for multiple tokens in batch
 *
 * @example
 * ```typescript
 * const { data, isLoading, error, fetchNftMetadataBatch } = useNftMetadataByTokenIdBatch();
 *
 * useEffect(() => {
 *   fetchNftMetadataBatchOnSpecificChain({
 *     tokens: [
 *       { contractAddress: '0x123...abc', tokenId: '1' },
 *       { contractAddress: '0x456...def', tokenId: '42' },
 *     ],
 *     chainId: 1 // Ethereum mainnet
 *   });
 * }, [fetchNftMetadataBatch]);
 * ```
 */
export function useNftMetadataByTokenIdBatchOnSpecificChain() {
  const [data, setData] = useState<GetNftMetadataBatchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch metadata for multiple NFTs in a single batch request
   *
   * @param params - Object containing all parameters:
   *   - tokens: NftMetadataBatchToken[] - Array of NFT token identifiers:
   *     * contractAddress: string - The NFT contract address (e.g., '0x123...abc')
   *     * tokenId: BigNumberish - The token ID within the contract (e.g., '1', '42', or BigNumber)
   *     * tokenType?: NftTokenType.ERC721 | NftTokenType.ERC1155 - Optional token type
   * @returns Promise<GetNftMetadataBatchResponse> - See type definition above for structure
   */
  const fetchNftMetadataBatchOnSpecificChain = useCallback(async (params: {
    tokens: NftMetadataBatchToken[];
    chainId: number;
  }): Promise<GetNftMetadataBatchResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const network = getAlchemyNetwork(params.chainId);
      const alchemyForNetwork = createAlchemyInstance(alchemy.config.apiKey, network);

      const response = await alchemyForNetwork.nft.getNftMetadataBatch(params.tokens);
      setData(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch NFT metadata batch');
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
    fetchNftMetadataBatchOnSpecificChain,
  };
}