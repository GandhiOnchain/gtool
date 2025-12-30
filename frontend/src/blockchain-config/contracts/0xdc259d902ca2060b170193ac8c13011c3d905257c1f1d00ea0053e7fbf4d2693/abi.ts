import type { Abi } from "viem";

export const abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
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
    "name": "InvalidInitialization",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidPoolId",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotInitializing",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "OnlyRegistrar",
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
        "name": "registrar",
        "type": "address"
      }
    ],
    "name": "RegistrarAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "registrar",
        "type": "address"
      }
    ],
    "name": "RegistrarRemoved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sftAddress",
        "type": "address"
      }
    ],
    "name": "SFTRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "poolId",
        "type": "bytes32"
      }
    ],
    "name": "TokenRegistered",
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
        "name": "registrar",
        "type": "address"
      }
    ],
    "name": "addRegistrar",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "poolId",
        "type": "bytes32"
      }
    ],
    "name": "getFTByPoolId",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "tokenAddress",
            "type": "address"
          },
          {
            "components": [
              {
                "internalType": "Currency",
                "name": "currency0",
                "type": "address"
              },
              {
                "internalType": "Currency",
                "name": "currency1",
                "type": "address"
              },
              {
                "internalType": "uint24",
                "name": "fee",
                "type": "uint24"
              },
              {
                "internalType": "int24",
                "name": "tickSpacing",
                "type": "int24"
              },
              {
                "internalType": "contract IHooks",
                "name": "hooks",
                "type": "address"
              }
            ],
            "internalType": "struct PoolKey",
            "name": "poolKey",
            "type": "tuple"
          },
          {
            "internalType": "bytes32",
            "name": "poolId",
            "type": "bytes32"
          }
        ],
        "internalType": "struct IVieRegistryV1.FT",
        "name": "ft",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      }
    ],
    "name": "getFTByTokenAddress",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "tokenAddress",
            "type": "address"
          },
          {
            "components": [
              {
                "internalType": "Currency",
                "name": "currency0",
                "type": "address"
              },
              {
                "internalType": "Currency",
                "name": "currency1",
                "type": "address"
              },
              {
                "internalType": "uint24",
                "name": "fee",
                "type": "uint24"
              },
              {
                "internalType": "int24",
                "name": "tickSpacing",
                "type": "int24"
              },
              {
                "internalType": "contract IHooks",
                "name": "hooks",
                "type": "address"
              }
            ],
            "internalType": "struct PoolKey",
            "name": "poolKey",
            "type": "tuple"
          },
          {
            "internalType": "bytes32",
            "name": "poolId",
            "type": "bytes32"
          }
        ],
        "internalType": "struct IVieRegistryV1.FT",
        "name": "ft",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getRegistrars",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
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
      }
    ],
    "name": "getUserFTs",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "tokenAddress",
            "type": "address"
          },
          {
            "components": [
              {
                "internalType": "Currency",
                "name": "currency0",
                "type": "address"
              },
              {
                "internalType": "Currency",
                "name": "currency1",
                "type": "address"
              },
              {
                "internalType": "uint24",
                "name": "fee",
                "type": "uint24"
              },
              {
                "internalType": "int24",
                "name": "tickSpacing",
                "type": "int24"
              },
              {
                "internalType": "contract IHooks",
                "name": "hooks",
                "type": "address"
              }
            ],
            "internalType": "struct PoolKey",
            "name": "poolKey",
            "type": "tuple"
          },
          {
            "internalType": "bytes32",
            "name": "poolId",
            "type": "bytes32"
          }
        ],
        "internalType": "struct IVieRegistryV1.FT[]",
        "name": "fts",
        "type": "tuple[]"
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
      }
    ],
    "name": "getUserSFTAddresses",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
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
      }
    ],
    "name": "getUserTokens",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "tokenAddress",
            "type": "address"
          },
          {
            "components": [
              {
                "internalType": "Currency",
                "name": "currency0",
                "type": "address"
              },
              {
                "internalType": "Currency",
                "name": "currency1",
                "type": "address"
              },
              {
                "internalType": "uint24",
                "name": "fee",
                "type": "uint24"
              },
              {
                "internalType": "int24",
                "name": "tickSpacing",
                "type": "int24"
              },
              {
                "internalType": "contract IHooks",
                "name": "hooks",
                "type": "address"
              }
            ],
            "internalType": "struct PoolKey",
            "name": "poolKey",
            "type": "tuple"
          },
          {
            "internalType": "bytes32",
            "name": "poolId",
            "type": "bytes32"
          }
        ],
        "internalType": "struct IVieRegistryV1.FT[]",
        "name": "fts",
        "type": "tuple[]"
      },
      {
        "internalType": "address[]",
        "name": "sftAddresses",
        "type": "address[]"
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
      }
    ],
    "name": "getUserTokensWithSupplies",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "tokenAddress",
            "type": "address"
          },
          {
            "components": [
              {
                "internalType": "Currency",
                "name": "currency0",
                "type": "address"
              },
              {
                "internalType": "Currency",
                "name": "currency1",
                "type": "address"
              },
              {
                "internalType": "uint24",
                "name": "fee",
                "type": "uint24"
              },
              {
                "internalType": "int24",
                "name": "tickSpacing",
                "type": "int24"
              },
              {
                "internalType": "contract IHooks",
                "name": "hooks",
                "type": "address"
              }
            ],
            "internalType": "struct PoolKey",
            "name": "poolKey",
            "type": "tuple"
          },
          {
            "internalType": "bytes32",
            "name": "poolId",
            "type": "bytes32"
          }
        ],
        "internalType": "struct IVieRegistryV1.FT[]",
        "name": "fts",
        "type": "tuple[]"
      },
      {
        "internalType": "address[]",
        "name": "sftAddresses",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "sftSupplies",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_platform",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "registrar",
        "type": "address"
      }
    ],
    "name": "isRegistrar",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
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
        "name": "sftAddress",
        "type": "address"
      }
    ],
    "name": "registerSFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "Currency",
            "name": "currency0",
            "type": "address"
          },
          {
            "internalType": "Currency",
            "name": "currency1",
            "type": "address"
          },
          {
            "internalType": "uint24",
            "name": "fee",
            "type": "uint24"
          },
          {
            "internalType": "int24",
            "name": "tickSpacing",
            "type": "int24"
          },
          {
            "internalType": "contract IHooks",
            "name": "hooks",
            "type": "address"
          }
        ],
        "internalType": "struct PoolKey",
        "name": "poolKey",
        "type": "tuple"
      }
    ],
    "name": "registerToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "registrar",
        "type": "address"
      }
    ],
    "name": "removeRegistrar",
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