'use client'

import { useState, useEffect } from 'react'
import { Plus, Bell } from 'lucide-react'
import { getAcquisitionNotifications } from '@/lib/api/coupons'
import { API_REFRESH_INTERVALS } from '@/lib/constants/intervals'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { CouponList } from './CouponList'
import { ActiveIssuesList } from './ActiveIssuesList'
import { SchedulesList } from './SchedulesList'
import { AcquisitionNotifications } from './AcquisitionNotifications'
import { NotificationBanner } from './NotificationBanner'
import { CreateCouponDialog } from './CreateCouponDialog'

export function CouponManagement() {
  const [activeTab, setActiveTab] = useState('coupons')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0)

  useEffect(() => {
    fetchUnreadCount()
    // 定期的に未読数を更新
    const interval = setInterval(fetchUnreadCount, API_REFRESH_INTERVALS.UNREAD_COUNT)
    return () => clearInterval(interval)
  }, [])

  const fetchUnreadCount = async () => {
    try {
      const response = await getAcquisitionNotifications()
      if (response.success && 'data' in response && response.data) {
        const apiResponse = response.data as { data: { notifications: any[], unread_count: number } }
        setUnreadNotificationCount(apiResponse.data?.unread_count || 0)
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }

  const handleCreateSuccess = () => {
    setRefreshKey(prev => prev + 1) // リストを再読み込み
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === 'notifications') {
      // 通知タブが開かれたときに未読数を更新
      setTimeout(fetchUnreadCount, 1000) // 1秒後に再取得（既読処理が完了するのを待つ）
    }
  }

  const handleNotificationBannerClick = () => {
    setActiveTab('notifications')
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">クーポン管理</h1>
          <p className="text-muted-foreground">
            クーポンの作成・発行・管理を行います
          </p>
        </div>
        <button
          onClick={() => setIsCreateDialogOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4 mr-2" />
          新しいクーポン
        </button>
      </div>

      {/* タブナビゲーション */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="coupons">登録済みクーポン</TabsTrigger>
          <TabsTrigger value="active-issues">発行中クーポン</TabsTrigger>
          <TabsTrigger value="schedules">スケジュール</TabsTrigger>
          <TabsTrigger value="notifications" className="relative">
            取得通知
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="coupons">
          <CouponList key={refreshKey} />
        </TabsContent>

        <TabsContent value="active-issues">
          <ActiveIssuesList />
        </TabsContent>

        <TabsContent value="schedules">
          <SchedulesList />
        </TabsContent>

        <TabsContent value="notifications">
          <AcquisitionNotifications onUnreadCountChange={fetchUnreadCount} />
        </TabsContent>
      </Tabs>

      {/* クーポン作成モーダル */}
      <CreateCouponDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* リアルタイム通知バナー */}
      <NotificationBanner onNotificationClick={handleNotificationBannerClick} />
    </div>
  )
} 