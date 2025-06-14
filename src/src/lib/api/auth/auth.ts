import { apiFetch, authenticatedFetch, processApiResponse, handleApiError } from '../client'
import type { 
  LoginRequest, 
  LoginResponse, 
  ShopAdmin,
  PasswordResetRequest,
  PasswordResetResponse,
  ResetPasswordRequest,
  ResetPasswordResponse
} from '../types'

// ログイン
export async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
  try {
    console.log('Attempting login with:', { email: credentials.email })
    
    const response = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    console.log('Login response status:', response.status)

    const result = await processApiResponse<{ access_token?: string; token?: string; user?: ShopAdmin; shop_admin?: ShopAdmin }>(response)
    
    if (!result.success) {
      console.error('Login failed:', result.message)
      return {
        success: false,
        message: result.message
      }
    }

    console.log('Login successful')
    
    // Laravelの標準的なレスポンス形式に対応
    return {
      success: true,
      token: result.data?.access_token || result.data?.token || '',
      user: result.data?.user || result.data?.shop_admin
    }
  } catch (error) {
    console.error('Login API error:', error)
    
    // より詳細なエラーメッセージ
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return {
        success: false,
        message: 'APIサーバーに接続できません。サーバーが起動しているか確認してください。'
      }
    }
    
    return handleApiError(error)
  }
}

// ログアウト
export async function logoutApi(): Promise<{ success: boolean }> {
  try {
    const response = await authenticatedFetch('/auth/logout', {
      method: 'POST',
    })

    // APIの成功/失敗に関わらず、ローカルの認証情報は削除
    const { removeAuthToken, removeUserData } = await import('./storage')
    removeAuthToken()
    removeUserData()

    return { success: response.ok }
  } catch (error) {
    console.error('Logout API error:', error)
    
    // エラーでも認証情報は削除
    const { removeAuthToken, removeUserData } = await import('./storage')
    removeAuthToken()
    removeUserData()
    
    return { success: false }
  }
}

// ユーザー情報取得
export async function getCurrentUser(): Promise<{ success: boolean; user?: ShopAdmin; message?: string }> {
  try {
    const response = await authenticatedFetch('/auth/me')
    const result = await processApiResponse<ShopAdmin>(response)

    if (!result.success) {
      return {
        success: false,
        message: result.message
      }
    }

    return {
      success: true,
      user: result.data
    }
  } catch (error) {
    return handleApiError(error)
  }
}

// パスワードリセットメール送信
export async function sendPasswordResetEmail(request: PasswordResetRequest): Promise<PasswordResetResponse> {
  try {
    const response = await apiFetch('/auth/password/email', {
      method: 'POST',
      body: JSON.stringify(request),
    })

    const result = await processApiResponse(response)
    
    return {
      success: result.success,
      message: result.message || (result.success ? 'パスワードリセットメールを送信しました' : undefined)
    }
  } catch (error) {
    return handleApiError(error)
  }
}

// パスワードリセット
export async function resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  try {
    const response = await apiFetch('/auth/password/reset', {
      method: 'POST',
      body: JSON.stringify(request),
    })

    const result = await processApiResponse(response)
    
    return {
      success: result.success,
      message: result.message || (result.success ? 'パスワードを再設定しました' : undefined)
    }
  } catch (error) {
    return handleApiError(error)
  }
}