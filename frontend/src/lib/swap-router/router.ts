import { relayAPI } from '../relay/api'
import { rangoAPI } from '../rango/api'
import { lifiAPI } from '../lifi/api'
import type {
  SwapProvider,
  UnifiedQuoteRequest,
  UnifiedQuote,
  UnifiedSwapTransaction,
} from './types'

// Map chain names to Rango blockchain identifiers
const RANGO_BLOCKCHAIN_MAP: Record<string, string> = {
  'ethereum': 'ETH',
  'base': 'BASE',
  'optimism': 'OPTIMISM',
  'arbitrum': 'ARBITRUM',
  'polygon': 'POLYGON',
  'bsc': 'BSC',
  'avalanche': 'AVAX_CCHAIN',
  'solana': 'SOLANA',
  'cosmos': 'COSMOS',
}

export class SwapRouter {
  /**
   * Determines the best provider for a given swap
   */
  selectProvider(request: UnifiedQuoteRequest): SwapProvider {
    const fromVMType = request.fromChain.vmType
    const toVMType = request.toChain.vmType
    
    // If both chains are EVM, prefer Relay (fastest, cheapest)
    if (fromVMType === 'evm' && toVMType === 'evm') {
      return 'relay'
    }
    
    // For cross-VM swaps, use Rango (best cross-VM support)
    if (fromVMType !== toVMType) {
      return 'rango'
    }
    
    // For non-EVM to non-EVM, use LI.FI as fallback
    return 'lifi'
  }

  /**
   * Get quote from the best provider
   */
  async getQuote(request: UnifiedQuoteRequest): Promise<UnifiedQuote> {
    const provider = this.selectProvider(request)
    console.log(`Using ${provider} for swap quote`)

    try {
      switch (provider) {
        case 'relay':
          return await this.getRelayQuote(request)
        case 'rango':
          return await this.getRangoQuote(request)
        case 'lifi':
          return await this.getLiFiQuote(request)
        default:
          throw new Error(`Unknown provider: ${provider}`)
      }
    } catch (error) {
      console.error(`${provider} quote failed:`, error)
      
      // Fallback to other providers
      if (provider === 'relay') {
        console.log('Falling back to Rango...')
        return await this.getRangoQuote(request)
      } else if (provider === 'rango') {
        console.log('Falling back to LI.FI...')
        return await this.getLiFiQuote(request)
      }
      
      throw error
    }
  }

  private async getRelayQuote(request: UnifiedQuoteRequest): Promise<UnifiedQuote> {
    const quote = await relayAPI.executeSwap({
      user: request.fromAddress,
      originChainId: Number(request.fromChain.id),
      destinationChainId: Number(request.toChain.id),
      originCurrency: request.fromToken.address,
      destinationCurrency: request.toToken.address,
      amount: request.fromAmount,
      tradeType: 'EXACT_INPUT',
      slippageTolerance: request.slippage?.toString(),
      recipient: request.toAddress,
    })

    return {
      provider: 'relay',
      fromAmount: request.fromAmount,
      toAmount: quote.details.currencyOut?.amountFormatted || '0',
      toAmountMin: quote.details.currencyOut?.minimumAmount || '0',
      estimatedGas: quote.fees.gas?.amountUsd || '0',
      estimatedTime: quote.details.timeEstimate || 0,
      route: {
        steps: [{
          tool: 'Relay',
          fromChain: request.fromChain.name,
          toChain: request.toChain.name,
          fromToken: request.fromToken.symbol,
          toToken: request.toToken.symbol,
        }],
      },
      fees: {
        gas: quote.fees.gas?.amountUsd,
        protocol: quote.fees.relayer?.amountUsd,
        total: (
          parseFloat(quote.fees.gas?.amountUsd || '0') +
          parseFloat(quote.fees.relayer?.amountUsd || '0')
        ).toString(),
      },
      rawQuote: quote,
    }
  }

  private async getRangoQuote(request: UnifiedQuoteRequest): Promise<UnifiedQuote> {
    // Map chain names to Rango blockchain identifiers
    const fromBlockchain = RANGO_BLOCKCHAIN_MAP[request.fromChain.name.toLowerCase()] || request.fromChain.name.toUpperCase()
    const toBlockchain = RANGO_BLOCKCHAIN_MAP[request.toChain.name.toLowerCase()] || request.toChain.name.toUpperCase()
    
    // For Rango, native tokens should have null address
    const isFromNative = request.fromToken.address === '0x0000000000000000000000000000000000000000' ||
                         request.fromToken.symbol === request.fromChain.nativeCurrency.symbol
    
    const isToNative = request.toToken.address === '0x0000000000000000000000000000000000000000' ||
                       request.toToken.symbol === request.toChain.nativeCurrency.symbol
    
    const fromAddress = isFromNative ? null : request.fromToken.address
    const toAddress = isToNative ? null : request.toToken.address
    
    console.log('Rango quote params:', {
      fromBlockchain,
      fromSymbol: request.fromToken.symbol,
      fromAddress,
      toBlockchain,
      toSymbol: request.toToken.symbol,
      toAddress,
      amount: request.fromAmount,
      userFromAddress: request.fromAddress,
      userToAddress: request.toAddress,
    })
    
    const quote = await rangoAPI.getQuote({
      from: {
        blockchain: fromBlockchain,
        symbol: request.fromToken.symbol,
        address: fromAddress,
      },
      to: {
        blockchain: toBlockchain,
        symbol: request.toToken.symbol,
        address: toAddress,
      },
      amount: request.fromAmount,
      fromAddress: request.fromAddress,
      toAddress: request.toAddress || request.fromAddress,
      slippage: request.slippage || 1,
    })

    const totalFees = quote.fee.reduce((sum, fee) => sum + parseFloat(fee.amount), 0)

    return {
      provider: 'rango',
      fromAmount: request.fromAmount,
      toAmount: quote.route.outputAmount,
      toAmountMin: quote.route.outputAmount,
      estimatedGas: quote.route.outputAmountUsd || '0',
      estimatedTime: quote.estimatedTimeInSeconds,
      route: {
        steps: quote.route.path.map(step => ({
          tool: step.swapper.title,
          fromChain: step.from.blockchain,
          toChain: step.to.blockchain,
          fromToken: step.from.symbol,
          toToken: step.to.symbol,
        })),
      },
      fees: {
        total: totalFees.toString(),
      },
      rawQuote: quote,
    }
  }

  private async getLiFiQuote(request: UnifiedQuoteRequest): Promise<UnifiedQuote> {
    const quote = await lifiAPI.getQuote({
      fromChain: Number(request.fromChain.id),
      toChain: Number(request.toChain.id),
      fromToken: request.fromToken.address,
      toToken: request.toToken.address,
      fromAmount: request.fromAmount,
      fromAddress: request.fromAddress,
      toAddress: request.toAddress,
      slippage: request.slippage,
    })

    const totalGas = quote.steps.reduce((sum, step) => {
      const gasUSD = step.estimate.gasCosts.reduce((s, g) => s + parseFloat(g.amountUSD), 0)
      return sum + gasUSD
    }, 0)

    const totalFees = quote.steps.reduce((sum, step) => {
      const feeUSD = step.estimate.feeCosts.reduce((s, f) => s + parseFloat(f.amountUSD), 0)
      return sum + feeUSD
    }, 0)

    return {
      provider: 'lifi',
      fromAmount: quote.fromAmount,
      toAmount: quote.toAmount,
      toAmountMin: quote.toAmountMin,
      estimatedGas: totalGas.toString(),
      estimatedTime: quote.steps.reduce((sum, step) => sum + step.estimate.executionDuration, 0),
      route: {
        steps: quote.steps.map(step => ({
          tool: step.toolDetails.name,
          fromChain: step.action.fromChainId.toString(),
          toChain: step.action.toChainId.toString(),
          fromToken: step.action.fromToken.symbol,
          toToken: step.action.toToken.symbol,
        })),
      },
      fees: {
        gas: totalGas.toString(),
        protocol: totalFees.toString(),
        total: (totalGas + totalFees).toString(),
      },
      rawQuote: quote,
    }
  }

  /**
   * Get transaction data for executing the swap
   */
  async getSwapTransaction(quote: UnifiedQuote, request: UnifiedQuoteRequest): Promise<UnifiedSwapTransaction> {
    switch (quote.provider) {
      case 'relay': {
        const relayQuote = quote.rawQuote as { steps: Array<{ id: string; items: Array<{ data: { chainId: number; to: string; data: string; value: string; maxFeePerGas?: string; maxPriorityFeePerGas?: string } }> }> }
        const depositStep = relayQuote.steps.find(s => s.id === 'deposit')
        if (!depositStep) throw new Error('No deposit step found')
        const txData = depositStep.items[0].data

        return {
          provider: 'relay',
          chainId: txData.chainId,
          to: txData.to,
          data: txData.data,
          value: txData.value,
          from: request.fromAddress,
          maxFeePerGas: txData.maxFeePerGas,
          maxPriorityFeePerGas: txData.maxPriorityFeePerGas,
        }
      }

      case 'rango': {
        const rangoQuote = quote.rawQuote as { requestId: string }
        const swapResponse = await rangoAPI.createSwap({
          requestId: rangoQuote.requestId,
          step: 1,
          userSettings: {
            slippage: (request.slippage || 1).toString(),
            infiniteApprove: false,
          },
        })

        if (!swapResponse.ok || !swapResponse.transaction) {
          throw new Error(swapResponse.error || 'Failed to create Rango swap')
        }

        const tx = swapResponse.transaction

        return {
          provider: 'rango',
          chainId: Number(request.fromChain.id),
          to: tx.to,
          data: tx.data || '0x',
          value: tx.value || '0',
          from: tx.from,
          gasLimit: tx.gasLimit,
          gasPrice: tx.gasPrice,
          maxFeePerGas: tx.maxFeePerGas,
          maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
        }
      }

      case 'lifi': {
        const lifiRoute = quote.rawQuote as { steps: Array<{ transactionRequest?: { chainId: number; to: string; data: string; value: string; from: string; gasLimit?: string; gasPrice?: string } }> }
        const firstStep = lifiRoute.steps[0]

        if (!firstStep.transactionRequest) {
          throw new Error('No transaction request in LI.FI route')
        }

        const tx = firstStep.transactionRequest

        return {
          provider: 'lifi',
          chainId: tx.chainId,
          to: tx.to,
          data: tx.data,
          value: tx.value,
          from: tx.from,
          gasLimit: tx.gasLimit,
          gasPrice: tx.gasPrice,
        }
      }

      default:
        throw new Error(`Unknown provider: ${quote.provider}`)
    }
  }
}

export const swapRouter = new SwapRouter()
