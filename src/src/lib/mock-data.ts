import { Shop, ShopUser } from '@/types/shop'

export const mockShop: Shop = {
  id: '1',
  name: 'カフェ・ド・パリ',
  description: '本格的なフランス料理とコーヒーを楽しめるカフェです',
  address: '東京都渋谷区神南1-1-1',
  phone: '03-1234-5678',
  email: 'info@cafe-de-paris.com',
  website: 'https://cafe-de-paris.com',
  category: 'カフェ・レストラン',
  rating: 4.5,
  reviewCount: 128,
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-06-13T00:00:00Z'
}

export const mockUser: ShopUser = {
  id: '1',
  shopId: '1',
  name: '田中 太郎',
  email: 'tanaka@cafe-de-paris.com',
  role: 'owner'
} 