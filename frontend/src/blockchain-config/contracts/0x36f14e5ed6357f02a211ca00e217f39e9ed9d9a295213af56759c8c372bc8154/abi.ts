import type { Abi } from "viem";

export const abi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_router",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_poolManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_permit2",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_registry",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_weth",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "name": "ETHTransferFailed",
    "type": "error",
    "inputs": []
  },
  {
    "name": "InvalidInput",
    "type": "error",
    "inputs": []
  },
  {
    "name": "InvalidToken",
    "type": "error",
    "inputs": []
  },
  {
    "name": "ReentrancyGuardReentrantCall",
    "type": "error",
    "inputs": []
  },
  {
    "name": "SwapEthForToken",
    "type": "event",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "token",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "ethAmountIn",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "tokenAmountOut",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "name": "SwapTokenForEth",
    "type": "event",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "token",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "tokenAmountIn",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "ethAmountOut",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "name": "permit2",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IPermit2"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "poolManager",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IPoolManager"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "registry",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IVieRegistryV1"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "router",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IUniversalRouter"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "swapExactEthAmountForToken",
    "type": "function",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "exactEthAmountIn",
        "type": "uint128",
        "internalType": "uint128"
      },
      {
        "name": "minimumTokenAmountOut",
        "type": "uint128",
        "internalType": "uint128"
      }
    ],
    "outputs": [
      {
        "name": "tokenAmountOut",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "name": "swapExactTokenAmountForEth",
    "type": "function",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "exactTokenAmountIn",
        "type": "uint128",
        "internalType": "uint128"
      },
      {
        "name": "minimumEthAmountOut",
        "type": "uint128",
        "internalType": "uint128"
      }
    ],
    "outputs": [
      {
        "name": "ethOut",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "name": "swapExactTokenAmountForEthWithPermitSignature",
    "type": "function",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "exactTokenAmountIn",
        "type": "uint128",
        "internalType": "uint128"
      },
      {
        "name": "minimumEthAmountOut",
        "type": "uint128",
        "internalType": "uint128"
      },
      {
        "name": "sig",
        "type": "tuple",
        "components": [
          {
            "name": "v",
            "type": "uint8",
            "internalType": "uint8"
          },
          {
            "name": "r",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "s",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "deadline",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "internalType": "struct IVieTokenSwapManager.PermitSignaturePayload"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "name": "weth",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IWETH9"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "receive",
    "stateMutability": "payable"
  }
] as const satisfies Abi;