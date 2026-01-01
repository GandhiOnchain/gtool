import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AlertTriangle, Shield, Info } from 'lucide-react'

interface TransactionPreviewProps {
  fromToken: string
  toToken: string
  fromAmount: string
  toAmount: string
  fromChain: string
  toChain: string
  slippage: string
  gasFee?: string
  protocolFee?: string
  priceImpact?: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export function TransactionPreview({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  fromChain,
  toChain,
  slippage,
  gasFee,
  protocolFee,
  priceImpact,
  onConfirm,
  onCancel,
  isLoading = false
}: TransactionPreviewProps) {
  const hasHighSlippage = parseFloat(slippage) > 1
  const hasHighPriceImpact = priceImpact && parseFloat(priceImpact) > 5

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Transaction Preview</h3>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">You send</span>
            <span className="font-medium">{fromAmount} {fromToken}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">From chain</span>
            <span className="font-medium">{fromChain}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">You receive</span>
            <span className="font-medium">{toAmount} {toToken}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">To chain</span>
            <span className="font-medium">{toChain}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Max slippage</span>
            <span className={hasHighSlippage ? 'text-destructive font-medium' : ''}>
              {slippage}%
            </span>
          </div>
          {gasFee && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Est. gas fee</span>
              <span>{gasFee}</span>
            </div>
          )}
          {protocolFee && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Protocol fee</span>
              <span>{protocolFee}</span>
            </div>
          )}
          {priceImpact && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price impact</span>
              <span className={hasHighPriceImpact ? 'text-destructive font-medium' : ''}>
                {priceImpact}%
              </span>
            </div>
          )}
        </div>
      </div>

      {(hasHighSlippage || hasHighPriceImpact) && (
        <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
          <div className="text-xs space-y-1">
            {hasHighSlippage && (
              <p className="text-destructive">High slippage detected. You may receive less than expected.</p>
            )}
            {hasHighPriceImpact && (
              <p className="text-destructive">High price impact. Consider reducing your trade size.</p>
            )}
          </div>
        </div>
      )}

      <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-md">
        <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground">
          You maintain full control. This transaction will only execute after your wallet approval.
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Processing...' : 'Confirm & Sign'}
        </Button>
      </div>
    </Card>
  )
}
