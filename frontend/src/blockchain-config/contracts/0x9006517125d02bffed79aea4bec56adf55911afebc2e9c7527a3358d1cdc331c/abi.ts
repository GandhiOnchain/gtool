import { type Abi } from "viem";

export const abi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "target",
        "type": "address"
      }
    ],
    "name": "AddressEmptyCode",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "implementation",
        "type": "address"
      }
    ],
    "name": "ERC1967InvalidImplementation",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ERC1967NonPayable",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "FailedCall",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "FailedDeployment",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "balance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "needed",
        "type": "uint256"
      }
    ],
    "name": "InsufficientBalance",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidInitialization",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotInitializing",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "UUPSUnauthorizedCallContext",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "slot",
        "type": "bytes32"
      }
    ],
    "name": "UUPSUnsupportedProxiableUUID",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "version",
        "type": "uint64"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "marketId",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "resolver",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "closeTime",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "liquidityParameterWad",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "outcomesCount",
        "type": "uint256"
      }
    ],
    "name": "MarketCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "marketId",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "outcomeId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isBuy",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "usdcAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "outcomeInventory",
        "type": "uint256"
      }
    ],
    "name": "OutcomeTraded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "marketId",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "outcomeId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "payout",
        "type": "uint256"
      }
    ],
    "name": "Redeemed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "marketId",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "winningOutcomeId",
        "type": "uint256"
      }
    ],
    "name": "Resolved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "implementation",
        "type": "address"
      }
    ],
    "name": "Upgraded",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "UPGRADE_INTERFACE_VERSION",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "marketId",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "outcomeId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "sharesToBuy",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxCost",
        "type": "uint256"
      }
    ],
    "name": "buy",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "usdcCost",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "marketId",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "outcomeId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "sharesToBuy",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxCost",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          }
        ],
        "internalType": "struct ViePredictionMarketUSDCV1.PermitSignaturePayload",
        "name": "sig",
        "type": "tuple"
      }
    ],
    "name": "buyWithPermitSignature",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "usdcCost",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "salt",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "resolver",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "closeTime",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "question",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "initialRulesUri",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "initialRulesHash",
        "type": "bytes32"
      },
      {
        "internalType": "string[]",
        "name": "outcomeNames",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "outcomeImageUris",
        "type": "string[]"
      },
      {
        "internalType": "uint256",
        "name": "liquidityParameterWad",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "virtualSeedPerOutcome",
        "type": "uint256"
      }
    ],
    "name": "createMarket",
    "outputs": [
      {
        "internalType": "address",
        "name": "marketId",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "marketId",
        "type": "address"
      }
    ],
    "name": "getMarket",
    "outputs": [
      {
        "internalType": "address",
        "name": "resolver",
        "type": "address"
      },
      {
        "internalType": "uint48",
        "name": "closeTime",
        "type": "uint48"
      },
      {
        "internalType": "uint256",
        "name": "liquidityParameterWad",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "collateralBalance",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "resolved",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "failedToResolveInTime",
        "type": "bool"
      },
      {
        "internalType": "uint16",
        "name": "winningOutcomeId",
        "type": "uint16"
      },
      {
        "internalType": "uint256[]",
        "name": "sharePrices",
        "type": "uint256[]"
      },
      {
        "internalType": "string",
        "name": "question",
        "type": "string"
      },
      {
        "internalType": "string[]",
        "name": "outcomeNames",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "outcomeImageUris",
        "type": "string[]"
      },
      {
        "internalType": "uint256[]",
        "name": "totalShares",
        "type": "uint256[]"
      },
      {
        "internalType": "string",
        "name": "initialRulesUri",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "initialRulesHash",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "marketId",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserBalances",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "outcomeBalances",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256",
        "name": "currentUserCollateralContribution",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner_",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "inventoryImplementation_",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "customUSDC",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "inventoryImplementation",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "marketId",
        "type": "address"
      }
    ],
    "name": "inventorySnapshot",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "totals",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "salt",
        "type": "bytes32"
      }
    ],
    "name": "predictInventoryAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "predicted",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "marketId",
        "type": "address"
      }
    ],
    "name": "prices",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "probabilities",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proxiableUUID",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "marketId",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "outcomeId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "sharesToBuy",
        "type": "uint256"
      }
    ],
    "name": "quoteBuy",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "cost",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "marketId",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "outcomeId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "sharesToSell",
        "type": "uint256"
      }
    ],
    "name": "quoteSell",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "payout",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "marketId",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "outcomeId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
      }
    ],
    "name": "redeem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "marketId",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "winningOutcomeId",
        "type": "uint256"
      }
    ],
    "name": "resolve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "marketId",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "returnCollateralDueToOverdueResolution",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "marketId",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "outcomeId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "sharesToSell",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minPayout",
        "type": "uint256"
      }
    ],
    "name": "sell",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "usdcPayout",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newAddress",
        "type": "address"
      }
    ],
    "name": "updateCustomUSDC",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newImplementation",
        "type": "address"
      }
    ],
    "name": "updateInventoryImplementation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newImplementation",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "upgradeToAndCall",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const satisfies Abi;