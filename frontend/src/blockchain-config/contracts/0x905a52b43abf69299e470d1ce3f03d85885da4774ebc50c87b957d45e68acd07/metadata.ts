import { type ContractSourceCodeMetadata } from "@/blockchain-config/types";

export const metadata = {
  "name": "ERC721GenerativeOnchain",
  "primaryContract": "code/contracts/erc721/onchain/ERC721GenerativeOnchain.sol:ERC721GenerativeOnchain",
  "abiFile": "abi.ts",
  "methods": {
    "name()": {
      "details": "Returns the token collection name."
    },
    "owner()": {
      "details": "Returns the address of the current owner."
    },
    "symbol()": {
      "details": "Returns the token collection symbol."
    },
    "totalSupply()": {
      "details": "Returns the total number of tokens in existence. Burned tokens will reduce the count. To get the total number of tokens minted, please see {_totalMinted}."
    },
    "ownerOf(uint256)": {
      "details": "Returns the owner of the `tokenId` token. Requirements: - `tokenId` must exist."
    },
    "tokenURI(uint256)": {
      "params": {
        "tokenId": "ID of token to get uri for"
      },
      "notice": "Overrides tokenURI to first rotate the token id"
    },
    "balanceOf(address)": {
      "details": "Returns the number of tokens in `owner`'s account."
    },
    "setBaseURI(string)": {
      "params": {
        "newBaseURI": "New base uri to set"
      },
      "notice": "Set base uri"
    },
    "renounceOwnership()": {
      "details": "Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby disabling any functionality that is only available to the owner."
    },
    "getApproved(uint256)": {
      "details": "Returns the account approved for `tokenId` token. Requirements: - `tokenId` must exist."
    },
    "tokenManager(uint256)": {
      "params": {
        "id": "Token ID or Edition ID for Editions implementing contracts"
      },
      "notice": "Returns the token manager for the id passed in."
    },
    "registerMinter(address)": {
      "params": {
        "minter": "New minter"
      },
      "notice": "Registers a minter"
    },
    "setLimitSupply(uint256)": {
      "params": {
        "_limitSupply": "Limit supply to set"
      },
      "notice": "Set limit supply"
    },
    "approve(address,uint256)": {
      "details": "Gives permission to `to` to transfer `tokenId` token to another account. See {ERC721A-_approve}. Requirements: - The caller must own the token or be an approved operator."
    },
    "initialize(bytes,address)": {
      "params": {
        "data": "Data to initialize the contract param creator Creator/owner of contract param _contractURI Contract metadata param defaultRoyalty Default royalty object for contract (optional) param _defaultTokenManager Default token manager for contract (optional) param _name Name of token edition param _symbol Symbol of the token edition param trustedForwarder Trusted minimal forwarder param initialMinter Initial minter to register param _generativeCodeURI Generative code URI param newBaseURI Base URI for contract param _limitSupply Initial limit supply param useMarketplaceFiltererRegistry Denotes whether to use marketplace filterer registry",
        "_observability": "Observability contract address"
      },
      "notice": "Initialize the contract"
    },
    "unregisterMinter(address)": {
      "params": {
        "minter": "Minter to unregister"
      },
      "notice": "Unregisters a minter"
    },
    "setRoyaltyManager(address)": {
      "params": {
        "_royaltyManager": "New royalty manager"
      },
      "notice": "Sets royalty manager if current one allows it"
    },
    "transferOwnership(address)": {
      "details": "Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner."
    },
    "royaltyInfo(uint256,uint256)": {
      "params": {
        "_salePrice": "Sale price of token",
        "_tokenGroupingId": "Token id if on general, and edition id if on editions"
      },
      "notice": "Conforms to ERC-2981. Editions should overwrite to return royalty for entire edition"
    },
    "setApprovalForAll(address,bool)": {
      "details": "Approve or remove `operator` as an operator for the caller. Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller. Requirements: - The `operator` cannot be the caller. Emits an {ApprovalForAll} event."
    },
    "setDefaultTokenManager(address)": {
      "params": {
        "_defaultTokenManager": "New default token manager"
      },
      "notice": "Set default token manager if current token manager allows it"
    },
    "setTokenURIs(uint256[],string[])": {
      "params": {
        "ids": "IDs of tokens to override base uri system for with custom uris",
        "uris": "Custom uris"
      },
      "notice": "Override base URI system for select tokens, with custom per-token metadata"
    },
    "isApprovedForAll(address,address)": {
      "details": "Returns if the `operator` is allowed to manage all of the assets of `owner`. See {setApprovalForAll}."
    },
    "setCustomRenderer((address,bool))": {
      "params": {
        "_customRendererConfig": "New custom renderer config"
      },
      "notice": "Set custom renderer and processing config"
    },
    "setDefaultRoyalty((address,uint16))": {
      "params": {
        "_royalty": "New default royalty"
      },
      "notice": "Sets default royalty if royalty manager allows it"
    },
    "transferFrom(address,address,uint256)": {
      "details": "Transfers `tokenId` from `from` to `to`. Requirements: - `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must be owned by `from`. - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}. Emits a {Transfer} event."
    },
    "removeGranularTokenManagers(uint256[])": {
      "params": {
        "_ids": "Edition / token ids to remove token managers for"
      },
      "notice": "Remove granular token managers"
    },
    "safeTransferFrom(address,address,uint256)": {
      "details": "Equivalent to `safeTransferFrom(from, to, tokenId, '')`."
    },
    "setContractMetadata(string,string,string)": {
      "params": {
        "newName": "New name",
        "newSymbol": "New symbol",
        "newContractUri": "New contractURI"
      },
      "notice": "Set contract name"
    },
    "setGranularTokenManagers(uint256[],address[])": {
      "params": {
        "_ids": "Edition / token ids",
        "_tokenManagers": "Token managers to set for tokens / editions"
      },
      "notice": "Sets granular token managers if current token manager(s) allow it"
    },
    "safeTransferFrom(address,address,uint256,bytes)": {
      "details": "Safely transfers `tokenId` token from `from` to `to`. Requirements: - `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must exist and be owned by `from`. - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}. - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer. Emits a {Transfer} event."
    },
    "setGranularRoyalties(uint256[],(address,uint16)[])": {
      "params": {
        "ids": "Token / edition ids",
        "_newRoyalties": "New royalties for each token / edition"
      },
      "notice": "Sets granular royalties (per token-grouping) if royalty manager allows it"
    },
    "files()": {
      "notice": "Return registered file names"
    },
    "supply()": {
      "notice": "Return the total number of minted tokens on the collection"
    },
    "minters()": {
      "notice": "Return allowed minters on contract"
    },
    "burn(uint256)": {
      "notice": "See {IERC721-burn}. Overrides default behaviour to check associated tokenManager."
    },
    "contractURI()": {
      "notice": "Contract metadata"
    },
    "freezeMints()": {
      "notice": "Freeze mints on contract forever"
    },
    "limitSupply()": {
      "notice": "Limit the supply to take advantage of over-promising in summation with multiple mint vectors"
    },
    "observability()": {
      "notice": "Observability contract"
    },
    "defaultManager()": {
      "notice": "Global token/edition manager default"
    },
    "royaltyManager()": {
      "notice": "Royalty manager - optional contract that defines the conditions around setting royalties"
    },
    "removeFile(string)": {
      "notice": "Remove a file from registered list of file names, and its associated storage bytecode addresses"
    },
    "fileStorage(string)": {
      "notice": "Return storage bytecode addresses for a file"
    },
    "fileContents(string)": {
      "notice": "Return file contents"
    },
    "customRendererConfig()": {
      "notice": "Custom renderer config"
    },
    "removeRoyaltyManager()": {
      "notice": "Removes royalty manager if current one allows it"
    },
    "addFile(string,address[])": {
      "notice": "Add a file via its name and associated storage bytecode addresses"
    },
    "supportsInterface(bytes4)": {
      "notice": "See {IERC165-supportsInterface}."
    },
    "removeDefaultTokenManager()": {
      "notice": "Removes default token manager if current token manager allows it"
    },
    "mintOneToOneRecipient(address)": {
      "notice": "See {IERC721GeneralMint-mintOneToOneRecipient}"
    },
    "mintOneToMultipleRecipients(address[])": {
      "notice": "See {IERC721GeneralMint-mintOneToMultipleRecipients}"
    },
    "mintAmountToOneRecipient(address,uint256)": {
      "notice": "See {IERC721GeneralMint-mintAmountToOneRecipient}"
    },
    "mintSameAmountToMultipleRecipients(address[],uint256)": {
      "notice": "See {IERC721GeneralMint-mintSameAmountToMultipleRecipients}"
    }
  },
  "errors": {},
  "bytecodeHash": "0x905a52b43abf69299e470d1ce3f03d85885da4774ebc50c87b957d45e68acd07",
  "contractFileTree": {
    "code": {
      "contracts": {
        "utils": {
          "Ownable.sol": "",
          "ERC165": {
            "IERC165Upgradeable.sol": "",
            "ERC165CheckerUpgradeable.sol": ""
          },
          "ERC2981": {
            "IERC2981Upgradeable.sol": ""
          }
        },
        "erc721": {
          "ERC721Base.sol": "",
          "erc721a": {
            "ERC721AStorage.sol": "",
            "ERC721AUpgradeable.sol": "",
            "IERC721AUpgradeable.sol": "",
            "ERC721AURIStorageUpgradeable.sol": ""
          },
          "ERC721GeneralSequenceBase.sol": "",
          "onchain": {
            "OnchainFileStorage.sol": "",
            "ERC721GenerativeOnchain.sol": ""
          },
          "interfaces": {
            "IERC721GeneralMint.sol": "",
            "IERC721GeneralSequenceMint.sol": ""
          },
          "custom": {
            "interfaces": {
              "IHighlightRenderer.sol": ""
            }
          }
        },
        "metadata": {
          "MetadataEncryption.sol": ""
        },
        "observability": {
          "IObservability.sol": ""
        },
        "metatx": {
          "ERC2771ContextUpgradeable.sol": ""
        },
        "tokenManager": {
          "interfaces": {
            "IPostBurn.sol": "",
            "IPostTransfer.sol": "",
            "ITokenManager.sol": ""
          }
        },
        "royaltyManager": {
          "interfaces": {
            "IRoyaltyManager.sol": ""
          }
        }
      },
      "@openzeppelin": {
        "contracts": {
          "utils": {
            "Context.sol": "",
            "structs": {
              "EnumerableSet.sol": ""
            }
          }
        },
        "contracts-upgradeable": {
          "utils": {
            "AddressUpgradeable.sol": "",
            "ContextUpgradeable.sol": "",
            "StringsUpgradeable.sol": "",
            "math": {
              "MathUpgradeable.sol": "",
              "SignedMathUpgradeable.sol": ""
            }
          },
          "access": {
            "OwnableUpgradeable.sol": ""
          },
          "proxy": {
            "utils": {
              "Initializable.sol": ""
            }
          },
          "security": {
            "ReentrancyGuardUpgradeable.sol": ""
          }
        }
      }
    }
  },
} as const satisfies ContractSourceCodeMetadata;