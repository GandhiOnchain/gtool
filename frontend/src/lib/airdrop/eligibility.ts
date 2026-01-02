import { alchemy, getAlchemyNetwork } from '../alchemy/config'
import { AIRDROP_CONFIG } from './config'
import type { AirdropEligibility } from './types'
import { formatUnits, parseUnits } from 'viem'

/**
 * Check if a wallet is eligible for the airdrop using Moralis/Alchemy
 */
export async function checkAirdropEligibility(
  walletAddress: string
): Promise<AirdropEligibility> {
  try {
    // Get wallet balance on the specified chain
    const network = getAlchemyNetwork(AIRDROP_CONFIG.chainId)
    
    // Get native token balance (ETH on Base)
    const balance = await alchemy.core.getBalance(walletAddress, 'latest')
    const ethBalance = formatUnits(balance.toBigInt(), 18)
    
    console.log('Checking eligibility:', {
      address: walletAddress,
      ethBalance,
      minRequired: AIRDROP_CONFIG.eligibilityCriteria.minEthBalance
    })
    
    // Check minimum ETH balance requirement
    const minEthBalance = AIRDROP_CONFIG.eligibilityCriteria.minEthBalance || '0'
    const hasMinBalance = parseFloat(ethBalance) >= parseFloat(minEthBalance)
    
    if (!hasMinBalance) {
      return {
        isEligible: false,
        amount: '0',
        amountFormatted: '0',
        reason: `Minimum ${minEthBalance} ETH balance required. You have ${parseFloat(ethBalance).toFixed(4)} ETH`
      }
    }
    
    // Calculate airdrop amount based on ETH balance
    // Example: 1000 tokens per 0.01 ETH (you can customize this formula)
    const airdropAmount = calculateAirdropAmount(ethBalance)
    
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
    console.error('Error checking eligibility:', error)
    return {
      isEligible: false,
      amount: '0',
      amountFormatted: '0',
      reason: 'Error checking eligibility. Please try again.'
    }
  }
}

/**
 * Calculate airdrop amount based on wallet balance
 * Customize this formula based on your requirements
 */
function calculateAirdropAmount(ethBalance: string): string {
  const balance = parseFloat(ethBalance)
  
  // Example tiered distribution:
  // 0.01-0.1 ETH: 1000 tokens
  // 0.1-1 ETH: 5000 tokens
  // 1+ ETH: 10000 tokens
  
  if (balance >= 1) {
    return '10000'
  } else if (balance >= 0.1) {
    return '5000'
  } else if (balance >= 0.01) {
    return '1000'
  }
  
  return '0'
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
