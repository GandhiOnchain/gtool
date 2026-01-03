import { getAddress, isAddress } from 'viem'

/**
 * Get multiple logo URLs to try in order
 * All URLs are HTTPS to avoid CORS/Mixed Content issues in Farcaster Mini Apps
 */
export function getTokenLogoFallbacks(
  address: string | null | undefined,
  chainId: number,
  symbol?: string
): string[] {
  // Native token logos - use actual token logos, not chain logos
  if (!address || address === 'native') {
    // For native tokens, use the token logo based on symbol
    // ETH chains (Ethereum, Base, Arbitrum, Optimism) all use ETH logo
    // Polygon uses MATIC logo
    const nativeTokenLogos: Record<number, string> = {
      // Ethereum - ETH logo
      1: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png',
      // Base - ETH logo (not Base chain logo)
      8453: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png',
      // Arbitrum - ETH logo (not Arbitrum chain logo)
      42161: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png',
      // Polygon - MATIC logo (not Polygon chain logo)
      137: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/matic.png',
      // Optimism - ETH logo (not Optimism chain logo)
      10: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png',
    }
    return [nativeTokenLogos[chainId] || 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png']
  }

  const logos: string[] = []
  const lowerSymbol = symbol?.toLowerCase()

  // 1. Symbol-based from cryptocurrency-icons (HTTPS, most reliable for major tokens)
  if (lowerSymbol) {
    logos.push(`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${lowerSymbol}.png`)
  }

  // 2. TrustWallet (HTTPS, good coverage, requires checksummed address)
  // Chain-specific paths as per TrustWallet documentation
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

/**
 * Get chain logo URL
 */
export function getChainLogo(chainId: number): string {
  const chainLogos: Record<number, string> = {
    1: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    8453: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png',
    42161: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png',
    137: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
    10: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png',
  }
  return chainLogos[chainId] || chainLogos[1]
}
