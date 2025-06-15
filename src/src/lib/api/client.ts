// API設定
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!

// 認証トークン取得をインポート
import { getAuthToken, removeAuthToken, removeUserData } from './auth/storage'

// 認証付きfetch関数
export async function authenticatedFetch(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken()
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, config)
  
  // 401エラー（認証エラー）の場合はログイン画面にリダイレクト
  if (response.status === 401) {
    // トークンをクリア
    removeAuthToken()
    removeUserData()
    // ログイン画面にリダイレクト
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }
  
  return response
}

// 通常のAPIリクエスト用のヘルパー関数
export async function apiFetch(url: string, options: RequestInit = {}) {
  // クライアントサイドでのみ実行
  if (typeof window === 'undefined') {
    throw new Error('API calls are only allowed on the client side')
  }

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  }

  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  })
}

// API共通のレスポンス型
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
}

// APIレスポンス処理
export async function processApiResponse<T>(response: Response): Promise<{ success: boolean; data?: T; message?: string }> {
  try {
    const data = await response.json()
    
    if (!response.ok) {
      // 422エラー（バリデーションエラー）の場合は、errorsフィールドも含めて返す
      if (response.status === 422 && data.errors) {
        return {
          success: false,
          message: data.message || 'バリデーションエラーが発生しました',
          data: { errors: data.errors } as T
        }
      }
      
      return {
        success: false,
        message: data.message || `HTTP error! status: ${response.status}`
      }
    }

    return {
      success: true,
      data: data as T,
      message: data.message
    }
  } catch {
    return {
      success: false,
      message: 'レスポンスの解析に失敗しました'
    }
  }
}

// エラーハンドリング
export function handleApiError(error: unknown): { success: boolean; message: string } {
  console.error('API Error:', error)
  
  if (error instanceof Error) {
    return {
      success: false,
      message: error.message
    }
  }
  
  return {
    success: false,
    message: 'APIエラーが発生しました'
  }
}

