import type { AirdropConfig } from './types'

// Configure your airdrop details here
export const AIRDROP_CONFIG: AirdropConfig = {
  // Token details
  tokenAddress: '0x0000000000000000000000000000000000000000', // Replace with your ERC20 token address
  tokenSymbol: 'AIRDROP',
  tokenName: 'Airdrop Token',
  tokenDecimals: 18,
  
  // Chain details
  chainId: 8453, // Base
  chainName: 'Base',
  
  // Airdrop details
  totalSupply: '1000000', // 1M tokens total
  
  // Eligibility criteria (set to no restrictions)
  eligibilityCriteria: {
    customCriteria: 'Open to all users - 1000 tokens per claim'
  },
  
  // Merkle tree root (if using Merkle proof distribution)
  merkleRoot: undefined, // Set this if using Merkle tree
  
  // Claim contract address (if using a claim contract)
  claimContractAddress: undefined, // Set this if using a claim contract
}

// Standard ERC20 ABI for token transfers
export const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
] as const

// Airdrop claim contract ABI (if using a claim contract)
export const AIRDROP_CLAIM_ABI = [
  {
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'proof', type: 'bytes32[]' },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'hasClaimed',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'merkleRoot',
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const
