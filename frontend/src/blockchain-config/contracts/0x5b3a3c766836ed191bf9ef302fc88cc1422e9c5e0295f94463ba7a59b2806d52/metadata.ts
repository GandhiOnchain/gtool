import { type ContractSourceCodeMetadata } from "@/blockchain-config/types";

export const metadata = {
  "name": "USDC",
  "primaryContract": "code//Users/aloysius.chan/Repositories/circlefin/stablecoin-evm-private-usdc-mainnet-base/contracts/v2/FiatTokenV2_2.sol:FiatTokenV2_2",
  "abiFile": "abi.ts",
  "methods": {
    "owner()": {
      "details": "Tells the address of the owner",
      "returns": {
        "_0": "the address of the owner"
      }
    },
    "pause()": {
      "details": "called by the owner to pause, triggers stopped state"
    },
    "rescuer()": {
      "returns": {
        "_0": "Rescuer's address"
      },
      "notice": "Returns current rescuer"
    },
    "unpause()": {
      "details": "called by the owner to unpause, returns to normal state"
    },
    "version()": {
      "returns": {
        "_0": "Version string"
      },
      "notice": "Version string for the EIP712 domain separator"
    },
    "burn(uint256)": {
      "params": {
        "_amount": "the amount of tokens to be burned."
      },
      "details": "The caller must be a minter, must not be blacklisted, and the amount to burn should be less than or equal to the account's balance.",
      "notice": "Allows a minter to burn some of its own tokens."
    },
    "totalSupply()": {
      "returns": {
        "_0": "The totalSupply of the fiat token."
      },
      "notice": "Gets the totalSupply of the fiat token."
    },
    "nonces(address)": {
      "params": {
        "owner": "Token owner's address (Authorizer)"
      },
      "returns": {
        "_0": "Next nonce"
      },
      "notice": "Nonces for permit"
    },
    "isMinter(address)": {
      "params": {
        "account": "The address to check."
      },
      "returns": {
        "_0": "True if the account is a minter, false if the account is not a minter."
      },
      "notice": "Checks if an account is a minter."
    },
    "DOMAIN_SEPARATOR()": {
      "returns": {
        "_0": "The bytes32 EIP712 domain separator."
      },
      "notice": "Get the EIP712 Domain Separator."
    },
    "balanceOf(address)": {
      "params": {
        "account": "The address to check."
      },
      "returns": {
        "_0": "balance The fiat token balance of the account."
      },
      "notice": "Gets the fiat token balance of an account."
    },
    "blacklist(address)": {
      "params": {
        "_account": "The address to blacklist."
      },
      "notice": "Adds account to blacklist."
    },
    "initializeV2(string)": {
      "params": {
        "newName": "New token name"
      },
      "notice": "Initialize v2"
    },
    "unBlacklist(address)": {
      "params": {
        "_account": "The address to remove from the blacklist."
      },
      "notice": "Removes account from blacklist."
    },
    "mint(address,uint256)": {
      "params": {
        "_to": "The address that will receive the minted tokens.",
        "_amount": "The amount of tokens to mint. Must be less than or equal to the minterAllowance of the caller."
      },
      "returns": {
        "_0": "True if the operation was successful."
      },
      "notice": "Mints fiat tokens to an address."
    },
    "removeMinter(address)": {
      "params": {
        "minter": "The address of the minter to remove."
      },
      "returns": {
        "_0": "True if the operation was successful."
      },
      "notice": "Removes a minter."
    },
    "updatePauser(address)": {
      "params": {
        "_newPauser": "The address of the new pauser."
      },
      "notice": "Updates the pauser address."
    },
    "isBlacklisted(address)": {
      "params": {
        "_account": "The address to check."
      },
      "returns": {
        "_0": "True if the account is blacklisted, false if the account is not blacklisted."
      },
      "notice": "Checks if account is blacklisted."
    },
    "updateRescuer(address)": {
      "params": {
        "newRescuer": "The address of the new rescuer."
      },
      "notice": "Updates the rescuer address."
    },
    "initializeV2_1(address)": {
      "params": {
        "lostAndFound": "The address to which the locked funds are sent"
      },
      "notice": "Initialize v2.1"
    },
    "approve(address,uint256)": {
      "params": {
        "value": "The allowance amount.",
        "spender": "The spender's address."
      },
      "returns": {
        "_0": "True if the operation was successful."
      },
      "notice": "Sets a fiat token allowance for a spender to spend on behalf of the caller."
    },
    "minterAllowance(address)": {
      "params": {
        "minter": "The address to check."
      },
      "returns": {
        "_0": "The remaining minter allowance for the account."
      },
      "notice": "Gets the minter allowance for an account."
    },
    "transfer(address,uint256)": {
      "params": {
        "to": "Payee's address.",
        "value": "Transfer amount."
      },
      "returns": {
        "_0": "True if the operation was successful."
      },
      "notice": "Transfers tokens from the caller."
    },
    "allowance(address,address)": {
      "params": {
        "owner": "The token owner's address.",
        "spender": "The spender's address."
      },
      "returns": {
        "_0": "The remaining allowance."
      },
      "notice": "Gets the remaining amount of fiat tokens a spender is allowed to transfer on behalf of the token owner."
    },
    "transferOwnership(address)": {
      "params": {
        "newOwner": "The address to transfer ownership to."
      },
      "details": "Allows the current owner to transfer control of the contract to a newOwner."
    },
    "updateBlacklister(address)": {
      "params": {
        "_newBlacklister": "The address of the new blacklister."
      },
      "notice": "Updates the blacklister address."
    },
    "updateMasterMinter(address)": {
      "params": {
        "_newMasterMinter": "The address of the new master minter."
      },
      "notice": "Updates the master minter address."
    },
    "configureMinter(address,uint256)": {
      "params": {
        "minter": "The address of the minter.",
        "minterAllowedAmount": "The minting amount allowed for the minter."
      },
      "returns": {
        "_0": "True if the operation was successful."
      },
      "notice": "Adds or updates a new minter with a mint allowance."
    },
    "initializeV2_2(address[],string)": {
      "params": {
        "newSymbol": "New token symbol data structure to the new blacklist data structure.",
        "accountsToBlacklist": "A list of accounts to migrate from the old blacklist"
      },
      "notice": "Initialize v2.2"
    },
    "decreaseAllowance(address,uint256)": {
      "params": {
        "spender": "Spender's address",
        "decrement": "Amount of decrease in allowance"
      },
      "returns": {
        "_0": "True if successful"
      },
      "notice": "Decrease the allowance by a given decrement"
    },
    "increaseAllowance(address,uint256)": {
      "params": {
        "spender": "Spender's address",
        "increment": "Amount of increase in allowance"
      },
      "returns": {
        "_0": "True if successful"
      },
      "notice": "Increase the allowance by a given increment"
    },
    "authorizationState(address,bytes32)": {
      "params": {
        "nonce": "Nonce of the authorization",
        "authorizer": "Authorizer's address"
      },
      "details": "Nonces are randomly generated 32-byte data unique to the authorizer's address",
      "returns": {
        "_0": "True if the nonce is used"
      },
      "notice": "Returns the state of an authorization"
    },
    "rescueERC20(address,address,uint256)": {
      "params": {
        "to": "Recipient address",
        "amount": "Amount to withdraw",
        "tokenContract": "ERC20 token contract address"
      },
      "notice": "Rescue ERC20 tokens locked up in this contract."
    },
    "transferFrom(address,address,uint256)": {
      "params": {
        "to": "Payee's address.",
        "from": "Payer's address.",
        "value": "Transfer amount."
      },
      "details": "The caller must have some fiat token allowance on the payer's tokens.",
      "returns": {
        "_0": "True if the operation was successful."
      },
      "notice": "Transfers tokens from an address to another by spending the caller's allowance."
    },
    "cancelAuthorization(address,bytes32,bytes)": {
      "params": {
        "nonce": "Nonce of the authorization",
        "signature": "Signature bytes signed by an EOA wallet or a contract wallet",
        "authorizer": "Authorizer's address"
      },
      "details": "Works only if the authorization is not yet used. EOA wallet signatures should be packed in the order of r, s, v.",
      "notice": "Attempt to cancel an authorization"
    },
    "permit(address,address,uint256,uint256,bytes)": {
      "params": {
        "owner": "Token owner's address (Authorizer)",
        "value": "Amount of allowance",
        "spender": "Spender's address",
        "deadline": "The time at which the signature expires (unix time), or max uint256 value to signal no expiration",
        "signature": "Signature bytes signed by an EOA wallet or a contract wallet"
      },
      "details": "EOA wallet signatures should be packed in the order of r, s, v.",
      "notice": "Update allowance with a signed permit"
    },
    "cancelAuthorization(address,bytes32,uint8,bytes32,bytes32)": {
      "params": {
        "r": "r of the signature",
        "s": "s of the signature",
        "v": "v of the signature",
        "nonce": "Nonce of the authorization",
        "authorizer": "Authorizer's address"
      },
      "details": "Works only if the authorization is not yet used.",
      "notice": "Attempt to cancel an authorization"
    },
    "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)": {
      "params": {
        "r": "r of the signature",
        "s": "s of the signature",
        "v": "v of the signature",
        "owner": "Token owner's address (Authorizer)",
        "value": "Amount of allowance",
        "spender": "Spender's address",
        "deadline": "The time at which the signature expires (unix time), or max uint256 value to signal no expiration"
      },
      "notice": "Update allowance with a signed permit"
    },
    "initialize(string,string,string,uint8,address,address,address,address)": {
      "params": {
        "newOwner": "The owner of the fiat token.",
        "newPauser": "The pauser address for the fiat token.",
        "tokenName": "The name of the fiat token.",
        "tokenSymbol": "The symbol of the fiat token.",
        "tokenCurrency": "The fiat currency that the token represents.",
        "tokenDecimals": "The number of decimals that the token uses.",
        "newBlacklister": "The blacklister address for the fiat token.",
        "newMasterMinter": "The masterMinter address for the fiat token."
      },
      "notice": "Initializes the fiat token contract."
    },
    "receiveWithAuthorization(address,address,uint256,uint256,uint256,bytes32,bytes)": {
      "params": {
        "to": "Payee's address",
        "from": "Payer's address (Authorizer)",
        "nonce": "Unique nonce",
        "value": "Amount to be transferred",
        "signature": "Signature bytes signed by an EOA wallet or a contract wallet",
        "validAfter": "The time after which this is valid (unix time)",
        "validBefore": "The time before which this is valid (unix time)"
      },
      "details": "This has an additional check to ensure that the payee's address matches the caller of this function to prevent front-running attacks. EOA wallet signatures should be packed in the order of r, s, v.",
      "notice": "Receive a transfer with a signed authorization from the payer"
    },
    "transferWithAuthorization(address,address,uint256,uint256,uint256,bytes32,bytes)": {
      "params": {
        "to": "Payee's address",
        "from": "Payer's address (Authorizer)",
        "nonce": "Unique nonce",
        "value": "Amount to be transferred",
        "signature": "Signature bytes signed by an EOA wallet or a contract wallet",
        "validAfter": "The time after which this is valid (unix time)",
        "validBefore": "The time before which this is valid (unix time)"
      },
      "details": "EOA wallet signatures should be packed in the order of r, s, v.",
      "notice": "Execute a transfer with a signed authorization"
    },
    "receiveWithAuthorization(address,address,uint256,uint256,uint256,bytes32,uint8,bytes32,bytes32)": {
      "params": {
        "r": "r of the signature",
        "s": "s of the signature",
        "v": "v of the signature",
        "to": "Payee's address",
        "from": "Payer's address (Authorizer)",
        "nonce": "Unique nonce",
        "value": "Amount to be transferred",
        "validAfter": "The time after which this is valid (unix time)",
        "validBefore": "The time before which this is valid (unix time)"
      },
      "details": "This has an additional check to ensure that the payee's address matches the caller of this function to prevent front-running attacks.",
      "notice": "Receive a transfer with a signed authorization from the payer"
    },
    "transferWithAuthorization(address,address,uint256,uint256,uint256,bytes32,uint8,bytes32,bytes32)": {
      "params": {
        "r": "r of the signature",
        "s": "s of the signature",
        "v": "v of the signature",
        "to": "Payee's address",
        "from": "Payer's address (Authorizer)",
        "nonce": "Unique nonce",
        "value": "Amount to be transferred",
        "validAfter": "The time after which this is valid (unix time)",
        "validBefore": "The time before which this is valid (unix time)"
      },
      "notice": "Execute a transfer with a signed authorization"
    }
  },
  "errors": {},
  "bytecodeHash": "0x5b3a3c766836ed191bf9ef302fc88cc1422e9c5e0295f94463ba7a59b2806d52",
  "contractFileTree": {
    "code": {
      "@openzeppelin": {
        "contracts": {
          "math": {
            "SafeMath.sol": ""
          },
          "utils": {
            "Address.sol": ""
          },
          "token": {
            "ERC20": {
              "IERC20.sol": "",
              "SafeERC20.sol": ""
            }
          }
        }
      },
      "": {
        "Users": {
          "aloysius.chan": {
            "Repositories": {
              "circlefin": {
                "stablecoin-evm-private-usdc-mainnet-base": {
                  "contracts": {
                    "v1": {
                      "Ownable.sol": "",
                      "Pausable.sol": "",
                      "FiatTokenV1.sol": "",
                      "Blacklistable.sol": "",
                      "AbstractFiatTokenV1.sol": ""
                    },
                    "v2": {
                      "EIP2612.sol": "",
                      "EIP3009.sol": "",
                      "FiatTokenV2.sol": "",
                      "EIP712Domain.sol": "",
                      "FiatTokenV2_1.sol": "",
                      "FiatTokenV2_2.sol": "",
                      "AbstractFiatTokenV2.sol": ""
                    },
                    "util": {
                      "EIP712.sol": "",
                      "ECRecover.sol": "",
                      "MessageHashUtils.sol": "",
                      "SignatureChecker.sol": ""
                    },
                    "v1.1": {
                      "Rescuable.sol": "",
                      "FiatTokenV1_1.sol": ""
                    },
                    "interface": {
                      "IERC1271.sol": ""
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
} as const satisfies ContractSourceCodeMetadata;