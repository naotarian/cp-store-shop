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
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { getActiveCouponIssues, stopCouponIssue } from '@/lib/api/coupons'
import { API_REFRESH_INTERVALS } from '@/lib/constants/intervals'
import type { CouponIssue } from '@/types/coupon'
import { 
  Play, 
  Square, 
  Clock, 
  Users, 
  Calendar,
  AlertCircle 
} from 'lucide-react'

export function ActiveIssuesList() {
  const [issues, setIssues] = useState<CouponIssue[]>([])
  const [loading, setLoading] = useState(true)
  const [stoppingId, setStoppingId] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    issue: CouponIssue | null
  }>({ isOpen: false, issue: null })
  const toast = useToast()

  useEffect(() => {
    fetchActiveIssues()
    // 定期的に更新
    const interval = setInterval(fetchActiveIssues, API_REFRESH_INTERVALS.ACTIVE_ISSUES)
    return () => clearInterval(interval)
  }, [])

  const fetchActiveIssues = async () => {
    try {
      setLoading(true)
      const response = await getActiveCouponIssues()
      if (response.success && 'data' in response && response.data) {
        const apiResponse = response.data as { data: { active_issues: CouponIssue[] } }
        setIssues(apiResponse.data?.active_issues || [])
      }
    } catch (error) {
      console.error('Failed to fetch active issues:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStopIssue = (issue: CouponIssue) => {
    setConfirmDialog({ isOpen: true, issue })
  }

  const confirmStopIssue = async () => {
    if (!confirmDialog.issue) return

    const { id: issueId, coupon } = confirmDialog.issue
    setStoppingId(issueId)

    try {
      const response = await stopCouponIssue(issueId)
      if (response.success) {
        toast.success(
          'クーポン発行を停止しました',
          `「${coupon.title}」の発行を正常に停止しました`,
          4000
        )
        fetchActiveIssues() // 一覧を更新
      } else {
        toast.error(
          '停止に失敗しました',
          response.message || 'クーポン発行の停止中にエラーが発生しました'
        )
      }
    } catch (error) {
      console.error('Failed to stop issue:', error)
      toast.error(
        '停止に失敗しました',
        'ネットワークエラーまたはサーバーエラーが発生しました'
      )
    } finally {
      setStoppingId(null)
      setConfirmDialog({ isOpen: false, issue: null })
    }
  }

  const getStatusBadge = (issue: CouponIssue) => {
    if (!issue.is_available) {
      return <Badge variant="secondary">利用不可</Badge>
    }
    if (issue.remaining_count === 0) {
      return <Badge variant="destructive">満了</Badge>
    }
    return <Badge variant="default">発行中</Badge>
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
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-green-600" />
            発行中クーポン
            <Badge variant="secondary">{issues.length}件</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {issues.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              現在発行中のクーポンはありません
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>クーポン名</TableHead>
                    <TableHead>発行タイプ</TableHead>
                    <TableHead>状態</TableHead>
                    <TableHead>残り時間</TableHead>
                    <TableHead>取得状況</TableHead>
                    <TableHead>期間</TableHead>
                    <TableHead>発行者</TableHead>
                    <TableHead>アクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{issue.coupon.title}</div>
                          {issue.coupon.description && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {issue.coupon.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={issue.issue_type === 'manual' ? "default" : "secondary"}
                        >
                          {issue.issue_type === 'manual' ? 'スポット' : 'スケジュール'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(issue)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-orange-600" />
                          <span className="text-sm">
                            {issue.time_remaining}分
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">
                            {issue.current_acquisitions}
                            {issue.max_acquisitions && ` / ${issue.max_acquisitions}`}
                          </span>
                          {issue.remaining_count <= 5 && issue.remaining_count > 0 && (
                            <AlertCircle className="h-4 w-4 text-amber-500 ml-1" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-600" />
                          <div className="text-xs">
                            <div>{new Date(issue.start_datetime).toLocaleString('ja-JP', { 
                              year: 'numeric', 
                              month: '2-digit', 
                              day: '2-digit', 
                              weekday: 'short',
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}</div>
                            <div>〜{new Date(issue.end_datetime).toLocaleString('ja-JP', { 
                              year: 'numeric', 
                              month: '2-digit', 
                              day: '2-digit', 
                              weekday: 'short',
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {issue.issuer?.name || '不明'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStopIssue(issue)}
                          disabled={stoppingId === issue.id}
                          className="flex items-center gap-1"
                        >
                          <Square className="h-3 w-3" />
                          {stoppingId === issue.id ? '停止中...' : '停止'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* 確認ダイアログ */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, issue: null })}
        onConfirm={confirmStopIssue}
        title="クーポン発行を停止しますか？"
        message={
          confirmDialog.issue
            ? `「${confirmDialog.issue.coupon.title}」の発行を停止します。この操作は取り消せません。`
            : ''
        }
        confirmText="停止する"
        cancelText="キャンセル"
        type="danger"
        isLoading={stoppingId !== null}
      />
      
      {/* トーストコンテナ */}
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </div>
  )
} 