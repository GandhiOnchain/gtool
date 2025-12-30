import { type ContractSourceCodeMetadata } from "@/blockchain-config/types";

export const metadata = {
  "name": "VieSFT",
  "primaryContract": "code/contracts/sft/VieSFT.sol:VieSFT",
  "abiFile": "abi.ts",
  "methods": {
    "owner()": {
      "details": "Returns the address of the current owner."
    },
    "constructor": {
      "custom:oz-upgrades-unsafe-allow": "constructor"
    },
    "getMinters()": {
      "details": "Get all minters",
      "returns": {
        "_0": "Array of minter addresses"
      }
    },
    "uri(uint256)": {
      "params": {
        "tokenId": "The token ID"
      },
      "details": "Override uri function to return token-specific metadata URI",
      "returns": {
        "_0": "The metadata URI for the token"
      }
    },
    "totalSupply()": {
      "details": "Total value of tokens."
    },
    "exists(uint256)": {
      "details": "Indicates whether any token exist with a given id, or not."
    },
    "isMinter(address)": {
      "params": {
        "minter": "The address to check"
      },
      "details": "Check if an address is a minter",
      "returns": {
        "_0": "True if the address is a minter"
      }
    },
    "addMinter(address)": {
      "params": {
        "minter": "The address to add as a minter"
      },
      "details": "Add a minter to the set"
    },
    "renounceOwnership()": {
      "details": "Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby disabling any functionality that is only available to the owner."
    },
    "totalSupply(uint256)": {
      "details": "Total value of tokens in with a given id."
    },
    "removeMinter(address)": {
      "params": {
        "minter": "The address to remove as a minter"
      },
      "details": "Remove a minter from the set"
    },
    "setContractURI(string)": {
      "params": {
        "newContractURI": "The new contract URI"
      },
      "details": "Set the contract URI"
    },
    "getTokenDetails(uint256)": {
      "params": {
        "tokenId": "The token ID"
      },
      "details": "Get token details",
      "returns": {
        "_0": "TokenDetails struct"
      }
    },
    "isTokenMintable(uint256)": {
      "params": {
        "tokenId": "The token ID"
      },
      "details": "Check if a token exists and has details set",
      "returns": {
        "_0": "True if token exists and has details"
      }
    },
    "supportsInterface(bytes4)": {
      "details": "See {IERC165-supportsInterface}."
    },
    "balanceOf(address,uint256)": {
      "details": "See {IERC1155-balanceOf}."
    },
    "transferOwnership(address)": {
      "details": "Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner."
    },
    "create(uint256,uint248,string)": {
      "params": {
        "maxSupply": "The maximum supply for this token, 0 = open edition",
        "metadataUri": "The metadata URI for this token"
      },
      "details": "Create a new token with details"
    },
    "updateTokenURI(uint256,string)": {
      "params": {
        "tokenId": "The token ID",
        "newTokenURI": "The new token URI"
      },
      "details": "Update the token URI for a token"
    },
    "setApprovalForAll(address,bool)": {
      "details": "See {IERC1155-setApprovalForAll}."
    },
    "updateMaxSupply(uint256,uint248)": {
      "params": {
        "tokenId": "The token ID",
        "newMaxSupply": "The new max supply"
      },
      "details": "Update the max supply for a token"
    },
    "isApprovedForAll(address,address)": {
      "details": "See {IERC1155-isApprovedForAll}."
    },
    "balanceOfBatch(address[],uint256[])": {
      "details": "See {IERC1155-balanceOfBatch}. Requirements: - `accounts` and `ids` must have the same length."
    },
    "mint(address,uint256,uint256,bytes)": {
      "params": {
        "id": "The token ID",
        "to": "The address to mint tokens to",
        "data": "Additional data to pass to the receiver",
        "amount": "The amount to mint"
      },
      "details": "Mint tokens to a specific address"
    },
    "initialize(string,address,address,string)": {
      "params": {
        "uri_": "The base URI for token metadata",
        "contractURI_": "The contract-level metadata URI",
        "initialOwner": "The initial owner of the contract",
        "initialMinter": "The initial minter (can be zero address)"
      },
      "details": "Initialize the SFT contract"
    },
    "updateTokenDetails(uint256,uint248,string)": {
      "params": {
        "tokenId": "The token ID",
        "newTokenURI": "The new token URI",
        "newMaxSupply": "The new max supply"
      },
      "details": "Update the token details for a token"
    },
    "mintBatch(address,uint256[],uint256[],bytes)": {
      "params": {
        "to": "The address to mint tokens to",
        "ids": "Array of token IDs",
        "data": "Additional data to pass to the receiver",
        "amounts": "Array of amounts to mint"
      },
      "details": "Mint multiple tokens to a specific address"
    },
    "safeTransferFrom(address,address,uint256,uint256,bytes)": {
      "details": "See {IERC1155-safeTransferFrom}."
    },
    "safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)": {
      "details": "See {IERC1155-safeBatchTransferFrom}."
    },
    "createWithFixedPriceSale(uint256,uint248,string,(address,uint48,uint48,uint248,bool),address)": {
      "params": {
        "sale": "The sale details",
        "tokenId": "The token ID",
        "maxSupply": "The maximum supply for this token, 0 = open edition",
        "metadataUri": "The metadata URI for this token",
        "sftMintManager": "The SFT mint manager address   "
      },
      "details": "Create a new token with a fixed price sale"
    }
  },
  "errors": {
    "NotInitializing()": [
      {
        "details": "The contract is not initializing."
      }
    ],
    "InvalidInitialization()": [
      {
        "details": "The contract is already initialized."
      }
    ],
    "OwnableInvalidOwner(address)": [
      {
        "details": "The owner is not a valid owner account. (eg. `address(0)`)"
      }
    ],
    "ERC1155InvalidSender(address)": [
      {
        "params": {
          "sender": "Address whose tokens are being transferred."
        },
        "details": "Indicates a failure with the token `sender`. Used in transfers."
      }
    ],
    "ERC1155InvalidApprover(address)": [
      {
        "params": {
          "approver": "Address initiating an approval operation."
        },
        "details": "Indicates a failure with the `approver` of a token to be approved. Used in approvals."
      }
    ],
    "ERC1155InvalidOperator(address)": [
      {
        "params": {
          "operator": "Address that may be allowed to operate on tokens without being their owner."
        },
        "details": "Indicates a failure with the `operator` to be approved. Used in approvals."
      }
    ],
    "ERC1155InvalidReceiver(address)": [
      {
        "params": {
          "receiver": "Address to which tokens are being transferred."
        },
        "details": "Indicates a failure with the token `receiver`. Used in transfers."
      }
    ],
    "OwnableUnauthorizedAccount(address)": [
      {
        "details": "The caller account is not authorized to perform an operation."
      }
    ],
    "ERC1155InvalidArrayLength(uint256,uint256)": [
      {
        "params": {
          "idsLength": "Length of the array of token identifiers",
          "valuesLength": "Length of the array of token amounts"
        },
        "details": "Indicates an array length mismatch between ids and values in a safeBatchTransferFrom operation. Used in batch transfers."
      }
    ],
    "ERC1155MissingApprovalForAll(address,address)": [
      {
        "params": {
          "owner": "Address of the current owner of a token.",
          "operator": "Address that may be allowed to operate on tokens without being their owner."
        },
        "details": "Indicates a failure with the `operator`’s approval. Used in transfers."
      }
    ],
    "ERC1155InsufficientBalance(address,uint256,uint256,uint256)": [
      {
        "params": {
          "needed": "Minimum amount required to perform a transfer.",
          "sender": "Address whose tokens are being transferred.",
          "balance": "Current balance for the interacting account.",
          "tokenId": "Identifier number of a token."
        },
        "details": "Indicates an error related to the current `balance` of a `sender`. Used in transfers."
      }
    ]
  },
  "bytecodeHash": "0x488e560cdefb1fe0058983373edd4a15e8afe9d9519a3239ce977c5aacb4aeea",
  "contractFileTree": {
    "code": {
      "@openzeppelin": {
        "contracts-upgradeable": {
          "access": {
            "OwnableUpgradeable.sol": ""
          },
          "proxy": {
            "utils": {
              "Initializable.sol": ""
            }
          },
          "token": {
            "ERC1155": {
              "ERC1155Upgradeable.sol": "",
              "extensions": {
                "ERC1155BurnableUpgradeable.sol": "",
                "ERC1155SupplyUpgradeable.sol": ""
              }
            }
          },
          "utils": {
            "ContextUpgradeable.sol": "",
            "introspection": {
              "ERC165Upgradeable.sol": ""
            }
          }
        },
        "contracts": {
          "interfaces": {
            "draft-IERC6093.sol": ""
          },
          "token": {
            "ERC1155": {
              "extensions": {
                "IERC1155MetadataURI.sol": ""
              },
              "IERC1155.sol": "",
              "IERC1155Receiver.sol": "",
              "utils": {
                "ERC1155Utils.sol": ""
              }
            }
          },
          "utils": {
            "Arrays.sol": "",
            "Comparators.sol": "",
            "introspection": {
              "IERC165.sol": ""
            },
            "math": {
              "Math.sol": "",
              "SafeCast.sol": ""
            },
            "Panic.sol": "",
            "SlotDerivation.sol": "",
            "StorageSlot.sol": "",
            "structs": {
              "EnumerableSet.sol": ""
            }
          }
        }
      },
      "contracts": {
        "sft": {
          "interfaces": {
            "IVieSFTMint.sol": "",
            "IVieSFTMintManager.sol": ""
          },
          "VieSFT.sol": ""
        }
      }
    }
  },
} as const satisfies ContractSourceCodeMetadata;