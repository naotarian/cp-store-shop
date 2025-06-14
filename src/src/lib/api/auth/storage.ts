import type { ShopAdmin } from '../types'

// LocalStorage管理
export function saveAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token')
  }
  return null
}

export function removeAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
  }
}

export function saveUserData(user: ShopAdmin) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_data', JSON.stringify(user))
  }
}

export function getUserData(): ShopAdmin | null {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user_data')
    return userData ? JSON.parse(userData) : null
  }
  return null
}

export function removeUserData() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user_data')
  }
}

// ログイン状態確認
export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

// 認証ガード
export function requireAuth(): boolean {
  if (!isAuthenticated()) {
    // ログインページにリダイレクト
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return false
  }
  return true
}