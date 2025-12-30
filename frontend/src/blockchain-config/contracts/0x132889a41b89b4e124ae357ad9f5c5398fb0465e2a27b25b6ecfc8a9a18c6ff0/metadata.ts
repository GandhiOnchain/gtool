import { type ContractSourceCodeMetadata } from "@/blockchain-config/types";

export const metadata = {
  "name": "PoolManager",
  "primaryContract": "code/lib/v4-core/src/PoolManager.sol:PoolManager",
  "abiFile": "abi.ts",
  "methods": {
    "settle()": {
      "returns": {
        "_0": "The amount of currency settled"
      },
      "notice": "Called by the user to pay what is owed"
    },
    "sync(address)": {
      "details": "This MUST be called before any ERC20 tokens are sent into the contract, but can be skipped for native tokens because the amount to settle is determined by the sent value. However, if an ERC20 token has been synced and not settled, and the caller instead wants to settle native funds, this function can be called with the native currency to then be able to settle the native currency",
      "notice": "Writes the current ERC20 balance of the specified currency to transient storage This is used to checkpoint balances for the manager and derive deltas for the caller."
    },
    "unlock(bytes)": {
      "params": {
        "data": "Any data to pass to the callback, via `IUnlockCallback(msg.sender).unlockCallback(data)`"
      },
      "details": "The only functions callable without an unlocking are `initialize` and `updateDynamicLPFee`",
      "returns": {
        "result": "The data returned by the call to `IUnlockCallback(msg.sender).unlockCallback(data)`"
      },
      "notice": "All interactions on the contract that account deltas require unlocking. A caller that calls `unlock` must implement `IUnlockCallback(msg.sender).unlockCallback(data)`, where they interact with the remaining functions on this contract."
    },
    "extsload(bytes32)": {
      "params": {
        "slot": "Key of slot to sload"
      },
      "returns": {
        "_0": "The value of the slot as bytes32"
      },
      "notice": "Called by external contracts to access granular pool state"
    },
    "exttload(bytes32)": {
      "params": {
        "slot": "Key of slot to tload"
      },
      "returns": {
        "_0": "The value of the slot as bytes32"
      },
      "notice": "Called by external contracts to access transient storage of the contract"
    },
    "settleFor(address)": {
      "params": {
        "recipient": "The address to credit for the payment"
      },
      "returns": {
        "_0": "The amount of currency settled"
      },
      "notice": "Called by the user to pay on behalf of another address"
    },
    "extsload(bytes32[])": {
      "params": {
        "slots": "List of slots to SLOAD from."
      },
      "returns": {
        "_0": "List of loaded values."
      },
      "notice": "Called by external contracts to access sparse pool state"
    },
    "exttload(bytes32[])": {
      "params": {
        "slots": "List of slots to tload"
      },
      "returns": {
        "_0": "List of loaded values"
      },
      "notice": "Called by external contracts to access sparse transient pool state"
    },
    "clear(address,uint256)": {
      "details": "This could be used to clear a balance that is considered dust. Additionally, the amount must be the exact positive balance. This is to enforce that the caller is aware of the amount being cleared.",
      "notice": "WARNING - Any currency that is cleared, will be non-retrievable, and locked in the contract permanently. A call to clear will zero out a positive balance WITHOUT a corresponding transfer."
    },
    "extsload(bytes32,uint256)": {
      "params": {
        "nSlots": "Number of slots to load into return value",
        "startSlot": "Key of slot to start sloading from"
      },
      "returns": {
        "_0": "List of loaded values."
      },
      "notice": "Called by external contracts to access granular pool state"
    },
    "setOperator(address,bool)": {
      "params": {
        "approved": "The approval status.",
        "operator": "The address of the operator."
      },
      "returns": {
        "_0": "bool True, always"
      },
      "notice": "Sets or removes an operator for the caller."
    },
    "burn(address,uint256,uint256)": {
      "params": {
        "id": "The currency address to burn from ERC6909s, as a uint256",
        "from": "The address to burn the tokens from",
        "amount": "The amount of currency to burn"
      },
      "details": "The id is converted to a uint160 to correspond to a currency address If the upper 12 bytes are not 0, they will be 0-ed out",
      "notice": "Called by the user to move value from ERC6909 balance"
    },
    "mint(address,uint256,uint256)": {
      "params": {
        "id": "The currency address to mint to ERC6909s, as a uint256",
        "to": "The address to mint the tokens to",
        "amount": "The amount of currency to mint"
      },
      "details": "The id is converted to a uint160 to correspond to a currency address If the upper 12 bytes are not 0, they will be 0-ed out",
      "notice": "Called by the user to move value into ERC6909 balance"
    },
    "take(address,address,uint256)": {
      "params": {
        "to": "The address to withdraw to",
        "amount": "The amount of currency to withdraw",
        "currency": "The currency to withdraw from the pool manager"
      },
      "details": "Will revert if the requested amount is not available, consider using `mint` insteadCan also be used as a mechanism for free flash loans",
      "notice": "Called by the user to net out some value owed to the user"
    },
    "approve(address,uint256,uint256)": {
      "params": {
        "id": "The id of the token.",
        "amount": "The amount of the token.",
        "spender": "The address of the spender."
      },
      "returns": {
        "_0": "bool True, always"
      },
      "notice": "Approves an amount of an id to a spender."
    },
    "setProtocolFeeController(address)": {
      "params": {
        "controller": "The new protocol fee controller"
      },
      "notice": "Sets the protocol fee controller"
    },
    "transfer(address,uint256,uint256)": {
      "params": {
        "id": "The id of the token.",
        "amount": "The amount of the token.",
        "receiver": "The address of the receiver."
      },
      "returns": {
        "_0": "bool True, always, unless the function reverts"
      },
      "notice": "Transfers an amount of an id from the caller to a receiver."
    },
    "collectProtocolFees(address,address,uint256)": {
      "params": {
        "amount": "The amount of currency to withdraw",
        "currency": "The currency to withdraw",
        "recipient": "The address to receive the protocol fees"
      },
      "details": "This will revert if the contract is unlocked",
      "returns": {
        "amountCollected": "The amount of currency successfully withdrawn"
      },
      "notice": "Collects the protocol fees for a given recipient and currency, returning the amount collected"
    },
    "transferFrom(address,address,uint256,uint256)": {
      "params": {
        "id": "The id of the token.",
        "amount": "The amount of the token.",
        "sender": "The address of the sender.",
        "receiver": "The address of the receiver."
      },
      "returns": {
        "_0": "bool True, always, unless the function reverts"
      },
      "notice": "Transfers an amount of an id from a sender to a receiver."
    },
    "initialize((address,address,uint24,int24,address),uint160)": {
      "params": {
        "key": "The pool key for the pool to initialize",
        "sqrtPriceX96": "The initial square root price"
      },
      "details": "A swap fee totaling MAX_SWAP_FEE (100%) makes exact output swaps impossible since the input is entirely consumed by the fee",
      "returns": {
        "tick": "The initial tick of the pool"
      },
      "notice": "Initialize the state for a given pool ID"
    },
    "setProtocolFee((address,address,uint24,int24,address),uint24)": {
      "params": {
        "key": "The key of the pool to set a protocol fee for",
        "newProtocolFee": "The fee to set"
      },
      "notice": "Sets the protocol fee for the given pool"
    },
    "updateDynamicLPFee((address,address,uint24,int24,address),uint24)": {
      "params": {
        "key": "The key of the pool to update dynamic LP fees for",
        "newDynamicLPFee": "The new dynamic pool LP fee"
      },
      "details": "A swap fee totaling MAX_SWAP_FEE (100%) makes exact output swaps impossible since the input is entirely consumed by the fee",
      "notice": "Updates the pools lp fees for the a pool that has enabled dynamic lp fees."
    },
    "donate((address,address,uint24,int24,address),uint256,uint256,bytes)": {
      "params": {
        "key": "The key of the pool to donate to",
        "amount0": "The amount of currency0 to donate",
        "amount1": "The amount of currency1 to donate",
        "hookData": "The data to pass through to the donate hooks"
      },
      "details": "Calls to donate can be frontrun adding just-in-time liquidity, with the aim of receiving a portion donated funds. Donors should keep this in mind when designing donation mechanisms.This function donates to in-range LPs at slot0.tick. In certain edge-cases of the swap algorithm, the `sqrtPrice` of a pool can be at the lower boundary of tick `n`, but the `slot0.tick` of the pool is already `n - 1`. In this case a call to `donate` would donate to tick `n - 1` (slot0.tick) not tick `n` (getTickAtSqrtPrice(slot0.sqrtPriceX96)). Read the comments in `Pool.swap()` for more information about this.",
      "returns": {
        "delta": "BalanceDelta The delta of the caller after the donate"
      },
      "notice": "Donate the given currency amounts to the in-range liquidity providers of a pool"
    },
    "swap((address,address,uint24,int24,address),(bool,int256,uint160),bytes)": {
      "params": {
        "key": "The pool to swap in",
        "params": "The parameters for swapping",
        "hookData": "The data to pass through to the swap hooks"
      },
      "details": "Swapping on low liquidity pools may cause unexpected swap amounts when liquidity available is less than amountSpecified. Additionally note that if interacting with hooks that have the BEFORE_SWAP_RETURNS_DELTA_FLAG or AFTER_SWAP_RETURNS_DELTA_FLAG the hook may alter the swap input/output. Integrators should perform checks on the returned swapDelta.",
      "returns": {
        "swapDelta": "The balance delta of the address swapping"
      },
      "notice": "Swap against the given pool"
    },
    "modifyLiquidity((address,address,uint24,int24,address),(int24,int24,int256,bytes32),bytes)": {
      "params": {
        "key": "The pool to modify liquidity in",
        "params": "The parameters for modifying the liquidity",
        "hookData": "The data to pass through to the add/removeLiquidity hooks"
      },
      "details": "Poke by calling with a zero liquidityDelta",
      "returns": {
        "callerDelta": "The balance delta of the caller of modifyLiquidity. This is the total of both principal, fee deltas, and hook deltas if applicable",
        "feesAccrued": "The balance delta of the fees generated in the liquidity range. Returned for informational purposes"
      },
      "notice": "Modify the liquidity for the given pool"
    },
    "protocolFeeController()": {
      "notice": "Returns the current protocol fee controller address"
    },
    "balanceOf(address,uint256)": {
      "notice": "Owner balance of an id."
    },
    "isOperator(address,address)": {
      "notice": "Checks if a spender is approved by an owner as an operator"
    },
    "protocolFeesAccrued(address)": {
      "notice": "Given a currency address, returns the protocol fees accrued in that currency"
    },
    "allowance(address,address,uint256)": {
      "notice": "Spender allowance of an id."
    }
  },
  "errors": {},
  "bytecodeHash": "0x132889a41b89b4e124ae357ad9f5c5398fb0465e2a27b25b6ecfc8a9a18c6ff0",
  "contractFileTree": {
    "code": {
      "lib": {
        "v4-core": {
          "src": {
            "PoolManager.sol": "",
            "libraries": {
              "Hooks.sol": "",
              "Pool.sol": "",
              "SafeCast.sol": "",
              "Position.sol": "",
              "LPFeeLibrary.sol": "",
              "TickMath.sol": "",
              "Lock.sol": "",
              "CurrencyDelta.sol": "",
              "NonzeroDeltaCount.sol": "",
              "CurrencyReserves.sol": "",
              "CustomRevert.sol": "",
              "ParseBytes.sol": "",
              "TickBitmap.sol": "",
              "UnsafeMath.sol": "",
              "FixedPoint128.sol": "",
              "SqrtPriceMath.sol": "",
              "SwapMath.sol": "",
              "ProtocolFeeLibrary.sol": "",
              "LiquidityMath.sol": "",
              "FullMath.sol": "",
              "BitMath.sol": "",
              "FixedPoint96.sol": ""
            },
            "types": {
              "Currency.sol": "",
              "PoolKey.sol": "",
              "PoolId.sol": "",
              "BalanceDelta.sol": "",
              "BeforeSwapDelta.sol": "",
              "Slot0.sol": ""
            },
            "NoDelegateCall.sol": "",
            "interfaces": {
              "IHooks.sol": "",
              "IPoolManager.sol": "",
              "callback": {
                "IUnlockCallback.sol": ""
              },
              "external": {
                "IERC20Minimal.sol": "",
                "IERC6909Claims.sol": ""
              },
              "IProtocolFees.sol": "",
              "IExtsload.sol": "",
              "IExttload.sol": ""
            },
            "ProtocolFees.sol": "",
            "ERC6909Claims.sol": "",
            "Extsload.sol": "",
            "Exttload.sol": "",
            "ERC6909.sol": ""
          },
          "lib": {
            "solmate": {
              "src": {
                "auth": {
                  "Owned.sol": ""
                }
              }
            }
          }
        },
        "solmate": {
          "src": {
            "auth": {
              "Owned.sol": ""
            }
          }
        }
      },
      "src": {
        "types": {
          "BeforeSwapDelta.sol": "",
          "BalanceDelta.sol": "",
          "Currency.sol": "",
          "PoolId.sol": "",
          "PoolKey.sol": "",
          "Slot0.sol": ""
        },
        "ERC6909.sol": "",
        "ERC6909Claims.sol": "",
        "Extsload.sol": "",
        "Exttload.sol": "",
        "NoDelegateCall.sol": "",
        "PoolManager.sol": "",
        "ProtocolFees.sol": "",
        "interfaces": {
          "IExtsload.sol": "",
          "IExttload.sol": "",
          "IHooks.sol": "",
          "IPoolManager.sol": "",
          "IProtocolFees.sol": "",
          "callback": {
            "IUnlockCallback.sol": ""
          },
          "external": {
            "IERC20Minimal.sol": "",
            "IERC6909Claims.sol": ""
          }
        },
        "libraries": {
          "BitMath.sol": "",
          "CurrencyDelta.sol": "",
          "CurrencyReserves.sol": "",
          "CustomRevert.sol": "",
          "FixedPoint128.sol": "",
          "FixedPoint96.sol": "",
          "FullMath.sol": "",
          "Hooks.sol": "",
          "LPFeeLibrary.sol": "",
          "LiquidityMath.sol": "",
          "Lock.sol": "",
          "NonzeroDeltaCount.sol": "",
          "ParseBytes.sol": "",
          "Pool.sol": "",
          "Position.sol": "",
          "ProtocolFeeLibrary.sol": "",
          "SafeCast.sol": "",
          "SqrtPriceMath.sol": "",
          "SwapMath.sol": "",
          "TickBitmap.sol": "",
          "TickMath.sol": "",
          "UnsafeMath.sol": ""
        },
        "v4-core": {
          "PoolManager.sol": "",
          "ERC6909.sol": "",
          "ERC6909Claims.sol": "",
          "Extsload.sol": "",
          "Exttload.sol": "",
          "NoDelegateCall.sol": "",
          "ProtocolFees.sol": "",
          "interfaces": {
            "IExtsload.sol": "",
            "IExttload.sol": "",
            "IHooks.sol": "",
            "IPoolManager.sol": "",
            "IProtocolFees.sol": "",
            "callback": {
              "IUnlockCallback.sol": ""
            },
            "external": {
              "IERC20Minimal.sol": "",
              "IERC6909Claims.sol": ""
            }
          },
          "libraries": {
            "BitMath.sol": "",
            "CurrencyDelta.sol": "",
            "CurrencyReserves.sol": "",
            "CustomRevert.sol": "",
            "FixedPoint128.sol": "",
            "FixedPoint96.sol": "",
            "FullMath.sol": "",
            "Hooks.sol": "",
            "LPFeeLibrary.sol": "",
            "LiquidityMath.sol": "",
            "Lock.sol": "",
            "NonzeroDeltaCount.sol": "",
            "ParseBytes.sol": "",
            "Pool.sol": "",
            "Position.sol": "",
            "ProtocolFeeLibrary.sol": "",
            "SafeCast.sol": "",
            "SqrtPriceMath.sol": "",
            "SwapMath.sol": "",
            "TickBitmap.sol": "",
            "TickMath.sol": "",
            "UnsafeMath.sol": ""
          },
          "types": {
            "BalanceDelta.sol": "",
            "BeforeSwapDelta.sol": "",
            "Currency.sol": "",
            "PoolId.sol": "",
            "PoolKey.sol": "",
            "Slot0.sol": ""
          }
        }
      }
    }
  },
} as const satisfies ContractSourceCodeMetadata;