import { authenticatedFetch, processApiResponse, handleApiError } from './client'
import type { 
  CouponsResponse, 
  ActiveIssuesResponse, 
  SchedulesResponse,
  IssueNowFormData,
  CreateCouponFormData,
  CreateCouponResponse,
  UpdateCouponFormData,
  UpdateCouponResponse,
  AcquisitionNotificationsResponse
} from '@/types/coupon'

/**
 * 店舗の全クーポン一覧を取得
 */
export async function getCoupons() {
  try {
    const response = await authenticatedFetch('/coupons')
    return await processApiResponse<CouponsResponse>(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * 現在発行中のクーポン一覧を取得
 */
export async function getActiveCouponIssues() {
  try {
    const response = await authenticatedFetch('/coupons/active-issues')
    return await processApiResponse<ActiveIssuesResponse>(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * スケジュール設定されたクーポン一覧を取得
 */
export async function getCouponSchedules() {
  try {
    const response = await authenticatedFetch('/coupons/schedules')
    return await processApiResponse<SchedulesResponse>(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * スケジュールを作成
 */
export async function createSchedule(data: {
  coupon_id: string
  schedule_name: string
  day_type: 'daily' | 'weekdays' | 'weekends' | 'custom'
  custom_days?: number[]
  start_time: string
  end_time: string
  max_acquisitions?: number
  valid_from: string
  valid_until?: string
}) {
  try {
    const response = await authenticatedFetch('/coupons/schedules', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return await processApiResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * スケジュールを更新
 */
export async function updateSchedule(id: string, data: {
  schedule_name: string
  day_type: 'daily' | 'weekdays' | 'weekends' | 'custom'
  custom_days?: number[]
  start_time: string
  end_time: string
  max_acquisitions?: number
  valid_from: string
  valid_until?: string
  is_active: boolean
}) {
  try {
    const response = await authenticatedFetch(`/coupons/schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    return await processApiResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * スケジュールを削除
 */
export async function deleteSchedule(id: string) {
  try {
    const response = await authenticatedFetch(`/coupons/schedules/${id}`, {
      method: 'DELETE'
    })
    return await processApiResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * スケジュールの有効/無効を切り替え
 */
export async function toggleScheduleStatus(id: string) {
  try {
    const response = await authenticatedFetch(`/coupons/schedules/${id}/toggle-status`, {
      method: 'PATCH'
    })
    return await processApiResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * クーポンを即座に発行（スポット発行）
 */
export async function issueCouponNow(couponId: string, data: IssueNowFormData) {
  try {
    const response = await authenticatedFetch(`/coupons/${couponId}/issue-now`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return await processApiResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * クーポン発行を停止
 */
export async function stopCouponIssue(issueId: string) {
  try {
    const response = await authenticatedFetch(`/coupons/issues/${issueId}/stop`, {
      method: 'POST',
    })
    return await processApiResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * 新しいクーポンを作成
 */
export async function createCoupon(data: CreateCouponFormData) {
  try {
    const response = await authenticatedFetch('/coupons', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return await processApiResponse<CreateCouponResponse>(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * クーポンを更新
 */
export async function updateCoupon(id: string, data: UpdateCouponFormData) {
  try {
    const response = await authenticatedFetch(`/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return await processApiResponse<UpdateCouponResponse>(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * クーポン取得通知一覧を取得（全ての通知）
 */
export async function getAcquisitionNotifications() {
  try {
    const response = await authenticatedFetch('/coupons/acquisition-notifications')
    return await processApiResponse<AcquisitionNotificationsResponse>(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * 未読のクーポン取得通知のみを取得（バナー表示用）
 */
export async function getUnreadNotifications() {
  try {
    const response = await authenticatedFetch('/coupons/unread-notifications')
    return await processApiResponse<AcquisitionNotificationsResponse>(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * 取得通知を既読にする
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    const response = await authenticatedFetch(`/coupons/acquisition-notifications/${notificationId}/read`, {
      method: 'POST',
    })
    return await processApiResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * 全ての取得通知を既読にする
 */
export async function markAllNotificationsAsRead() {
  try {
    const response = await authenticatedFetch('/coupons/acquisition-notifications/read-all', {
      method: 'POST',
    })
    return await processApiResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * 通知をバナー表示済みにする
 */
export async function markBannerShown(notificationId: string) {
  try {
    const response = await authenticatedFetch(`/coupons/acquisition-notifications/${notificationId}/banner-shown`, {
      method: 'POST',
    })
    return await processApiResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
} 