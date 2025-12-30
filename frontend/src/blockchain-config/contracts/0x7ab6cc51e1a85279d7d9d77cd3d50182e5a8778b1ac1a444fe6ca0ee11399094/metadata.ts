import { type ContractSourceCodeMetadata } from "@/blockchain-config/types";

export const metadata = {
  "name": "VieMarketInventory",
  "primaryContract": "code/contracts/prediction-market/VieMarketInventory.sol:VieMarketInventory",
  "abiFile": "abi.ts",
  "methods": {
    "question()": {
      "details": "Returns an empty string if the inventory was not initialized yet.",
      "returns": {
        "questionText": "Market question text."
      },
      "notice": "Retrieves the market question captured at initialization."
    },
    "uri(uint256)": {
      "params": {
        "outcomeId": "One-based token ID to query."
      },
      "details": "Composes a JSON data URI using optional images or fallback SVGs.",
      "returns": {
        "metadataUri": "Fully-qualified metadata URI (data:application/json;base64,...)."
      },
      "notice": "ERC-1155 metadata URI producing dynamic JSON per outcome."
    },
    "totalShares()": {
      "details": "Indices are zero-based while token IDs are one-based.",
      "returns": {
        "totals": "Array of total supplies per outcome (6 decimals)."
      },
      "notice": "Returns the total number of minted shares per outcome."
    },
    "totalSupply()": {
      "details": "Total value of tokens."
    },
    "exists(uint256)": {
      "details": "Indicates whether any token exist with a given id, or not."
    },
    "shareDecimals()": {
      "details": "Always returns six to match USDC precision and on-chain conventions.",
      "returns": {
        "decimalsCount": "Decimal precision."
      },
      "notice": "Returns the fixed decimal precision used by outcome shares."
    },
    "inventoryState()": {
      "details": "Useful for aggregators wanting a single call to gather all metadata.",
      "returns": {
        "state": "Struct containing question, outcome names, image URIs, and total supplies."
      },
      "notice": "Returns a snapshot of question, outcomes, and total supplies for off-chain consumers."
    },
    "balancesOf(address)": {
      "params": {
        "account": "Address whose balances will be returned."
      },
      "details": "Alignment is zero-based to simplify off-chain iteration.",
      "returns": {
        "balances": "Array of balances per outcome (6 decimals)."
      },
      "notice": "Returns the ERC-1155 balances of every outcome for the given account."
    },
    "outcomeName(uint256)": {
      "params": {
        "outcomeId": "One-based outcome ID to query."
      },
      "details": "Reverts when the outcome ID is out of bounds.",
      "returns": {
        "name": "Outcome name string."
      },
      "notice": "Returns the name of the specified outcome."
    },
    "totalSupply(uint256)": {
      "details": "Total value of tokens in with a given id."
    },
    "outcomeImageURI(uint256)": {
      "params": {
        "outcomeId": "One-based outcome ID to query."
      },
      "details": "Reverts when the outcome ID is out of bounds.",
      "returns": {
        "imageUri": "Outcome image URI or empty string when rendering fallback SVG."
      },
      "notice": "Returns the image URI for the specified outcome."
    },
    "supportsInterface(bytes4)": {
      "params": {
        "interfaceId": "Interface identifier to check."
      },
      "returns": {
        "supported": "True when the interface is supported."
      },
      "notice": "Exposes supported interfaces, combining ERC1155 and ERC1155Supply capabilities."
    },
    "balanceOf(address,uint256)": {
      "details": "See {IERC1155-balanceOf}."
    },
    "setApprovalForAll(address,bool)": {
      "details": "See {IERC1155-setApprovalForAll}."
    },
    "isApprovedForAll(address,address)": {
      "details": "See {IERC1155-isApprovedForAll}."
    },
    "balanceOfBatch(address[],uint256[])": {
      "details": "See {IERC1155-balanceOfBatch}. Requirements: - `accounts` and `ids` must have the same length."
    },
    "burnShares(address,uint256,uint256)": {
      "params": {
        "from": "Address whose shares will be burned.",
        "amount": "Number of shares to burn (6 decimals).",
        "outcomeId": "One-based outcome ID being burned."
      },
      "details": "Only callable by the controlling market contract.",
      "notice": "Burns outcome shares from the provided account."
    },
    "mintShares(address,uint256,uint256)": {
      "params": {
        "to": "Recipient receiving the shares.",
        "amount": "Number of shares to mint (6 decimals).",
        "outcomeId": "One-based outcome ID being minted."
      },
      "details": "Only callable by the controlling market contract.",
      "notice": "Mints outcome shares to the provided recipient."
    },
    "initialize(address,string,string[],string[])": {
      "params": {
        "market_": "Address of the prediction market that owns this inventory.",
        "question_": "Market question used during metadata rendering.",
        "outcomeNames_": "Outcome names aligned with outcome IDs (index + 1).",
        "outcomeImageUris_": "Optional outcome image URIs aligned with outcome IDs."
      },
      "details": "Can only be invoked once by the controlling market.",
      "notice": "Initializes the inventory with metadata provided by the prediction market contract."
    },
    "safeTransferFrom(address,address,uint256,uint256,bytes)": {
      "details": "See {IERC1155-safeTransferFrom}."
    },
    "safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)": {
      "details": "See {IERC1155-safeBatchTransferFrom}."
    },
    "market()": {
      "notice": "Address of the prediction market contract that controls minting and burning."
    },
    "DECIMALS()": {
      "notice": "Fixed decimals used by every outcome share (1_000_000 units equals 1 share)."
    },
    "constructor": {
      "notice": "Deploys the inventory with an empty metadata URI (set during initialization)."
    },
    "outcomesCount()": {
      "notice": "Number of outcomes tracked by this inventory (token IDs are 1-based)."
    }
  },
  "errors": {
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
  "bytecodeHash": "0x7ab6cc51e1a85279d7d9d77cd3d50182e5a8778b1ac1a444fe6ca0ee11399094",
  "contractFileTree": {
    "code": {
      "@openzeppelin": {
        "contracts": {
          "interfaces": {
            "draft-IERC6093.sol": ""
          },
          "token": {
            "ERC1155": {
              "ERC1155.sol": "",
              "extensions": {
                "ERC1155Supply.sol": "",
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
            "Base64.sol": "",
            "Comparators.sol": "",
            "Context.sol": "",
            "introspection": {
              "ERC165.sol": "",
              "IERC165.sol": ""
            },
            "math": {
              "Math.sol": "",
              "SafeCast.sol": "",
              "SignedMath.sol": ""
            },
            "Panic.sol": "",
            "SlotDerivation.sol": "",
            "StorageSlot.sol": "",
            "Strings.sol": ""
          }
        }
      },
      "contracts": {
        "prediction-market": {
          "VieMarketInventory.sol": ""
        }
      }
    }
  }
} as const satisfies ContractSourceCodeMetadata;