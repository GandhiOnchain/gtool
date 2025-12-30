import { type ContractSourceCodeMetadata } from "@/blockchain-config/types";

export const metadata = {
  "name": "VieFactory",
  "primaryContract": "code/contracts/VieFactory.sol",
  "abiFile": "abi.ts",
  "methods": {},
  "errors": {},
  "bytecodeHash": "0xc27b84c680f54e2239d73c734ed9595e838f4a1f2c9695ac07917bc2c42f732e",
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
            },
            "ERC20": {
              "ERC20Upgradeable.sol": "",
              "extensions": {
                "ERC20BurnableUpgradeable.sol": "",
                "ERC20PermitUpgradeable.sol": ""
              }
            }
          },
          "utils": {
            "ContextUpgradeable.sol": "",
            "cryptography": {
              "EIP712Upgradeable.sol": ""
            },
            "introspection": {
              "ERC165Upgradeable.sol": ""
            },
            "NoncesUpgradeable.sol": ""
          }
        },
        "contracts": {
          "access": {
            "Ownable.sol": ""
          },
          "interfaces": {
            "draft-IERC6093.sol": "",
            "IERC165.sol": "",
            "IERC5267.sol": ""
          },
          "proxy": {
            "Clones.sol": ""
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
            },
            "ERC20": {
              "extensions": {
                "IERC20Metadata.sol": "",
                "IERC20Permit.sol": ""
              },
              "IERC20.sol": ""
            }
          },
          "utils": {
            "Arrays.sol": "",
            "Comparators.sol": "",
            "Context.sol": "",
            "Create2.sol": "",
            "cryptography": {
              "ECDSA.sol": "",
              "MessageHashUtils.sol": ""
            },
            "Errors.sol": "",
            "introspection": {
              "IERC165.sol": ""
            },
            "math": {
              "Math.sol": "",
              "SafeCast.sol": "",
              "SignedMath.sol": ""
            },
            "Panic.sol": "",
            "ReentrancyGuard.sol": "",
            "SlotDerivation.sol": "",
            "StorageSlot.sol": "",
            "Strings.sol": "",
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
        "coin": {
          "interfaces": {
            "IVieTokenPoolHook.sol": ""
          },
          "VieToken.sol": ""
        },
        "interfaces": {
          "IVieRegistryV1.sol": "",
          "IWETH9.sol": ""
        },
        "sft": {
          "interfaces": {
            "IVieSFTMint.sol": "",
            "IVieSFTMintManager.sol": ""
          },
          "VieSFT.sol": ""
        },
        "VieFactory.sol": ""
      }
    }
  },
} as const satisfies ContractSourceCodeMetadata;