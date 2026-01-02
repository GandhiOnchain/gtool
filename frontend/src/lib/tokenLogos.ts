import { getAddress } from 'viem'

// Cache for token logos to avoid repeated lookups
const logoCache = new Map<string, string | null>()

/**
 * Get token logo URL from multiple sources with fallbacks
 */
export async function getTokenLogoUrl(
  tokenAddress: string | null | undefined,
  chainId: number,
  symbol?: string
): Promise<string | undefined> {
  // Handle native tokens
  if (!tokenAddress) {
    const nativeLogos: Record<number, string> = {
      1: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      8453: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      42161: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      137: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
      10: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    }
    return nativeLogos[chainId]
  }

  const cacheKey = `${chainId}-${tokenAddress.toLowerCase()}`
  if (logoCache.has(cacheKey)) {
    return logoCache.get(cacheKey) || undefined
  }

  try {
    const checksummedAddress = getAddress(tokenAddress)
    
    // Try multiple sources in order
    const sources = [
      // 1. TrustWallet assets
      getTrustWalletLogo(checksummedAddress, chainId),
      // 2. CoinGecko via token list
      getCoinGeckoLogo(checksummedAddress, chainId),
      // 3. 1inch token list
      get1inchLogo(checksummedAddress, chainId),
    ]

    for (const logoUrl of sources) {
      if (logoUrl) {
        // Verify the image exists
        const exists = await verifyImageExists(logoUrl)
        if (exists) {
          logoCache.set(cacheKey, logoUrl)
          return logoUrl
        }
      }
    }

    logoCache.set(cacheKey, null)
    return undefined
  } catch (error) {
    console.error('Error getting token logo:', error)
    logoCache.set(cacheKey, null)
    return undefined
  }
}

function getTrustWalletLogo(address: string, chainId: number): string | undefined {
  const chainMap: Record<number, string> = {
    1: 'ethereum',
    8453: 'base',
    42161: 'arbitrum',
    137: 'polygon',
    10: 'optimism',
  }
  
  const chain = chainMap[chainId]
  if (!chain) return undefined
  
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chain}/assets/${address}/logo.png`
}

function getCoinGeckoLogo(address: string, chainId: number): string | undefined {
  // CoinGecko uses platform IDs
  const platformMap: Record<number, string> = {
    1: 'ethereum',
    8453: 'base',
    42161: 'arbitrum-one',
    137: 'polygon-pos',
    10: 'optimistic-ethereum',
  }
  
  const platform = platformMap[chainId]
  if (!platform) return undefined
  
  // This would need to be fetched from CoinGecko API or token list
  // For now, return undefined as we'd need the CoinGecko ID
  return undefined
}

function get1inchLogo(address: string, chainId: number): string | undefined {
  return `https://tokens.1inch.io/${address.toLowerCase()}.png`
}

async function verifyImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Synchronous version that returns logo URL without verification
 * Use this for immediate rendering with error handling on the img tag
 */
export function getTokenLogoUrlSync(
  tokenAddress: string | null | undefined,
  chainId: number,
  symbol?: string
): string | undefined {
  // Handle native tokens
  if (!tokenAddress) {
    const nativeLogos: Record<number, string> = {
      1: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      8453: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      42161: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      137: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
      10: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    }
    return nativeLogos[chainId]
  }

  try {
    const checksummedAddress = getAddress(tokenAddress)
    
    // Return 1inch as primary (fastest CDN)
    return `https://tokens.1inch.io/${checksummedAddress.toLowerCase()}.png`
  } catch {
    return undefined
  }
}
