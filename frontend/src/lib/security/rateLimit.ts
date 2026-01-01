interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export const createRateLimiter = (config: RateLimitConfig) => {
  return {
    check: (key: string): boolean => {
      const now = Date.now()
      const entry = rateLimitStore.get(key)

      if (!entry || now > entry.resetTime) {
        rateLimitStore.set(key, {
          count: 1,
          resetTime: now + config.windowMs
        })
        return true
      }

      if (entry.count >= config.maxRequests) {
        return false
      }

      entry.count++
      return true
    },

    reset: (key: string): void => {
      rateLimitStore.delete(key)
    },

    cleanup: (): void => {
      const now = Date.now()
      for (const [key, entry] of rateLimitStore.entries()) {
        if (now > entry.resetTime) {
          rateLimitStore.delete(key)
        }
      }
    }
  }
}

export const apiRateLimiter = createRateLimiter({
  maxRequests: 30,
  windowMs: 60000
})

export const quoteRateLimiter = createRateLimiter({
  maxRequests: 10,
  windowMs: 10000
})

setInterval(() => {
  apiRateLimiter.cleanup()
  quoteRateLimiter.cleanup()
}, 60000)
