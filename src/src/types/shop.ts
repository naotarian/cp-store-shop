export interface Shop {
  id: string
  name: string
  description?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  category?: string
  rating?: number
  reviewCount?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ShopUser {
  id: string
  shopId: string
  name: string
  email: string
  role: 'owner' | 'manager' | 'staff'
} 