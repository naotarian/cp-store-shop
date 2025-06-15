'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ToastContainer, useToast } from '@/components/ui/toast'
import { 
  getAcquisitionNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from '@/lib/api/coupons'
import { API_REFRESH_INTERVALS } from '@/lib/constants/intervals'
import type { CouponAcquisitionNotification } from '@/types/coupon'
import { 
  Bell, 
  BellRing, 
  Check, 
  CheckCheck, 
  User, 
  Calendar,
  Ticket,
  Zap,
  Clock
} from 'lucide-react'

interface AcquisitionNotificationsProps {
  onUnreadCountChange?: () => void
}

export function AcquisitionNotifications({ onUnreadCountChange }: AcquisitionNotificationsProps) {
  const [notifications, setNotifications] = useState<CouponAcquisitionNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null)
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false)
  const toast = useToast()

  useEffect(() => {
    fetchNotifications()
    // 定期的に更新
    const interval = setInterval(fetchNotifications, API_REFRESH_INTERVALS.NOTIFICATION_LIST)
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await getAcquisitionNotifications()
      if (response.success && 'data' in response && response.data) {
        const apiResponse = response.data as { data: { notifications: CouponAcquisitionNotification[], unread_count: number } }
        setNotifications(apiResponse.data?.notifications || [])
        setUnreadCount(apiResponse.data?.unread_count || 0)
      }
    } catch (error) {
      console.error('Failed to fetch acquisition notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    setMarkingAsRead(notificationId)
    try {
      const response = await markNotificationAsRead(notificationId)
      if (response.success) {
        fetchNotifications() // 一覧を更新
        onUnreadCountChange?.() // 親コンポーネントの未読数を更新
        toast.addToast({
          type: 'success',
          title: '既読にしました',
          message: '通知を既読にしました'
        })
      } else {
        toast.addToast({
          type: 'error',
          title: 'エラー',
          message: response.message || '既読処理に失敗しました'
        })
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      toast.addToast({
        type: 'error',
        title: 'エラー',
        message: 'ネットワークエラーが発生しました'
      })
    } finally {
      setMarkingAsRead(null)
    }
  }

  const handleMarkAllAsRead = async () => {
    setMarkingAllAsRead(true)
    try {
      const response = await markAllNotificationsAsRead()
      if (response.success) {
        fetchNotifications() // 一覧を更新
        onUnreadCountChange?.() // 親コンポーネントの未読数を更新
        toast.addToast({
          type: 'success',
          title: '全て既読にしました',
          message: '全ての通知を既読にしました'
        })
      } else {
        toast.addToast({
          type: 'error',
          title: 'エラー',
          message: response.message || '一括既読処理に失敗しました'
        })
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
      toast.addToast({
        type: 'error',
        title: 'エラー',
        message: 'ネットワークエラーが発生しました'
      })
    } finally {
      setMarkingAllAsRead(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'たった今'
    if (minutes < 60) return `${minutes}分前`
    if (hours < 24) return `${hours}時間前`
    if (days < 7) return `${days}日前`
    
    return date.toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getIssueTypeBadge = (issueType: string) => {
    return (
      <Badge 
        variant={issueType === 'manual' ? "default" : "secondary"}
        className={issueType === 'manual' ? "bg-orange-600 text-white" : "bg-purple-600 text-white"}
      >
        {issueType === 'manual' ? (
          <><Zap className="h-3 w-3 mr-1" />スポット</>
        ) : (
          <><Clock className="h-3 w-3 mr-1" />スケジュール</>
        )}
      </Badge>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">読み込み中...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-blue-600" />
              <CardTitle>クーポン取得通知</CardTitle>
              <Badge variant="secondary">{notifications.length}件</Badge>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="bg-red-600">
                  未読 {unreadCount}件
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleMarkAllAsRead}
                disabled={markingAllAsRead}
                className="flex items-center gap-1"
              >
                <CheckCheck className="h-4 w-4" />
                {markingAllAsRead ? '処理中...' : '全て既読'}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">まだ通知がありません</p>
              <p className="text-sm">ユーザーがクーポンを取得すると、ここに通知が表示されます</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>状態</TableHead>
                    <TableHead>ユーザー</TableHead>
                    <TableHead>クーポン</TableHead>
                    <TableHead>発行タイプ</TableHead>
                    <TableHead>取得日時</TableHead>
                    <TableHead>アクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => (
                    <TableRow 
                      key={notification.id}
                      className={!notification.is_read ? "bg-blue-50" : ""}
                    >
                      <TableCell>
                        {!notification.is_read ? (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <span className="text-sm font-medium text-blue-600">新着</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">既読</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {notification.user_avatar ? (
                            <img 
                              src={notification.user_avatar} 
                              alt={notification.user_name}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-500" />
                            </div>
                          )}
                          <span className="font-medium">{notification.user_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center gap-1">
                            <Ticket className="h-4 w-4 text-green-600" />
                            {notification.coupon_issue.coupon.title}
                          </div>
                          {notification.coupon_issue.coupon.description && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {notification.coupon_issue.coupon.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getIssueTypeBadge(notification.coupon_issue.issue_type)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-600" />
                          <div className="text-sm">
                            <div>{formatTimeAgo(notification.acquired_at)}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(notification.acquired_at).toLocaleString('ja-JP', { 
                                year: 'numeric', 
                                month: '2-digit', 
                                day: '2-digit', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {!notification.is_read && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkAsRead(notification.id)}
                            disabled={markingAsRead === notification.id}
                            className="flex items-center gap-1"
                          >
                            <Check className="h-3 w-3" />
                            {markingAsRead === notification.id ? '処理中...' : '既読'}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* トーストコンテナ */}
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </div>
  )
} 