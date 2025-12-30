import { type ContractSourceCodeMetadata } from "@/blockchain-config/types";

export const metadata = {
  "name": "WETH9",
  "primaryContract": "code/WETH9.sol:WETH9",
  "abiFile": "abi.ts",
  "methods": {},
  "errors": {},
  "bytecodeHash": "0x9a33d980a4472e3f8973f7057256bbacb9c48a05eb162f23e00575e92c5c610f",
  "contractFileTree": {
    "code": {
      "WETH9.sol": ""
    }
  },
} as const satisfies ContractSourceCodeMetadata;