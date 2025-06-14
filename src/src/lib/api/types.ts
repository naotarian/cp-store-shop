// 認証関連の型定義
export interface LoginRequest {
  email: string
  password: string
}

export interface ShopAdmin {
  id: number
  name: string
  email: string
  role: string
  shop_id: number
  shop: {
    id: number
    name: string
    slug: string
  }
  created_at: string
  updated_at: string
}

export interface LoginResponse {
  success: boolean
  token?: string
  user?: ShopAdmin
  message?: string
}

// パスワードリセット関連の型定義
export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetResponse {
  success: boolean
  message?: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  password_confirmation: string
}

export interface ResetPasswordResponse {
  success: boolean
  message?: string
}

// ダッシュボード関連の型定義
export interface DashboardStats {
  sales: {
    current_month: number
    growth_rate: number
  }
  reviews: {
    count: number
    growth_rate: number
  }
  rating: {
    average: number
    growth_rate: number
  }
  active_users: {
    count: number
    growth_rate: number
  }
}

export interface DashboardActivity {
  type: string
  message: string
  time: string
  icon: string
} 