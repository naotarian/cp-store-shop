import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loginApi } from '../auth/auth'
import { saveAuthToken, removeAuthToken, getAuthToken } from '../auth/storage'

// モックの設定
global.fetch = vi.fn()
const mockFetch = fetch as vi.MockedFunction<typeof fetch>

// LocalStorageのモック
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
  })

  describe('loginApi', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        access_token: 'test-token',
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          role: 'admin',
          shop_id: 1,
          shop: {
            id: 1,
            name: 'Test Shop',
            slug: 'test-shop'
          }
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await loginApi({
        email: 'test@example.com',
        password: 'password'
      })

      expect(result.success).toBe(true)
      expect(result.token).toBe('test-token')
      expect(result.user?.name).toBe('Test User')
    })

    it('should handle login failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Invalid credentials' }),
      } as Response)

      const result = await loginApi({
        email: 'test@example.com',
        password: 'wrong-password'
      })

      expect(result.success).toBe(false)
      expect(result.message).toBe('Invalid credentials')
    })
  })

  describe('Storage functions', () => {
    it('should save and retrieve auth token', () => {
      localStorageMock.getItem.mockReturnValue('test-token')
      
      saveAuthToken('test-token')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', 'test-token')
      
      const token = getAuthToken()
      expect(localStorageMock.getItem).toHaveBeenCalledWith('auth_token')
      expect(token).toBe('test-token')
    })

    it('should remove auth token', () => {
      removeAuthToken()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token')
    })
  })
}) 