import { type ContractSourceCodeMetadata } from "@/blockchain-config/types";

export const metadata = {
  "name": "VieVault",
  "primaryContract": "code/contracts/VieVault.sol",
  "abiFile": "abi.ts",
  "methods": {},
  "errors": {},
  "bytecodeHash": "0xf342055e9118e560d673c4629c912225f3315ed78d1b5909fce5fafa14cad662",
  "contractFileTree": {
    "code": {
      "@openzeppelin": {
        "contracts": {
          "access": {
            "Ownable.sol": ""
          },
          "interfaces": {
            "IERC1363.sol": "",
            "IERC165.sol": "",
            "IERC20.sol": ""
          },
          "token": {
            "ERC20": {
              "IERC20.sol": "",
              "utils": {
                "SafeERC20.sol": ""
              }
            }
          },
          "utils": {
            "Arrays.sol": "",
            "Comparators.sol": "",
            "Context.sol": "",
            "introspection": {
              "IERC165.sol": ""
            },
            "math": {
              "Math.sol": "",
              "SafeCast.sol": ""
            },
            "Panic.sol": "",
            "ReentrancyGuard.sol": "",
            "SlotDerivation.sol": "",
            "StorageSlot.sol": "",
            "structs": {
              "EnumerableSet.sol": ""
            }
          }
        }
      },
      "@uniswap": {
        "v4-core": {
          "src": {
            "interfaces": {
              "external": {
                "IERC20Minimal.sol": ""
              },
              "IHooks.sol": ""
            },
            "libraries": {
              "CustomRevert.sol": "",
              "SafeCast.sol": ""
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
        }
      },
      "contracts": {
        "interfaces": {
          "IVieVault.sol": "",
          "IWETH9.sol": ""
        },
        "VieVault.sol": ""
      }
    }
  },
} as const satisfies ContractSourceCodeMetadata;