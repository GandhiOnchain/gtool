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
  // Native token logos - use chain-specific logos from TrustWallet
  if (!address || address === 'native') {
    const nativeLogos: Record<number, string> = {
      // Ethereum - use TrustWallet's native ETH logo
      1: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
      // Base - uses ETH as native token
      8453: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png',
      // Arbitrum - uses ETH as native token
      42161: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png',
      // Polygon - uses MATIC as native token
      137: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
      // Optimism - uses ETH as native token
      10: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png',
    }
    return [nativeLogos[chainId] || 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png']
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
