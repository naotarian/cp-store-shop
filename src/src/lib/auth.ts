// 新しいAPI構造を使用するため、このファイルは非推奨です
// 代わりに src/lib/api/ ディレクトリの関数を使用してください

// 後方互換性のため、新しいAPI関数をre-exportします
export {
  // 型定義
  type LoginRequest,
  type ShopAdmin,
  type LoginResponse,
  type PasswordResetRequest,
  type PasswordResetResponse,
  type ResetPasswordRequest,
  type ResetPasswordResponse,
  type DashboardStats,
  type DashboardActivity,
  // 認証関連
  loginApi,
  logoutApi,
  getCurrentUser,
  sendPasswordResetEmail,
  resetPassword,
  // ストレージ関連
  getAuthToken,
  saveAuthToken,
  removeAuthToken,
  saveUserData,
  getUserData,
  removeUserData,
  isAuthenticated,
  requireAuth,
  // クライアント関連
  authenticatedFetch,
  // ダッシュボード関連
  getDashboardStats,
  getDashboardActivities
} from './api' 