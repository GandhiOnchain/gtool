import { getAddress, isAddress } from 'viem'

/**
 * Get multiple logo URLs to try in order
 */
export function getTokenLogoFallbacks(
  address: string | null | undefined,
  chainId: number,
  symbol?: string
): string[] {
  if (!address || address === 'native') {
    const nativeLogos: Record<number, string> = {
      1: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      8453: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      42161: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      137: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
      10: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    }
    return [nativeLogos[chainId] || 'https://assets.coingecko.com/coins/images/279/small/ethereum.png']
  }

  const logos: string[] = []
  const lowerSymbol = symbol?.toLowerCase()

  // 1. Symbol-based from cryptocurrency-icons (most reliable for major tokens)
  if (lowerSymbol) {
    logos.push(`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${lowerSymbol}.png`)
  }

  // 2. TrustWallet (good coverage, requires checksummed address)
  const chainNames: Record<number, string> = {
    1: 'ethereum',
    8453: 'base',
    42161: 'arbitrum',
    137: 'polygon',
    10: 'optimism',
  }
  
  const chainName = chainNames[chainId]
  if (chainName && isAddress(address)) {
    try {
      const checksummed = getAddress(address)
      logos.push(`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainName}/assets/${checksummed}/logo.png`)
    } catch (e) {
      // If checksum fails, try lowercase
      logos.push(`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainName}/assets/${address}/logo.png`)
    }
  }

  return logos
}
