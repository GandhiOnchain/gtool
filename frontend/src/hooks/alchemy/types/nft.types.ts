import { Network } from '../../../lib/alchemy/config';

// BigNumberish from ethers - can be string, number, or BigNumber
export type BigNumberish = string | number;

// NFT token types
export enum NftTokenType {
  ERC721 = "ERC721",
  ERC1155 = "ERC1155",
  NO_SUPPORTED_NFT_STANDARD = "NO_SUPPORTED_NFT_STANDARD",
  NOT_A_CONTRACT = "NOT_A_CONTRACT",
  UNKNOWN = "UNKNOWN"
}

// NFT filters for including/excluding results
export enum NftFilters {
  /** NFTs that have been classified as spam. */
  SPAM = "SPAM",
  /** NFTs that have been airdropped to a user. */
  AIRDROPS = "AIRDROPS"
}

// NFT image information
export interface NftImage {
  /** URL of the image stored in Alchemy's cache. */
  cachedUrl?: string;
  /** URL of a thumbnail sized image. */
  thumbnailUrl?: string;
  /** URL of the image in png format */
  pngUrl?: string;
  /** The type of the media image. */
  contentType?: string;
  /** The size of the media asset in bytes. */
  size?: number;
  /** The original URL of the image as stored on the contract. */
  originalUrl?: string;
}

// NFT animation information
export interface NftAnimation {
  /** The URL of the animation. */
  cachedUrl?: string;
  /** The original URL of the animation as stored on the contract. */
  originalUrl?: string;
  /** The type of the animation. */
  contentType?: string;
  /** The size of the animation in bytes. */
  size?: number;
}

// NFT ownership information response from Alchemy
export interface OwnedNftResponseWithoutMetadata {
  /** The NFT contract address. */
  contractAddress: string;
  /** The NFT token ID. */
  tokenId: string;
  /** The network the NFT is on. */
  network: Network;
  /** The wallet address that owns the NFT. */
  address: string;
  /** The balance of the NFT. */
  balance: string;
  /** Whether the NFT is spam. */
  isSpam?: boolean;
  /** Spammy classifications of the NFT if it is spam. */
  spamClassifications?: string[];
}

// Nft ownership
export interface NftOwnershipResponseWithMetadata {
  /** The NFT's underlying contract info. */
  contract: {
    address: string;
    name?: string;
    symbol?: string;
  };
  /** The NFT token ID as an integer string. */
  tokenId: string;
  /** The type of NFT. */
  tokenType?: NftTokenType;
  /** The NFT name. */
  name?: string;
  /** The NFT description. */
  description?: string;
  /** Media URLs and information for the NFT */
  image?: NftImage;
  /** The animation data of the NFT. */
  animation?: NftAnimation;
  /** Collection metadata for the NFT, if available. */
  collection?: {
    name?: string;
    slug?: string;
  };
  /** The raw metadata of the NFT. */
  raw?: {
    /** The raw metadata of the NFT. */
    metadata?: {
      /** The name of the NFT. */
      name?: string;
      /** The description of the NFT. */
      description?: string;
      /** The image URL of the NFT. */
      image?: string;
      /** The animation URL of the NFT. */
      animation_url?: string;
      /** The attributes of the NFT. */
      attributes?: Array<{
        /** The trait type of the attribute. */
        trait_type?: string;
        /** The value of the attribute. */
        value?: any;
      }>;
    }
  }
  /** The blockchain network. */
  network?: Network;
  /** The token URI of the NFT. */
  tokenUri?: string;
}

// Nft ownership
export interface OwnedNft extends OwnedNftResponseWithoutMetadata {
  /** The NFT metadata. */
  metadata?: NftOwnershipResponseWithMetadata;
}

// Options for fetching NFTs
export interface GetNftsForOwnerOptions {
  /** Optional page key for pagination. */
  pageKey?: string;
  /** Number of NFTs to return (default 100, max 100). */
  pageSize?: number;
  /** Skip fetching metadata for faster response. */
  withMetadata?: boolean;
}

// Response for NFTs by wallet
export interface GetNftsByWalletResponse {
  data: {
    /** An array of NFTs owned by the wallet address. */
    ownedNfts: Array<OwnedNft>;
    /** Total number of NFTs owned by the given address. */
    totalCount: number;
    /** A string key used for paginating through the NFT list. */
    pageKey?: string | null;
  };
}

// Options for fetching NFT contract owners
export interface GetOwnersForContractOptions {
  /** Whether to include the token balances per token id for each owner. Defaults to false when omitted. */
  withTokenBalances?: boolean;
  /** The block number in hex or decimal to fetch owners for. */
  block?: string;
  /** Optional page key to paginate the next page for large requests. */
  pageKey?: string;
  /** If true, include total count of owners in the response. Only applicable when `withTokenBalances` is not set to `true`. */
  includeCount?: boolean;
}

// Response for NFT contract owners
export interface GetOwnersForContractWithoutTokenBalancesAlchemyResponse {
  /** An array of owner addresses for the provided contract address */
  owners: string[];
  /** Total count of unique owners. Only present if includeCount option is true. */
  totalCount?: number;
  /** Optional page key returned when a collection has more than 50,000 owners. */
  pageKey?: string;
}

// Token balance information for NFT owners
export interface NftContractTokenBalance {
  /** The token id owned in the NFT contract. */
  tokenId: string;
  /** The token id balance for the provided owner. */
  balance: string;
}

// NFT contract owner with token balances
export interface NftContractOwner {
  /** The NFT's owner address. */
  ownerAddress: string;
  /** A list of token balances for the provided NFT contract. */
  /** Only present if withTokenBalances option is true. */
  tokenBalances?: NftContractTokenBalance[];
}

// Response when fetching owners with token balances
export interface GetOwnersForContractResponse {
  /** An array of owner addresses for the provided contract address */
  owners: NftContractOwner[];
  /** Optional page key returned when a collection has more than 50,000 owners. */
  pageKey?: string;
  /** Total count of unique owners. Only present if includeCount option is true. */
  totalCount?: number;
}

// NFT metadata batch token request
export interface NftMetadataBatchToken {
  /** The NFT contract address. Limited to ERC721 and ERC1155 tokens. */
  contractAddress: string;
  /** The id of the NFT. */
  tokenId: BigNumberish;
  /** Optional field to specify the type of token to speed up the query. */
  tokenType?: NftTokenType.ERC1155 | NftTokenType.ERC721;
}

// Response for NFT metadata batch
export interface GetNftMetadataBatchResponse {
  /** An array of NFT metadata objects. */
  nfts: NftOwnershipResponseWithMetadata[];
}