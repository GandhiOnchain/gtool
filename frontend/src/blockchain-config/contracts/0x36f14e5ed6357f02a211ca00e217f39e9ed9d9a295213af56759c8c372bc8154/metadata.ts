import { type ContractSourceCodeMetadata } from "@/blockchain-config/types";

export const metadata = {
  "name": "VieTokenSwapManager",
  "primaryContract": "code/contracts/coin/VieTokenSwapManager.sol:VieTokenSwapManager",
  "abiFile": "abi.ts",
  "methods": {
    "constructor": {
      "params": {
        "_weth": "The WETH9 contract address for ETH wrapping/unwrapping",
        "_router": "The Universal Router contract address for executing swaps",
        "_permit2": "The Permit2 contract address for gasless approvals",
        "_registry": "The Vie Registry contract address for token validation",
        "_poolManager": "The Pool Manager contract address for Uniswap V4"
      },
      "details": "All addresses are stored as immutable to save gas on every function call",
      "notice": "Constructor to initialize the swap manager with required contract addresses"
    },
    "swapExactEthAmountForToken(address,uint128,uint128)": {
      "params": {
        "token": "Address of the Vie token to swap for",
        "exactEthAmountIn": "The exact amount of ETH to swap (must equal msg.value)",
        "minimumTokenAmountOut": "The minimum amount of tokens to receive (slippage protection)"
      },
      "returns": {
        "tokenAmountOut": "The actual amount of tokens received"
      },
      "notice": "Swap exact ETH amount for a Vie token"
    },
    "swapExactTokenAmountForEth(address,uint128,uint128)": {
      "params": {
        "token": "Address of the Vie token to swap from",
        "exactTokenAmountIn": "The exact amount of tokens to swap",
        "minimumEthAmountOut": "The minimum amount of ETH to receive (slippage protection)"
      },
      "details": "This function requires the user to have previously approved this contract to spend their tokens See swapExactTokenAmountForEthWithPermitSignature for gasless approval alternative ",
      "returns": {
        "ethOut": "The actual amount of ETH received"
      },
      "notice": "Swap exact Vie token amount for ETH (requires prior approval)"
    },
    "swapExactTokenAmountForEthWithPermitSignature(address,uint128,uint128,(uint8,bytes32,bytes32,uint256))": {
      "params": {
        "sig": "The permit signature components (v, r, s, deadline)",
        "token": "Address of the Vie token to swap from",
        "exactTokenAmountIn": "The exact amount of tokens to swap",
        "minimumEthAmountOut": "The minimum amount of ETH to receive (slippage protection)"
      },
      "details": "This function uses EIP-2612 permit to approve tokens without requiring a separate transaction This provides better UX by eliminating the need for a separate approval transaction ",
      "returns": {
        "_0": "The actual amount of ETH received"
      },
      "notice": "Swap exact Vie token amount for ETH using permit signature (gasless approval)"
    },
    "weth()": {
      "notice": "The WETH9 contract for wrapping/unwrapping ETH"
    },
    "router()": {
      "notice": "The Uniswap Universal Router contract for executing complex multi-step transactions"
    },
    "permit2()": {
      "notice": "The Permit2 contract for gasless approvals and improved UX"
    },
    "registry()": {
      "notice": "The Vie token registry contract that stores pool information and validates tokens"
    },
    "poolManager()": {
      "notice": "The Uniswap V4 Pool Manager contract that manages all pools in the singleton"
    }
  },
  "errors": {
    "ReentrancyGuardReentrantCall()": [
      {
        "details": "Unauthorized reentrant call."
      }
    ]
  },
  "bytecodeHash": "0x36f14e5ed6357f02a211ca00e217f39e9ed9d9a295213af56759c8c372bc8154",
  "contractFileTree": {
    "code": {
      "@openzeppelin": {
        "contracts": {
          "token": {
            "ERC20": {
              "extensions": {
                "IERC20Permit.sol": ""
              },
              "IERC20.sol": ""
            }
          },
          "utils": {
            "ReentrancyGuard.sol": ""
          }
        }
      },
      "@uniswap": {
        "v4-core": {
          "src": {
            "interfaces": {
              "external": {
                "IERC20Minimal.sol": "",
                "IERC6909Claims.sol": ""
              },
              "IExtsload.sol": "",
              "IExttload.sol": "",
              "IHooks.sol": "",
              "IPoolManager.sol": "",
              "IProtocolFees.sol": ""
            },
            "libraries": {
              "CustomRevert.sol": "",
              "FixedPoint128.sol": "",
              "FullMath.sol": "",
              "LiquidityMath.sol": "",
              "Position.sol": "",
              "SafeCast.sol": "",
              "StateLibrary.sol": ""
            },
            "types": {
              "BalanceDelta.sol": "",
              "BeforeSwapDelta.sol": "",
              "Currency.sol": "",
              "PoolId.sol": "",
              "PoolKey.sol": "",
              "PoolOperation.sol": ""
            }
          }
        },
        "v4-periphery": {
          "src": {
            "interfaces": {
              "IImmutableState.sol": "",
              "IV4Router.sol": ""
            },
            "libraries": {
              "ActionConstants.sol": "",
              "Actions.sol": "",
              "PathKey.sol": ""
            }
          }
        }
      },
      "contracts": {
        "coin": {
          "interfaces": {
            "IUniversalRouter.sol": "",
            "IVieTokenSwapManager.sol": ""
          },
          "libraries": {
            "Commands.sol": ""
          },
          "VieTokenSwapManager.sol": ""
        },
        "interfaces": {
          "external": {
            "IAllowanceTransfer.sol": "",
            "IEIP712.sol": "",
            "IPermit2.sol": "",
            "ISignatureTransfer.sol": ""
          },
          "IVieRegistryV1.sol": "",
          "IWETH9.sol": ""
        }
      }
    }
  },
} as const satisfies ContractSourceCodeMetadata;