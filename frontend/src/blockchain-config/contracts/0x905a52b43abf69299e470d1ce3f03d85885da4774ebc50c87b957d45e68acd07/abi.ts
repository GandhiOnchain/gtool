import type { Abi } from "viem";

export const abi = [
  {
    "name": "ApprovalCallerNotOwnerNorApproved",
    "type": "error",
    "inputs": []
  },
  {
    "name": "ApprovalQueryForNonexistentToken",
    "type": "error",
    "inputs": []
  },
  {
    "name": "BalanceQueryForZeroAddress",
    "type": "error",
    "inputs": []
  },
  {
    "name": "EmptyString",
    "type": "error",
    "inputs": []
  },
  {
    "name": "FileAlreadyRegistered",
    "type": "error",
    "inputs": []
  },
  {
    "name": "FileNotRegistered",
    "type": "error",
    "inputs": []
  },
  {
    "name": "InvalidManager",
    "type": "error",
    "inputs": []
  },
  {
    "name": "ManagerDoesNotExist",
    "type": "error",
    "inputs": []
  },
  {
    "name": "ManagerRemoveBlocked",
    "type": "error",
    "inputs": []
  },
  {
    "name": "ManagerSwapBlocked",
    "type": "error",
    "inputs": []
  },
  {
    "name": "MintERC2309QuantityExceedsLimit",
    "type": "error",
    "inputs": []
  },
  {
    "name": "MintFrozen",
    "type": "error",
    "inputs": []
  },
  {
    "name": "MintToZeroAddress",
    "type": "error",
    "inputs": []
  },
  {
    "name": "MintZeroQuantity",
    "type": "error",
    "inputs": []
  },
  {
    "name": "MinterRegistrationInvalid",
    "type": "error",
    "inputs": []
  },
  {
    "name": "MismatchedArrayLengths",
    "type": "error",
    "inputs": []
  },
  {
    "name": "NotMinter",
    "type": "error",
    "inputs": []
  },
  {
    "name": "OverLimitSupply",
    "type": "error",
    "inputs": []
  },
  {
    "name": "OwnerQueryForNonexistentToken",
    "type": "error",
    "inputs": []
  },
  {
    "name": "OwnershipNotInitializedForExtraData",
    "type": "error",
    "inputs": []
  },
  {
    "name": "RoyaltyBPSInvalid",
    "type": "error",
    "inputs": []
  },
  {
    "name": "RoyaltySetBlocked",
    "type": "error",
    "inputs": []
  },
  {
    "name": "TokenDoesNotExist",
    "type": "error",
    "inputs": []
  },
  {
    "name": "TokenNotInRange",
    "type": "error",
    "inputs": []
  },
  {
    "name": "TransferCallerNotOwnerNorApproved",
    "type": "error",
    "inputs": []
  },
  {
    "name": "TransferFromIncorrectOwner",
    "type": "error",
    "inputs": []
  },
  {
    "name": "TransferToNonERC721ReceiverImplementer",
    "type": "error",
    "inputs": []
  },
  {
    "name": "TransferToZeroAddress",
    "type": "error",
    "inputs": []
  },
  {
    "name": "URIQueryForNonexistentToken",
    "type": "error",
    "inputs": []
  },
  {
    "name": "Unauthorized",
    "type": "error",
    "inputs": []
  },
  {
    "name": "Approval",
    "type": "event",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "approved",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "name": "ApprovalForAll",
    "type": "event",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "operator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "approved",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "name": "BaseURISet",
    "type": "event",
    "inputs": [
      {
        "name": "oldBaseUri",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "newBaseURI",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      }
    ],
    "anonymous": false
  },
  {
    "name": "DefaultRoyaltySet",
    "type": "event",
    "inputs": [
      {
        "name": "recipientAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "royaltyPercentageBPS",
        "type": "uint16",
        "indexed": true,
        "internalType": "uint16"
      }
    ],
    "anonymous": false
  },
  {
    "name": "DefaultTokenManagerChanged",
    "type": "event",
    "inputs": [
      {
        "name": "newDefaultTokenManager",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "name": "GranularRoyaltiesSet",
    "type": "event",
    "inputs": [
      {
        "name": "ids",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      },
      {
        "name": "_newRoyalties",
        "type": "tuple[]",
        "indexed": false,
        "components": [
          {
            "name": "recipientAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "royaltyPercentageBPS",
            "type": "uint16",
            "internalType": "uint16"
          }
        ],
        "internalType": "struct IRoyaltyManager.Royalty[]"
      }
    ],
    "anonymous": false
  },
  {
    "name": "GranularTokenManagersRemoved",
    "type": "event",
    "inputs": [
      {
        "name": "_ids",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      }
    ],
    "anonymous": false
  },
  {
    "name": "GranularTokenManagersSet",
    "type": "event",
    "inputs": [
      {
        "name": "_ids",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      },
      {
        "name": "_tokenManagers",
        "type": "address[]",
        "indexed": false,
        "internalType": "address[]"
      }
    ],
    "anonymous": false
  },
  {
    "name": "Initialized",
    "type": "event",
    "inputs": [
      {
        "name": "version",
        "type": "uint8",
        "indexed": false,
        "internalType": "uint8"
      }
    ],
    "anonymous": false
  },
  {
    "name": "LimitSupplySet",
    "type": "event",
    "inputs": [
      {
        "name": "newLimitSupply",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "name": "MinterRegistrationChanged",
    "type": "event",
    "inputs": [
      {
        "name": "minter",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "registered",
        "type": "bool",
        "indexed": true,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "name": "MintsFrozen",
    "type": "event",
    "inputs": [],
    "anonymous": false
  },
  {
    "name": "OwnershipTransferred",
    "type": "event",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "name": "RoyaltyManagerChanged",
    "type": "event",
    "inputs": [
      {
        "name": "newRoyaltyManager",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "name": "TokenURIsSet",
    "type": "event",
    "inputs": [
      {
        "name": "ids",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      },
      {
        "name": "uris",
        "type": "string[]",
        "indexed": false,
        "internalType": "string[]"
      }
    ],
    "anonymous": false
  },
  {
    "name": "Transfer",
    "type": "event",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "name": "addFile",
    "type": "function",
    "inputs": [
      {
        "name": "fileName",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "fileStorageAddresses",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "approve",
    "type": "function",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "name": "balanceOf",
    "type": "function",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "baseURI",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "burn",
    "type": "function",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "contractURI",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "customRendererConfig",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "renderer",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "processMintDataOnRenderer",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "defaultManager",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "fileContents",
    "type": "function",
    "inputs": [
      {
        "name": "fileName",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "fileStorage",
    "type": "function",
    "inputs": [
      {
        "name": "fileName",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "files",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string[]",
        "internalType": "string[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "freezeMints",
    "type": "function",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "generativeCodeUri",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "getApproved",
    "type": "function",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "initialize",
    "type": "function",
    "inputs": [
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_observability",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "isApprovedForAll",
    "type": "function",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "isTrustedForwarder",
    "type": "function",
    "inputs": [
      {
        "name": "forwarder",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "limitSupply",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "mintAmountToOneRecipient",
    "type": "function",
    "inputs": [
      {
        "name": "recipient",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "mintOneToMultipleRecipients",
    "type": "function",
    "inputs": [
      {
        "name": "recipients",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "mintOneToOneRecipient",
    "type": "function",
    "inputs": [
      {
        "name": "recipient",
        "type": "address",
        "internalType": "address"
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
    "name": "mintSameAmountToMultipleRecipients",
    "type": "function",
    "inputs": [
      {
        "name": "recipients",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "minters",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "name",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "observability",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IObservability"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "owner",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "ownerOf",
    "type": "function",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "registerMinter",
    "type": "function",
    "inputs": [
      {
        "name": "minter",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "removeDefaultTokenManager",
    "type": "function",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "removeFile",
    "type": "function",
    "inputs": [
      {
        "name": "fileName",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "removeGranularTokenManagers",
    "type": "function",
    "inputs": [
      {
        "name": "_ids",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "removeRoyaltyManager",
    "type": "function",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "renounceOwnership",
    "type": "function",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "royaltyInfo",
    "type": "function",
    "inputs": [
      {
        "name": "_tokenGroupingId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_salePrice",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "receiver",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "royaltyAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "royaltyManager",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "safeTransferFrom",
    "type": "function",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "name": "safeTransferFrom",
    "type": "function",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "name": "setApprovalForAll",
    "type": "function",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "approved",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "setBaseURI",
    "type": "function",
    "inputs": [
      {
        "name": "newBaseURI",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "setContractMetadata",
    "type": "function",
    "inputs": [
      {
        "name": "newName",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "newSymbol",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "newContractUri",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "setCustomRenderer",
    "type": "function",
    "inputs": [
      {
        "name": "_customRendererConfig",
        "type": "tuple",
        "components": [
          {
            "name": "renderer",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "processMintDataOnRenderer",
            "type": "bool",
            "internalType": "bool"
          }
        ],
        "internalType": "struct ERC721GeneralSequenceBase.CustomRendererConfig"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "setDefaultRoyalty",
    "type": "function",
    "inputs": [
      {
        "name": "_royalty",
        "type": "tuple",
        "components": [
          {
            "name": "recipientAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "royaltyPercentageBPS",
            "type": "uint16",
            "internalType": "uint16"
          }
        ],
        "internalType": "struct IRoyaltyManager.Royalty"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "setDefaultTokenManager",
    "type": "function",
    "inputs": [
      {
        "name": "_defaultTokenManager",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "setGranularRoyalties",
    "type": "function",
    "inputs": [
      {
        "name": "ids",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "_newRoyalties",
        "type": "tuple[]",
        "components": [
          {
            "name": "recipientAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "royaltyPercentageBPS",
            "type": "uint16",
            "internalType": "uint16"
          }
        ],
        "internalType": "struct IRoyaltyManager.Royalty[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "setGranularTokenManagers",
    "type": "function",
    "inputs": [
      {
        "name": "_ids",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "_tokenManagers",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "setLimitSupply",
    "type": "function",
    "inputs": [
      {
        "name": "_limitSupply",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "setRoyaltyManager",
    "type": "function",
    "inputs": [
      {
        "name": "_royaltyManager",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "setTokenURIs",
    "type": "function",
    "inputs": [
      {
        "name": "ids",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "uris",
        "type": "string[]",
        "internalType": "string[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "supply",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "supportsInterface",
    "type": "function",
    "inputs": [
      {
        "name": "interfaceId",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "symbol",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "tokenManager",
    "type": "function",
    "inputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "manager",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "tokenURI",
    "type": "function",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "totalSupply",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "transferFrom",
    "type": "function",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "name": "transferOwnership",
    "type": "function",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "unregisterMinter",
    "type": "function",
    "inputs": [
      {
        "name": "minter",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
] as const satisfies Abi;