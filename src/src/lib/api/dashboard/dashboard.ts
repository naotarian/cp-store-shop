import { authenticatedFetch, processApiResponse, handleApiError } from '../client'
import type { DashboardStats, DashboardActivity } from '../types'

// ダッシュボード統計情報取得
export async function getDashboardStats(): Promise<{ success: boolean; data?: DashboardStats; message?: string }> {
  try {
    const response = await authenticatedFetch('/dashboard/stats')
    const result = await processApiResponse<DashboardStats>(response)

    return {
      success: result.success,
      data: result.data,
      message: result.message
    }
  } catch (error) {
    return handleApiError(error)
  }
}

// ダッシュボードアクティビティ取得
export async function getDashboardActivities(): Promise<{ success: boolean; data?: DashboardActivity[]; message?: string }> {
  try {
    const response = await authenticatedFetch('/dashboard/activities')
    const result = await processApiResponse<DashboardActivity[]>(response)

    return {
      success: result.success,
      data: result.data,
      message: result.message
    }
  } catch (error) {
    return handleApiError(error)
  }
}