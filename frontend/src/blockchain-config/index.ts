import type { Abi } from 'viem'

import { type Deployments } from './types.js'
import { INDEPENDENT_ABIS } from './abis/independent-abis/index.ts'
import { deployments } from './deployments.js'

/**
 * Get independent ABI (ERC-20, ERC-721, etc.)
 * @param independentAbiName - ABI name
 * @returns The ABI
 */
export function getIndependentAbi(independentAbiName: keyof typeof INDEPENDENT_ABIS) {
  return INDEPENDENT_ABIS[independentAbiName];
}

/**
 * Get deployed contract by chain and address
 * @param chainId - Chain ID
 * @param contractAddress - Contract address (case-insensitive)
 * @returns Contract with ABI
 */
export function getDeployedContract<
  C extends keyof Deployments
>({ chainId, contractAddress }: { chainId: C; contractAddress: string })
: Deployments[C][keyof Deployments[C]] {
  // Normalize the address to lowercase for lookup
  const normalizedAddress = contractAddress.toLowerCase() as keyof Deployments[C];

  if (!deployments[chainId][normalizedAddress]) {
    throw new Error(`Contract not found for chainId: ${chainId} and contractAddress: ${contractAddress}`);
  }
  return deployments[chainId][normalizedAddress];
}