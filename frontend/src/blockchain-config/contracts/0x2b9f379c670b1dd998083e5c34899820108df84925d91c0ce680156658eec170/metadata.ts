import { type ContractSourceCodeMetadata } from "@/blockchain-config/types";

export const metadata = {
  "name": "VieSFTMintManagerV1",
  "primaryContract": "code/contracts/sft/VieSFTMintManagerV1.sol:VieSFTMintManagerV1",
  "abiFile": "abi.ts",
  "methods": {
    "owner()": {
      "details": "Returns the address of the current owner."
    },
    "constructor": {
      "custom:oz-upgrades-unsafe-allow": "constructor"
    },
    "proxiableUUID()": {
      "details": "Implementation of the ERC-1822 {proxiableUUID} function. This returns the storage slot used by the implementation. It is used to validate the implementation's compatibility when performing an upgrade. IMPORTANT: A proxy pointing at a proxiable contract should not be considered proxiable itself, because this risks bricking a proxy that upgrades to it, by delegating to itself until out of gas. Thus it is critical that this function revert if invoked through a proxy. This is guaranteed by the `notDelegated` modifier."
    },
    "renounceOwnership()": {
      "details": "Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby disabling any functionality that is only available to the owner."
    },
    "getSale(address,uint256)": {
      "params": {
        "tokenId": "The token ID",
        "sftContractAddress": "The SFT contract address"
      },
      "details": "Get sale details by contract address and token ID",
      "returns": {
        "_0": "The sale details"
      }
    },
    "transferOwnership(address)": {
      "details": "Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner."
    },
    "isSaleActive(address,uint256)": {
      "params": {
        "tokenId": "The token ID",
        "sftContractAddress": "The SFT contract address"
      },
      "details": "Check if a sale is active by contract address and token ID",
      "returns": {
        "_0": "True if the sale is active"
      }
    },
    "upgradeToAndCall(address,bytes)": {
      "details": "Upgrade the implementation of the proxy to `newImplementation`, and subsequently execute the function call encoded in `data`. Calls {_authorizeUpgrade}. Emits an {Upgraded} event.",
      "custom:oz-upgrades-unsafe-allow-reachable": "delegatecall"
    },
    "mintSft(address,uint256,uint256,address)": {
      "params": {
        "tokenId": "The token ID",
        "numToMint": "The number of tokens to mint",
        "sftContractAddress": "The SFT contract address"
      },
      "details": "Mint SFT tokens by paying the sale price"
    },
    "createFixedPricePublicSale(address,uint256,(address,uint48,uint48,uint248,bool))": {
      "params": {
        "sale": "The sale details",
        "tokenId": "The token ID",
        "sftContractAddress": "The SFT contract address"
      },
      "details": "Create a fixed price public sale for an SFT"
    }
  },
  "errors": {
    "FailedCall()": [
      {
        "details": "A call to an address target failed. The target may have reverted."
      }
    ],
    "NotInitializing()": [
      {
        "details": "The contract is not initializing."
      }
    ],
    "ERC1967NonPayable()": [
      {
        "details": "An upgrade function sees `msg.value > 0` that may be lost."
      }
    ],
    "InvalidInitialization()": [
      {
        "details": "The contract is already initialized."
      }
    ],
    "AddressEmptyCode(address)": [
      {
        "details": "There's no code at `target` (it is not a contract)."
      }
    ],
    "OwnableInvalidOwner(address)": [
      {
        "details": "The owner is not a valid owner account. (eg. `address(0)`)"
      }
    ],
    "UUPSUnauthorizedCallContext()": [
      {
        "details": "The call is from an unauthorized context."
      }
    ],
    "OwnableUnauthorizedAccount(address)": [
      {
        "details": "The caller account is not authorized to perform an operation."
      }
    ],
    "ERC1967InvalidImplementation(address)": [
      {
        "details": "The `implementation` of the proxy is invalid."
      }
    ],
    "UUPSUnsupportedProxiableUUID(bytes32)": [
      {
        "details": "The storage `slot` is unsupported as a UUID."
      }
    ]
  },
  "bytecodeHash": "0x2b9f379c670b1dd998083e5c34899820108df84925d91c0ce680156658eec170",
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
            "IERC1363.sol": "",
            "IERC165.sol": "",
            "IERC1967.sol": "",
            "IERC20.sol": ""
          },
          "proxy": {
            "beacon": {
              "IBeacon.sol": ""
            },
            "ERC1967": {
              "ERC1967Utils.sol": ""
            }
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
            "Address.sol": "",
            "Errors.sol": "",
            "introspection": {
              "IERC165.sol": ""
            },
            "StorageSlot.sol": ""
          }
        }
      },
      "contracts": {
        "sft": {
          "interfaces": {
            "IVieSFTMint.sol": "",
            "IVieSFTMintManager.sol": ""
          },
          "VieSFTMintManagerV1.sol": ""
        }
      }
    }
  },
} as const satisfies ContractSourceCodeMetadata;