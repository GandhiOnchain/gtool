import { createConfig as createPrivyConfig } from '@privy-io/wagmi'
import { createConfig as createWagmiConfig } from 'wagmi'
import { http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { 
  supportedChains, 
  base, 
  baseSepolia, 
  getRpcUrl, 
  bsc, 
  arbitrum, 
  berachain, 
  avalanche, 
  hyperliquid, 
  polygon, 
  optimism, 
  linea, 
  mantle, 
  unichain, 
  shape, 
  scroll, 
  ethereum,
  plume
} from './chains'
import { config } from '../../config'

const transports = {
  [base.id]: http(getRpcUrl(base.id)),
  [baseSepolia.id]: http(getRpcUrl(baseSepolia.id)),
  [ethereum.id]: http(getRpcUrl(ethereum.id)),
  [bsc.id]: http(getRpcUrl(bsc.id)),
  [arbitrum.id]: http(getRpcUrl(arbitrum.id)),
  [berachain.id]: http(getRpcUrl(berachain.id)),
  [avalanche.id]: http(getRpcUrl(avalanche.id)),
  [hyperliquid.id]: http(getRpcUrl(hyperliquid.id)),
  [polygon.id]: http(getRpcUrl(polygon.id)),
  [optimism.id]: http(getRpcUrl(optimism.id)),
  [linea.id]: http(getRpcUrl(linea.id)),
  [scroll.id]: http(getRpcUrl(scroll.id)),
  [mantle.id]: http(getRpcUrl(mantle.id)),
  [unichain.id]: http(getRpcUrl(unichain.id)),
  [shape.id]: http(getRpcUrl(shape.id)),
  [plume.id]: http(getRpcUrl(plume.id)),
}

// Dynamically choose config: Privy when available, otherwise InjectedConnector fallback
export const wagmiConfig = config.privy.appId && config.privy.clientId
  ? createPrivyConfig({
      chains: supportedChains,
      transports,
    })
  : createWagmiConfig({
      chains: supportedChains,
      connectors: [injected(), miniAppConnector()],
      transports,
    })

export { 
  supportedChains, 
  base, 
  baseSepolia, 
  bsc, 
  arbitrum, 
  berachain, 
  avalanche, 
  hyperliquid, 
  polygon, 
  optimism, 
  linea, 
  mantle, 
  unichain, 
  shape, 
  scroll,
  ethereum,
  plume
} 