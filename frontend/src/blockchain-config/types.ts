import type { SupportedChainId } from "@/lib/blockchain/chains";
import type { Abi, Address, Hash } from "viem";
import { INDEPENDENT_ABIS } from "./abis/independent-abis/index.ts";
import { CONTRACT_ABIS } from "./contracts/contractAbis.ts";
import { deployments } from "./deployments.ts";

export type ContractSourceCodeMetadata = {
    name: string;
    primaryContract: string;
    names?: string[];
    primaryContracts?: string[];
    abiFile: string;
    protocol?: string;
    bytecodeHash?: string;
    methods: Record<string, any>;
    errors: Record<string, any>;
    details?: string | undefined;
    contractFileTree: FileTreeNode;
    remotePublicFiles?: Record<string, any>;
}

export type DeployedContractType = "system" | "imported" | "creator";

export type VerifiedContractSource = 'Etherscan' | 'Sourcify' | 'Blockscout' | 'Routescan';

export type DeployedContract = {
    type: DeployedContractType;
    chainId: number;
    address: Address;
    implBytecodeHash: keyof typeof CONTRACT_ABIS;
    protocol?: string;
    contractName?: string;
    metadata?: Record<string, unknown>;
    selected?: boolean;
    context?: string;
    sourceCodeMetadata?: ContractSourceCodeMetadata;
    originalVerifiedSource?: VerifiedContractSource;
    abi: Abi;
}

export type DeployedAppContract = {
    chainId: number;
    address: Address;
    independentAbiName: keyof typeof INDEPENDENT_ABIS;
    contractName?: string;
    metadata?: Record<string, unknown>;
}

export type Deployments = typeof deployments;

export interface FileTreeNode {
    [key: string]: FileTreeNode | string;
}
  
export type ProtocolMetadata = {
    contracts: Record<string, {
        implBytecodeHash: string,
        context: string
    }>,
    fileTree: FileTreeNode;
}