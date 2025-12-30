import { Abi } from "viem";
import { abi as ABI_ERC20 } from "./erc20/abi.ts"
import { abi as ABI_ERC721 } from "./erc721/abi.ts"
import { abi as ABI_ERC1155 } from "./erc1155/abi.ts"

/** 
 * This file is editable, as a developer, you can add an abi by adding a folder in this directory and adding an abi.ts file in there, and then importing it here
 * You can name it anything you want, as long as it's unique
 * 
 * This method is most useful for use-cases involving querying events accross multiple contracts with the same abi (eg. querying ERC20 transfer events on a chain)
 * Otherwise, default to importing the contract, which is the preferred method
 */

export const INDEPENDENT_ABIS = {
    "ERC20": ABI_ERC20,
    "ERC721": ABI_ERC721,
    "ERC1155": ABI_ERC1155
} as const satisfies Record<string, Abi>;
