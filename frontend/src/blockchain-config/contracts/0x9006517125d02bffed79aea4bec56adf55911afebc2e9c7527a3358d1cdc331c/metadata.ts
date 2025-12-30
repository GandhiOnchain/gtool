import { type ContractSourceCodeMetadata } from "@/blockchain-config/types";

export const metadata = {
  "name": "ViePredictionMarketUSDCV1",
  "primaryContract": "code/contracts/prediction-market/ViePredictionMarketUSDCV1.sol",
  "abiFile": "abi.ts",
  "methods": {},
  "errors": {},
  "bytecodeHash": "0x9006517125d02bffed79aea4bec56adf55911afebc2e9c7527a3358d1cdc331c",
  "contractFileTree": {
    "code": {
      "@openzeppelin": {
        "contracts-upgradeable": {
          "access": {
            "OwnableUpgradeable.sol": ""
          },
          "proxy": {
            "utils": {
              "Initializable.sol": "",
              "UUPSUpgradeable.sol": ""
            }
          },
          "utils": {
            "ContextUpgradeable.sol": ""
          }
        },
        "contracts": {
          "interfaces": {
            "draft-IERC1822.sol": "",
            "draft-IERC6093.sol": "",
            "IERC1967.sol": ""
          },
          "proxy": {
            "beacon": {
              "IBeacon.sol": ""
            },
            "Clones.sol": "",
            "ERC1967": {
              "ERC1967Utils.sol": ""
            }
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
            },
            "ERC20": {
              "extensions": {
                "IERC20Permit.sol": ""
              },
              "IERC20.sol": ""
            }
          },
          "utils": {
            "Address.sol": "",
            "Arrays.sol": "",
            "Base64.sol": "",
            "Comparators.sol": "",
            "Context.sol": "",
            "Create2.sol": "",
            "Errors.sol": "",
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
          "VieMarketInventory.sol": "",
          "ViePredictionMarketUSDCV1.sol": ""
        }
      },
      "solady": {
        "src": {
          "utils": {
            "FixedPointMathLib.sol": ""
          }
        }
      }
    }
  }
} as const satisfies ContractSourceCodeMetadata;