export type DiscountType = 'percentage' | 'fixed' | 'free'
export type IssueType = 'manual' | 'batch_generated'
export type CouponStatus = 'active' | 'expired' | 'full' | 'cancelled'
export type AcquisitionStatus = 'active' | 'used' | 'expired'

export interface Coupon {
  id: string
  title: string
  description: string
  conditions?: string
  notes?: string
  image_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
  // 統計情報
  active_issues_count: number
  schedules_count: number
  total_issues_count: number
}

export interface CouponIssue {
  id: string
  coupon_id: string
  issue_type: IssueType
  start_datetime: string
  end_datetime: string
  duration_minutes: number
  max_acquisitions?: number
  current_acquisitions: number
  remaining_count: number
  time_remaining: string
  is_available: boolean
  status: CouponStatus
  issued_at: string
  // リレーション
  coupon: {
    id: string
    title: string
    description?: string
    conditions?: string
    notes?: string
  }
  issuer?: {
    id: string
    name: string
  }
}

export interface CouponSchedule {
  id: string
  coupon_id: string
  schedule_name: string
  day_type: 'daily' | 'weekdays' | 'weekends' | 'custom'
  day_type_display: string
  custom_days?: number[]
  start_time: string
  end_time: string
  time_range_display: string
  duration_minutes: number
  max_acquisitions?: number
  valid_from: string
  valid_until?: string
  is_active: boolean
  last_batch_processed_date?: string
  // リレーション
  coupon: {
    id: string
    title: string
    description?: string
    conditions?: string
    notes?: string
  }
}

export interface CouponAcquisition {
  id: string
  coupon_issue_id: string
  user_id: string
  acquired_at: string
  used_at?: string
  expired_at: string
  status: AcquisitionStatus
  processed_by?: string
  usage_notes?: string
  // 計算プロパティ
  is_expired: boolean
  is_usable: boolean
  time_until_expiry: string
}

// 取得通知用の型定義
export interface CouponAcquisitionNotification {
  id: string
  coupon_issue_id: string
  user_id: string
  user_name: string
  user_avatar?: string
  acquired_at: string
  is_read: boolean
  // リレーション
  coupon_issue: {
    id: string
    issue_type: IssueType
    status: CouponStatus
    coupon: {
      id: string
      title: string
      description?: string
    }
  }
}

// 取得通知のAPI レスポンス型
export interface AcquisitionNotificationsResponse {
  status: 'success' | 'error'
  data: {
    notifications: CouponAcquisitionNotification[]
    unread_count: number
  }
}

// API レスポンス型
export interface CouponsResponse {
  status: 'success' | 'error'
  data: {
    coupons: Coupon[]
  }
}

export interface ActiveIssuesResponse {
  status: 'success' | 'error'
  data: {
    active_issues: CouponIssue[]
  }
}

export interface SchedulesResponse {
  status: 'success' | 'error'
  data: {
    schedules: CouponSchedule[]
  }
}

// フォーム型
export interface IssueNowFormData {
  duration_minutes: number
  max_acquisitions?: number
}

export interface CreateCouponFormData {
  title: string
  description: string
  conditions?: string
  notes?: string
  image_url?: string
}

export interface UpdateCouponFormData {
  title: string
  description: string
  conditions?: string
  notes?: string
  image_url?: string
}

export interface CreateCouponResponse {
  status: 'success' | 'error'
  message: string
  data: {
    coupon: Coupon
  }
}

export interface UpdateCouponResponse {
  status: 'success' | 'error'
  message: string
  data: {
    coupon: Coupon
  }
} 