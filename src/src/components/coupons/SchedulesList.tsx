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
import { getCouponSchedules, deleteSchedule, toggleScheduleStatus } from '@/lib/api/coupons'
import type { CouponSchedule } from '@/types/coupon'
import { 
  Calendar,
  Clock,
  Users,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Pause,
  Power,
  Info
} from 'lucide-react'
import { CreateScheduleDialog } from './CreateScheduleDialog'
import { EditScheduleDialog } from './EditScheduleDialog'

export function SchedulesList() {
  const [schedules, setSchedules] = useState<CouponSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<CouponSchedule | null>(null)

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    try {
      setLoading(true)
      const response = await getCouponSchedules()
      if (response.success && 'data' in response && response.data) {
        const apiResponse = response.data as { data: { schedules: CouponSchedule[] } }
        setSchedules(apiResponse.data?.schedules || [])
      }
    } catch (error) {
      console.error('Failed to fetch schedules:', error)
      alert('スケジュールの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSuccess = () => {
    fetchSchedules()
    setIsCreateDialogOpen(false)
    alert('スケジュールを作成しました')
  }

  const handleEditSuccess = () => {
    fetchSchedules()
    setEditingSchedule(null)
    alert('スケジュールを更新しました')
  }

  const handleDelete = async (schedule: CouponSchedule) => {
    if (!confirm(`「${schedule.schedule_name}」を削除してもよろしいですか？\n\n※ スケジュール設定のみが削除され、クーポン自体や発行済みクーポンは削除されません。\n※ この操作は取り消せません。`)) {
      return
    }

    try {
      const response = await deleteSchedule(schedule.id)
      if (response.success) {
        fetchSchedules()
        alert('スケジュールを削除しました')
      } else {
        alert('削除に失敗しました')
      }
    } catch (error) {
      console.error('Failed to delete schedule:', error)
      alert('削除に失敗しました')
    }
  }

  const handleToggleStatus = async (schedule: CouponSchedule) => {
    const action = schedule.is_active ? '無効' : '有効'
    const message = schedule.is_active 
      ? `「${schedule.schedule_name}」を無効にしてもよろしいですか？\n\n※ 今後の自動クーポン発行が停止されます。\n※ 現在発行中のクーポンには影響しません。`
      : `「${schedule.schedule_name}」を有効にしてもよろしいですか？\n\n※ 設定された時間に自動でクーポンが発行されるようになります。`
    
    if (!confirm(message)) {
      return
    }

    try {
      const response = await toggleScheduleStatus(schedule.id)
      if (response.success) {
        fetchSchedules()
        alert(`スケジュールを${action}にしました`)
      } else {
        alert(`${action}化に失敗しました`)
      }
    } catch (error) {
      console.error('Failed to toggle schedule status:', error)
      alert(`${action}化に失敗しました`)
    }
  }

  const getStatusBadge = (schedule: CouponSchedule) => {
    if (!schedule.is_active) {
      return (
        <Badge variant="secondary">
          <Pause className="h-3 w-3 mr-1" />
          停止中
        </Badge>
      )
    }

    return (
      <Badge variant="default" className="bg-green-600">
        <CheckCircle className="h-3 w-3 mr-1" />
        有効
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
              <Calendar className="h-5 w-5 text-blue-600" />
              <CardTitle>スケジュール設定</CardTitle>
              <Badge variant="secondary">{schedules.length}件</Badge>
            </div>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4 mr-2" />
              新しいスケジュール
            </Button>
          </div>
        </CardHeader>
        <CardContent>


          {schedules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">スケジュールが設定されていません</p>
              <p className="text-sm">「新しいスケジュール」ボタンから作成してください</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>スケジュール名</TableHead>
                    <TableHead>クーポン</TableHead>
                    <TableHead>実行タイミング</TableHead>
                    <TableHead>実行時間</TableHead>
                    <TableHead>取得上限</TableHead>
                    <TableHead>状態</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>
                        <div className="font-medium">{schedule.schedule_name}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{schedule.coupon.title}</div>             
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-purple-600" />
                          <span className="text-sm">
                            {schedule.day_type_display}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">
                            {schedule.time_range_display}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">
                            {schedule.max_acquisitions || '無制限'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(schedule)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(schedule)}
                            className={schedule.is_active 
                              ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50" 
                              : "text-green-600 hover:text-green-700 hover:bg-green-50"
                            }
                            title={schedule.is_active ? "今後の自動発行を停止" : "自動発行を開始"}
                          >
                            <Power className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingSchedule(schedule)}
                            title="スケジュール設定を編集"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(schedule)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="スケジュール設定を削除"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* 操作ボタンの説明 */}
          {schedules.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  <p className="font-medium mb-2">操作ボタンの説明</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2 py-1 border border-orange-200 rounded text-orange-600 bg-orange-50">
                        <Power className="h-3 w-3" />
                      </div>
                      <span className="text-xs"><strong>停止/開始</strong>：自動発行の制御</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2 py-1 border border-gray-200 rounded text-gray-600 bg-white">
                        <Edit className="h-3 w-3" />
                      </div>
                      <span className="text-xs"><strong>編集</strong>：スケジュール設定の変更</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2 py-1 border border-red-200 rounded text-red-600 bg-red-50">
                        <Trash2 className="h-3 w-3" />
                      </div>
                      <span className="text-xs"><strong>削除</strong>：スケジュール設定の削除</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
           {/* 注意事項 */}
           <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg mt-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-2">スケジュール操作について</p>
                <ul className="space-y-1 text-blue-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>停止</strong>：今後の自動クーポン発行を停止します。現在発行中のクーポンには影響しません。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>削除</strong>：スケジュール設定のみを削除します。クーポン自体や発行済みクーポンは削除されません。</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* スケジュール作成ダイアログ */}
      <CreateScheduleDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* スケジュール編集ダイアログ */}
      {editingSchedule && (
        <EditScheduleDialog
          schedule={editingSchedule}
          isOpen={!!editingSchedule}
          onClose={() => setEditingSchedule(null)}
          onSuccess={handleEditSuccess}
        />
      )}


    </div>
  )
} 