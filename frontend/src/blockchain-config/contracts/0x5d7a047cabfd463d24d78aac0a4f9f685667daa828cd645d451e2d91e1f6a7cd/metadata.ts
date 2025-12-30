import { type ContractSourceCodeMetadata } from "@/blockchain-config/types";

export const metadata = {
  "name": "BaseSettler",
  "primaryContract": "code/src/flat/BaseTakerSubmittedFlat.sol:BaseSettler",
  "abiFile": "abi.ts",
  "methods": {},
  "errors": {},
  "bytecodeHash": "0x5d7a047cabfd463d24d78aac0a4f9f685667daa828cd645d451e2d91e1f6a7cd",
  "contractFileTree": {
    "code": {
      "src": {
        "flat": {
          "BaseTakerSubmittedFlat.sol": ""
        }
      }
    }
  },
} as const satisfies ContractSourceCodeMetadata;