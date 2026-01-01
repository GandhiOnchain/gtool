const STORAGE_PREFIX = 'relay_secure_'
const MAX_STORAGE_SIZE = 5 * 1024 * 1024

interface StorageData<T = unknown> {
  value: T
  timestamp: number
  checksum: string
}

const generateChecksum = (data: string): string => {
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString(36)
}

const verifyChecksum = (data: string, checksum: string): boolean => {
  return generateChecksum(data) === checksum
}

export const secureStorage = {
  setItem: <T = unknown>(key: string, value: T): boolean => {
    try {
      const prefixedKey = STORAGE_PREFIX + key
      const dataString = JSON.stringify(value)
      
      if (dataString.length > MAX_STORAGE_SIZE) {
        console.warn('Data exceeds maximum storage size')
        return false
      }

      const storageData: StorageData<T> = {
        value,
        timestamp: Date.now(),
        checksum: generateChecksum(dataString)
      }

      localStorage.setItem(prefixedKey, JSON.stringify(storageData))
      return true
    } catch (error) {
      console.error('Secure storage write error:', error)
      return false
    }
  },

  getItem: <T = unknown>(key: string): T | null => {
    try {
      const prefixedKey = STORAGE_PREFIX + key
      const stored = localStorage.getItem(prefixedKey)
      
      if (!stored) return null

      const storageData: StorageData<T> = JSON.parse(stored)
      const dataString = JSON.stringify(storageData.value)

      if (!verifyChecksum(dataString, storageData.checksum)) {
        console.warn('Data integrity check failed, removing corrupted data')
        localStorage.removeItem(prefixedKey)
        return null
      }

      return storageData.value as T
    } catch (error) {
      console.error('Secure storage read error:', error)
      return null
    }
  },

  removeItem: (key: string): void => {
    try {
      const prefixedKey = STORAGE_PREFIX + key
      localStorage.removeItem(prefixedKey)
    } catch (error) {
      console.error('Secure storage remove error:', error)
    }
  },

  clear: (): void => {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Secure storage clear error:', error)
    }
  }
}
