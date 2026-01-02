import { AIRDROP_CONFIG } from './config'
import type { AirdropEligibility } from './types'
import { formatUnits, parseUnits } from 'viem'

/**
 * Check if a wallet can claim the airdrop
 * No eligibility criteria - everyone can claim a fixed amount
 */
export async function checkAirdropEligibility(
  walletAddress: string
): Promise<AirdropEligibility> {
  try {
    console.log('Checking airdrop status for:', walletAddress)
    
    // Check if already claimed (if using claim contract)
    if (AIRDROP_CONFIG.claimContractAddress) {
      const hasClaimed = await checkIfClaimed(walletAddress)
      if (hasClaimed) {
        return {
          isEligible: false,
          amount: '0',
          amountFormatted: '0',
          reason: 'Airdrop already claimed',
          alreadyClaimed: true
        }
      }
    }
    
    // Everyone is eligible - use fixed amount (1000 tokens per user)
    const airdropAmount = '1000'
    
    return {
      isEligible: true,
      amount: airdropAmount,
      amountFormatted: formatUnits(
        parseUnits(airdropAmount, AIRDROP_CONFIG.tokenDecimals),
        AIRDROP_CONFIG.tokenDecimals
      ),
      proof: undefined, // Will be populated if using Merkle tree
    }
  } catch (error) {
    console.error('Error checking airdrop status:', error)
    return {
      isEligible: false,
      amount: '0',
      amountFormatted: '0',
      reason: 'Error checking airdrop status. Please try again.'
    }
  }
}

/**
 * Check if user has already claimed (if using claim contract)
 */
async function checkIfClaimed(walletAddress: string): Promise<boolean> {
  if (!AIRDROP_CONFIG.claimContractAddress) {
    return false
  }
  
  try {
    // This would call the claim contract's hasClaimed function
    // For now, return false as placeholder
    return false
  } catch (error) {
    console.error('Error checking claim status:', error)
    return false
  }
}

/**
 * Get Merkle proof for a wallet address (if using Merkle tree distribution)
 */
export async function getMerkleProof(
  walletAddress: string,
  amount: string
): Promise<string[] | undefined> {
  if (!AIRDROP_CONFIG.merkleRoot) {
    return undefined
  }
  
  try {
    // This would fetch the Merkle proof from your backend/API
    // For now, return undefined as placeholder
    // 
    // Example implementation:
    // const response = await fetch(`/api/merkle-proof?address=${walletAddress}&amount=${amount}`)
    // const data = await response.json()
    // return data.proof
    
    return undefined
  } catch (error) {
    console.error('Error getting Merkle proof:', error)
    return undefined
  }
}
