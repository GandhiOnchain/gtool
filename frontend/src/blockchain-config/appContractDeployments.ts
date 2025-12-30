import type { Abi, Address, Hash } from "viem";
import { type DeployedAppContract } from "./types.js"
import { INDEPENDENT_ABIS } from "./abis/independent-abis/index.js";

// NOTE: This is a solution for ephemeral apps without a backend or database.
// MODIFY to use your own backend or database if you need to persist app contracts accross sessions.

export const appContractDeployments: DeployedAppContract[] = []

/**
 * Get all app contracts with ABIs
 * @returns All app contracts
 */
export async function getAppContracts(): Promise<(DeployedAppContract & { abi: Abi })[]> {
    return appContractDeployments.map(enrichAppContractWithAbi)
}

/**
 * Get app contract by address and chain
 * @param address - Contract address
 * @param chainId - Chain ID
 * @returns Contract with ABI
 */
export function getAppContractByAddressAndChainId(address: string, chainId: number): (DeployedAppContract & { abi: Abi }) | undefined {
    const contract = appContractDeployments.find(contract => contract.address === address.toLowerCase() && contract.chainId === chainId)
    if (!contract) {
      return undefined
    }
    return enrichAppContractWithAbi(contract)
}

/**
 * Add ABI to app contract
 * @param contract - App contract
 * @returns Contract with ABI
 */
function enrichAppContractWithAbi(contract: DeployedAppContract): DeployedAppContract & { abi: Abi } {
  if (!INDEPENDENT_ABIS[contract.independentAbiName]) {
    throw new Error(`Independent ABI ${contract.independentAbiName} not found`)
  }
  return { ...contract, abi: INDEPENDENT_ABIS[contract.independentAbiName] }
}

/**
 * Add deployed contract to app deployments
 * @param chainId - Chain ID
 * @param address - Contract address
 * @param independentAbiName - ABI name
 * @param contractName - Contract name
 * @param metadata - Additional metadata
 * @param aiGeneratedDescription - AI description
 * @returns Deployed contract
 */
export async function addDeployedAppContract({
    chainId,
    address,
    contractName,
    independentAbiName,
    metadata,
    aiGeneratedDescription
  }: {
    chainId: number;
    address: string;
    independentAbiName: keyof typeof INDEPENDENT_ABIS;
    contractName?: string;
    metadata?: Record<string, unknown>;
    aiGeneratedDescription?: string;
  }) {
    const newDeployedContract: DeployedAppContract = {
      chainId,
      address: address.toLowerCase() as Address,
      independentAbiName,
      contractName,
      metadata: { ...metadata, description: aiGeneratedDescription },
    }
    appContractDeployments.push(newDeployedContract)
    return newDeployedContract
}

  