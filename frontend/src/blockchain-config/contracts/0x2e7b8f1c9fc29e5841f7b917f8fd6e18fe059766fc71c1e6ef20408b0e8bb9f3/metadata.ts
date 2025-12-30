import { type ContractSourceCodeMetadata } from "@/blockchain-config/types";

export const metadata = {
  "name": "VieToken",
  "primaryContract": "code/contracts/coin/VieToken.sol",
  "abiFile": "abi.ts",
  "methods": {},
  "errors": {},
  "bytecodeHash": "0x2e7b8f1c9fc29e5841f7b917f8fd6e18fe059766fc71c1e6ef20408b0e8bb9f3",
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
            "NoncesUpgradeable.sol": ""
          }
        },
        "contracts": {
          "interfaces": {
            "draft-IERC6093.sol": "",
            "IERC165.sol": "",
            "IERC5267.sol": ""
          },
          "token": {
            "ERC20": {
              "extensions": {
                "IERC20Metadata.sol": "",
                "IERC20Permit.sol": ""
              },
              "IERC20.sol": ""
            }
          },
          "utils": {
            "cryptography": {
              "ECDSA.sol": "",
              "MessageHashUtils.sol": ""
            },
            "introspection": {
              "IERC165.sol": ""
            },
            "math": {
              "Math.sol": "",
              "SafeCast.sol": "",
              "SignedMath.sol": ""
            },
            "Panic.sol": "",
            "Strings.sol": ""
          }
        }
      },
      "contracts": {
        "coin": {
          "VieToken.sol": ""
        }
      }
    }
  },
} as const satisfies ContractSourceCodeMetadata;
