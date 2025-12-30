import { type ContractSourceCodeMetadata } from "@/blockchain-config/types";

export const metadata = {
  "name": "WETH9",
  "primaryContract": "code/src/vendor/WETH9.sol:WETH9",
  "abiFile": "abi.ts",
  "methods": {},
  "errors": {},
  "bytecodeHash": "0xd968e603d6697876085a8fd8e0667ecab51848ed823fcff4816e8b64f7768454",
  "contractFileTree": {
    "code": {
      "src": {
        "vendor": {
          "WETH9.sol": ""
        }
      }
    }
  },
} as const satisfies ContractSourceCodeMetadata;