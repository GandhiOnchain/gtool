import { isAddress } from 'viem'

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}

export const validateAddress = (address: string): boolean => {
  return isAddress(address)
}

export const validateAmount = (amount: string, decimals: number = 18): boolean => {
  if (!amount || amount === '0' || amount === '') return false
  
  const regex = /^\d*\.?\d*$/
  if (!regex.test(amount)) return false
  
  const parts = amount.split('.')
  if (parts.length > 2) return false
  if (parts[1] && parts[1].length > decimals) return false
  
  try {
    const num = parseFloat(amount)
    return num > 0 && isFinite(num)
  } catch {
    return false
  }
}

export const validateChainId = (chainId: number): boolean => {
  return Number.isInteger(chainId) && chainId > 0
}

export const sanitizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return ''
    }
    return parsed.toString()
  } catch {
    return ''
  }
}

export const validateSlippage = (slippage: string): boolean => {
  const num = parseFloat(slippage)
  return !isNaN(num) && num >= 0 && num <= 50
}
