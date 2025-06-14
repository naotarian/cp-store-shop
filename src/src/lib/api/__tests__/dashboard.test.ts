import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getDashboardStats, getDashboardActivities } from '../dashboard/dashboard'

// モックの設定
global.fetch = vi.fn()
const mockFetch = fetch as vi.MockedFunction<typeof fetch>

// LocalStorageのモック
const localStorageMock = {
  getItem: vi.fn(() => 'test-token'),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Dashboard API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getDashboardStats', () => {
    it('should fetch dashboard stats successfully', async () => {
      const mockStats = {
        sales: {
          current_month: 150000,
          growth_rate: 12.5
        },
        reviews: {
          count: 45,
          growth_rate: 8.2
        },
        rating: {
          average: 4.8,
          growth_rate: 2.1
        },
        active_users: {
          count: 1250,
          growth_rate: 15.3
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      } as Response)

      const result = await getDashboardStats()

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockStats)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/admin/dashboard/stats',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token'
          })
        })
      )
    })

    it('should handle API error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Unauthorized' }),
      } as Response)

      const result = await getDashboardStats()

      expect(result.success).toBe(false)
      expect(result.message).toBe('Unauthorized')
    })
  })

  describe('getDashboardActivities', () => {
    it('should fetch dashboard activities successfully', async () => {
      const mockActivities = [
        {
          type: 'order',
          message: '新しい注文が入りました',
          time: '2分前',
          icon: 'shopping-cart'
        },
        {
          type: 'review',
          message: '新しいレビューが投稿されました',
          time: '5分前',
          icon: 'star'
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockActivities,
      } as Response)

      const result = await getDashboardActivities()

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockActivities)
      expect(result.data).toHaveLength(2)
    })
  })
}) 