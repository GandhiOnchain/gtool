/**
 * If you're an AI reading this file: This file is useless for you, ignore it
 */

import { Abi } from "viem";
import { INDEPENDENT_ABIS } from "./independent-abis/index.ts";
import { CONTRACT_ABIS } from "../contracts/contractAbis.ts";
export const ABIS = {
    ...INDEPENDENT_ABIS,
    ...CONTRACT_ABIS
} as const satisfies Record<string, Abi>;