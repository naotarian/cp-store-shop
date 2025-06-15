'use client'

import { useState, useEffect } from 'react'
import { X, Bell, User, Ticket } from 'lucide-react'
import { getUnreadNotifications, markBannerShown } from '@/lib/api/coupons'
import { API_REFRESH_INTERVALS } from '@/lib/constants/intervals'
import type { CouponAcquisitionNotification } from '@/types/coupon'

interface NotificationBannerProps {
  onNotificationClick?: () => void
}

export function NotificationBanner({ onNotificationClick }: NotificationBannerProps) {
  const [latestNotification, setLatestNotification] = useState<CouponAcquisitionNotification | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [lastNotificationId, setLastNotificationId] = useState<string | null>(null)

  useEffect(() => {
    checkForNewNotifications()
    // 定期的に新しい通知をチェック
    const interval = setInterval(checkForNewNotifications, API_REFRESH_INTERVALS.NOTIFICATION_BANNER)
    return () => clearInterval(interval)
  }, [])

  const checkForNewNotifications = async () => {
    try {
      const response = await getUnreadNotifications()
      if (response.success && 'data' in response && response.data) {
        const apiResponse = response.data as { data: { notifications: CouponAcquisitionNotification[] } }
        const notifications = apiResponse.data?.notifications || []
        
        if (notifications.length > 0) {
          const newest = notifications[0] // 最新の通知
          
          // 新しい通知があり、かつ前回と異なる場合のみ表示
          if (newest.id !== lastNotificationId) {
            setLatestNotification(newest)
            setLastNotificationId(newest.id)
            setIsVisible(true)
            
            // 通知を表示したらバナー表示済みフラグを設定
            markBannerShown(newest.id).catch((error: unknown) => {
              console.error('Failed to mark banner as shown:', error)
            })
            
            // 5秒後に自動で非表示
            setTimeout(() => {
              setIsVisible(false)
            }, 5000)
          }
        }
      }
    } catch (error) {
      console.error('Failed to check for new notifications:', error)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  const handleClick = () => {
    setIsVisible(false)
    onNotificationClick?.()
  }

  if (!isVisible || !latestNotification) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
      <div className="bg-white border border-blue-200 rounded-lg shadow-lg p-4 max-w-sm cursor-pointer hover:shadow-xl transition-all duration-200">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 rounded-full p-1">
              <Bell className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600">新しいクーポン取得</span>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div onClick={handleClick} className="space-y-2">
          <div className="flex items-center gap-2">
            {latestNotification.user_avatar ? (
              <img 
                src={latestNotification.user_avatar} 
                alt={latestNotification.user_name}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-gray-500" />
              </div>
            )}
            <span className="font-medium text-gray-900 text-sm">
              {latestNotification.user_name}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-700">
              {latestNotification.coupon_issue.coupon.title}
            </span>
          </div>
          
          <div className="text-xs text-gray-500">
            {new Date(latestNotification.acquired_at).toLocaleString('ja-JP', {
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })} に取得
          </div>
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-100">
          <span className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            クリックして詳細を確認 →
          </span>
        </div>
      </div>
    </div>
  )
} 