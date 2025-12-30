import type { Abi } from "viem";

export const abi = [
  {
    "name": "Approval",
    "type": "event",
    "inputs": [
      {
        "name": "src",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "guy",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "wad",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "name": "Deposit",
    "type": "event",
    "inputs": [
      {
        "name": "dst",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "wad",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "name": "Transfer",
    "type": "event",
    "inputs": [
      {
        "name": "src",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "dst",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "wad",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "name": "Withdrawal",
    "type": "event",
    "inputs": [
      {
        "name": "src",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "wad",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "fallback",
    "payable": true,
    "stateMutability": "payable"
  },
  {
    "name": "allowance",
    "type": "function",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
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
    "payable": false,
    "constant": true,
    "stateMutability": "view"
  },
  {
    "name": "approve",
    "type": "function",
    "inputs": [
      {
        "name": "guy",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "wad",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "payable": false,
    "constant": false,
    "stateMutability": "nonpayable"
  },
  {
    "name": "balanceOf",
    "type": "function",
    "inputs": [
      {
        "name": "",
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
    "payable": false,
    "constant": true,
    "stateMutability": "view"
  },
  {
    "name": "decimals",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "payable": false,
    "constant": true,
    "stateMutability": "view"
  },
  {
    "name": "deposit",
    "type": "function",
    "inputs": [],
    "outputs": [],
    "payable": true,
    "constant": false,
    "stateMutability": "payable"
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
    "payable": false,
    "constant": true,
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
    "payable": false,
    "constant": true,
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
    "payable": false,
    "constant": true,
    "stateMutability": "view"
  },
  {
    "name": "transfer",
    "type": "function",
    "inputs": [
      {
        "name": "dst",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "wad",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "payable": false,
    "constant": false,
    "stateMutability": "nonpayable"
  },
  {
    "name": "transferFrom",
    "type": "function",
    "inputs": [
      {
        "name": "src",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "dst",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "wad",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "payable": false,
    "constant": false,
    "stateMutability": "nonpayable"
  },
  {
    "name": "withdraw",
    "type": "function",
    "inputs": [
      {
        "name": "wad",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "payable": false,
    "constant": false,
    "stateMutability": "nonpayable"
  }
] as const satisfies Abi;