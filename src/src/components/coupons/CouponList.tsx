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
import { getCoupons } from '@/lib/api/coupons'
import { IssueNowDialog } from './IssueNowDialog'
import { EditCouponDialog } from './EditCouponDialog'
import type { Coupon } from '@/types/coupon'
import { Play, Clock, Ticket, Edit } from 'lucide-react'

interface CouponListProps {
  onRefresh?: () => void
}

export function CouponList({ onRefresh }: CouponListProps) {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [showIssueDialog, setShowIssueDialog] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const toast = useToast()

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      setLoading(true)
      const response = await getCoupons()
      if (response.success && 'data' in response && response.data) {
        // APIレスポンスの構造に合わせて修正
        const apiResponse = response.data as { data: { coupons: Coupon[] } }
        setCoupons(apiResponse.data?.coupons || [])
      }
    } catch (error) {
      console.error('Failed to fetch coupons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleIssueNow = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
    setShowIssueDialog(true)
  }

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setShowEditDialog(true)
  }

  const handleEditSuccess = () => {
    fetchCoupons() // リストを再読み込み
    onRefresh?.() // 親コンポーネントにも通知
    toast.addToast({
      type: 'success',
      title: '更新完了',
      message: 'クーポンが正常に更新されました'
    })
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
            <Ticket className="h-5 w-5" />
            登録済みクーポン
            <Badge variant="secondary">{coupons.length}件</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {coupons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              登録されたクーポンがありません
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>クーポン名</TableHead>
                    <TableHead>状態</TableHead>
                    <TableHead>スケジュール</TableHead>
                    <TableHead>総発行回数</TableHead>
                    <TableHead>アクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{coupon.title}</div>
                          {coupon.description && (
                            <div className="text-sm text-muted-foreground">
                              {coupon.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                     
                      <TableCell>
                        <Badge 
                          variant={coupon.active_issues_count ? "default" : "secondary"}
                          className={coupon.active_issues_count ? "bg-green-600 text-white" : "bg-gray-500 text-white"}
                        >
                          {coupon.active_issues_count ? "発行中" : "停止中"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span>{coupon.schedules_count}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">
                          {coupon.total_issues_count}回
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(coupon)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-3 w-3" />
                            編集
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleIssueNow(coupon)}
                            disabled={!coupon.is_active}
                            className="flex items-center gap-1"
                          >
                            <Play className="h-3 w-3" />
                            即時発行
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 即時発行ダイアログ */}
      {selectedCoupon && (
        <IssueNowDialog
          coupon={selectedCoupon}
          open={showIssueDialog}
          onOpenChange={setShowIssueDialog}
          onSuccess={fetchCoupons}
          toast={toast}
        />
      )}

      {/* 編集ダイアログ */}
      <EditCouponDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onSuccess={handleEditSuccess}
        coupon={editingCoupon}
      />
      
      {/* トーストコンテナ */}
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </div>
  )
} 