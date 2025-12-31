import { useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'
import { Card } from '@/components/ui/card'

export default function CrossVMSwap() {
  const { address } = useAccount()
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!widgetRef.current) return

    const script = document.createElement('script')
    script.src = 'https://rango-widget.rango.exchange/main.js'
    script.async = true
    
    script.onload = () => {
      if (window.rangoWidget && widgetRef.current) {
        window.rangoWidget.init({
          container: widgetRef.current,
          config: {
            apiKey: 'c6381a79-2817-4602-83bf-6a641a409e32',
            walletConnectProjectId: 'your-project-id',
            theme: {
              mode: 'dark',
              colors: {
                primary: 'hsl(var(--primary))',
                secondary: 'hsl(var(--secondary))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
              },
            },
            fromBlockchain: 'ETH',
            toBlockchain: 'SOLANA',
            fromToken: {
              blockchain: 'ETH',
              symbol: 'ETH',
              address: null,
            },
            toToken: {
              blockchain: 'SOLANA',
              symbol: 'SOL',
              address: null,
            },
            wallets: address ? [{ address, blockchain: 'ETH' }] : undefined,
          },
        })
      }
    }

    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [address])

  return (
    <div className="min-h-screen bg-background p-4 max-w-[500px] mx-auto">
      <Card className="p-4">
        <h1 className="text-xl font-bold mb-4">Cross-Chain Swap</h1>
        <div className="text-sm text-muted-foreground mb-4">
          Swap between any chains including Ethereum, Solana, Cosmos, and more
        </div>
        <div ref={widgetRef} className="min-h-[600px]" />
      </Card>
    </div>
  )
}

declare global {
  interface Window {
    rangoWidget?: {
      init: (config: unknown) => void
    }
  }
}
