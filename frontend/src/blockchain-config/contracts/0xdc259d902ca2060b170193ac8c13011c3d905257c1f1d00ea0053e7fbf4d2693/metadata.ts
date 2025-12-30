import { type ContractSourceCodeMetadata } from "@/blockchain-config/types";

export const metadata = {
  "name": "VieRegistryV1",
  "primaryContract": "code/contracts/VieRegistryV1.sol:VieRegistryV1",
  "abiFile": "abi.ts",
  "methods": {
    "owner()": {
      "details": "Returns the address of the current owner."
    },
    "constructor": {
      "custom:oz-upgrades-unsafe-allow": "constructor"
    },
    "getRegistrars()": {
      "details": "Get all registrars",
      "returns": {
        "_0": "Array of registrar addresses"
      }
    },
    "proxiableUUID()": {
      "details": "Implementation of the ERC-1822 {proxiableUUID} function. This returns the storage slot used by the implementation. It is used to validate the implementation's compatibility when performing an upgrade. IMPORTANT: A proxy pointing at a proxiable contract should not be considered proxiable itself, because this risks bricking a proxy that upgrades to it, by delegating to itself until out of gas. Thus it is critical that this function revert if invoked through a proxy. This is guaranteed by the `notDelegated` modifier."
    },
    "getUserFTs(address)": {
      "params": {
        "user": "The user address"
      },
      "details": "Get all FTs (fungible tokens) for a user"
    },
    "initialize(address)": {
      "params": {
        "_platform": "The platform address that will be the owner"
      },
      "details": "Initialize the registry contract"
    },
    "renounceOwnership()": {
      "details": "Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby disabling any functionality that is only available to the owner."
    },
    "isRegistrar(address)": {
      "params": {
        "registrar": "The address to check"
      },
      "details": "Check if an address is a registrar",
      "returns": {
        "_0": "True if the address is a registrar"
      }
    },
    "registerSFT(address)": {
      "params": {
        "sftAddress": "The address of the SFT contract to register"
      },
      "details": "Register an SFT contract for a user"
    },
    "addRegistrar(address)": {
      "params": {
        "registrar": "The address to add as a registrar"
      },
      "details": "Add a registrar to the set"
    },
    "getFTByPoolId(bytes32)": {
      "params": {
        "poolId": "The pool ID"
      },
      "details": "Get FT by pool ID",
      "returns": {
        "ft": "The FT struct"
      }
    },
    "getUserTokens(address)": {
      "params": {
        "user": "The user address"
      },
      "details": "Get all tokens (both FTs and SFTs) for a user"
    },
    "removeRegistrar(address)": {
      "params": {
        "registrar": "The address to remove as a registrar"
      },
      "details": "Remove a registrar from the set"
    },
    "transferOwnership(address)": {
      "details": "Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner."
    },
    "getFTByTokenAddress(address)": {
      "params": {
        "tokenAddress": "The token address"
      },
      "details": "Get FT by token address",
      "returns": {
        "ft": "The FT struct"
      }
    },
    "getUserSFTAddresses(address)": {
      "params": {
        "user": "The user address"
      },
      "details": "Get all SFT addresses for a user"
    },
    "upgradeToAndCall(address,bytes)": {
      "details": "Upgrade the implementation of the proxy to `newImplementation`, and subsequently execute the function call encoded in `data`. Calls {_authorizeUpgrade}. Emits an {Upgraded} event.",
      "custom:oz-upgrades-unsafe-allow-reachable": "delegatecall"
    },
    "getUserTokensWithSupplies(address)": {
      "params": {
        "user": "The user address"
      },
      "details": "Get all tokens for a user with their supplies"
    },
    "registerToken(address,(address,address,uint24,int24,address))": {
      "params": {
        "poolKey": "The pool key associated with the token",
        "tokenAddress": "The address of the token contract"
      },
      "details": "Register a token with pool key for a user"
    }
  },
  "errors": {
    "FailedCall()": [
      {
        "details": "A call to an address target failed. The target may have reverted."
      }
    ],
    "InvalidPoolId()": [
      {
        "details": "Thrown when pool ID is invalid"
      }
    ],
    "OnlyRegistrar()": [
      {
        "details": "Thrown when caller is not a registrar"
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
  "bytecodeHash": "0xdc259d902ca2060b170193ac8c13011c3d905257c1f1d00ea0053e7fbf4d2693",
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
            }
          },
          "utils": {
            "Address.sol": "",
            "Arrays.sol": "",
            "Comparators.sol": "",
            "Context.sol": "",
            "Errors.sol": "",
            "introspection": {
              "ERC165.sol": "",
              "IERC165.sol": ""
            },
            "math": {
              "Math.sol": "",
              "SafeCast.sol": ""
            },
            "Panic.sol": "",
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
          "IVieRegistryV1.sol": ""
        },
        "VieRegistryV1.sol": ""
      }
    }
  },
} as const satisfies ContractSourceCodeMetadata;