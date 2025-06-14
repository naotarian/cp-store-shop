'use client'

import { useState, useEffect } from 'react'
import { X, Save, Users, AlertCircle, Edit, Timer, CalendarDays, Info } from 'lucide-react'
import { TimePicker } from '../ui/time-picker'
import { DatePicker } from '../ui/date-picker'
import { updateSchedule } from '@/lib/api/coupons'
import type { CouponSchedule } from '@/types/coupon'

interface EditScheduleDialogProps {
  schedule: CouponSchedule
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const WEEKDAYS = [
  { value: 1, label: '月曜日' },
  { value: 2, label: '火曜日' },
  { value: 3, label: '水曜日' },
  { value: 4, label: '木曜日' },
  { value: 5, label: '金曜日' },
  { value: 6, label: '土曜日' },
  { value: 0, label: '日曜日' },
]

export function EditScheduleDialog({ schedule, isOpen, onClose, onSuccess }: EditScheduleDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    schedule_name: '',
    day_type: 'daily' as 'daily' | 'weekdays' | 'weekends' | 'custom',
    custom_days: [] as number[],
    start_time: '10:00',
    end_time: '12:00',
    max_acquisitions: '',
    valid_from: '',
    valid_until: '',
    is_active: true,
  })
  const [errors, setErrors] = useState<Record<string, string | string[]>>({})

  useEffect(() => {
    if (schedule && isOpen) {
      setFormData({
        schedule_name: schedule.schedule_name,
        day_type: schedule.day_type,
        custom_days: schedule.custom_days || [],
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        max_acquisitions: schedule.max_acquisitions?.toString() || '',
        valid_from: schedule.valid_from,
        valid_until: schedule.valid_until || '',
        is_active: schedule.is_active,
      })
    }
  }, [schedule, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.schedule_name.trim()) {
      newErrors.schedule_name = 'スケジュール名を入力してください'
    }
    if (formData.day_type === 'custom' && formData.custom_days.length === 0) {
      newErrors.custom_days = '実行する曜日を選択してください'
    }
    if (!formData.start_time) {
      newErrors.start_time = '開始時間を入力してください'
    }
    if (!formData.end_time) {
      newErrors.end_time = '終了時間を入力してください'
    }
    if (formData.start_time && formData.end_time && formData.start_time >= formData.end_time) {
      newErrors.end_time = '終了時間は開始時間より後に設定してください'
    }
    if (!formData.valid_from) {
      newErrors.valid_from = '有効開始日を入力してください'
    }
    if (formData.valid_until && formData.valid_from && formData.valid_until < formData.valid_from) {
      newErrors.valid_until = '有効終了日は開始日より後に設定してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const submitData = {
        ...formData,
        max_acquisitions: formData.max_acquisitions ? parseInt(formData.max_acquisitions) : undefined,
        custom_days: formData.day_type === 'custom' ? formData.custom_days : undefined,
        valid_until: formData.valid_until || undefined,
      }

      const response = await updateSchedule(schedule.id, submitData)
      if (response.success) {
        onSuccess()
        handleClose()
      } else {
        console.error('API error response:', response)
        // バリデーションエラーがある場合は項目ごとに設定
        if ('data' in response && response.data && typeof response.data === 'object' && 'errors' in response.data) {
          setErrors(response.data.errors as Record<string, string | string[]>)
        } else {
          setErrors({ submit: response.message || 'スケジュールの更新に失敗しました' })
        }
      }
    } catch (error) {
      console.error('Failed to update schedule:', error)
      setErrors({ submit: 'スケジュールの更新に失敗しました' })
    } finally {
      setLoading(false)
    }
  }

  const getDayTypeLabel = (dayType: string) => {
    switch (dayType) {
      case 'daily': return '毎日'
      case 'weekdays': return '平日のみ（月〜金）'
      case 'weekends': return '土日のみ'
      case 'custom': return 'カスタム（曜日指定）'
      default: return dayType
    }
  }

  const handleClose = () => {
    setErrors({})
    onClose()
  }

  // エラーメッセージを表示するヘルパー関数
  const getErrorMessage = (field: string): string | null => {
    const error = errors[field]
    if (!error) return null
    if (Array.isArray(error)) return error[0]
    return error
  }

  // 日付を表示用にフォーマットするヘルパー関数
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return ''
    const [year, month, day] = dateString.split('-').map(Number)
    return `${year}年${month}月${day}日`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-black supports-[backdrop-filter]:bg-background/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Edit className="h-6 w-6 text-emerald-600" />
              スケジュール編集
            </h2>
            <p className="text-sm text-gray-600 mt-1">スケジュールの設定を変更できます</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-white rounded-full p-2 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* エラー表示 */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* 対象クーポン（読み取り専用） */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">対象クーポン</label>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                 <div>
                   <div className="font-medium text-blue-900">{schedule.coupon.title}</div>
                   <div className="text-sm text-blue-700">{schedule.coupon.description}</div>
                 </div>
              </div>
            </div>
          </div>

          {/* スケジュール名 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              スケジュール名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.schedule_name}
              onChange={(e) => setFormData(prev => ({ ...prev, schedule_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              placeholder="例: 平日午後の空席時間"
            />
            {getErrorMessage('schedule_name') && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {getErrorMessage('schedule_name')}
              </p>
            )}
          </div>

          {/* 実行タイミング（読み取り専用） */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">実行タイミング</label>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="font-medium text-gray-900">{getDayTypeLabel(formData.day_type)}</div>
                  {formData.day_type === 'custom' && formData.custom_days.length > 0 && (
                    <div className="text-sm text-gray-600 mt-1">
                      {formData.custom_days.map(day => 
                        WEEKDAYS.find(w => w.value === day)?.label
                      ).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <p className="text-sm text-amber-800">
                  実行タイミングは変更できません。変更する場合は新しいスケジュールを作成してください。
                </p>
              </div>
            </div>
          </div>

          {/* 実行時間 */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              実行時間 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-500">開始時間</label>
                <TimePicker
                  value={formData.start_time}
                  onChange={(value) => setFormData(prev => ({ ...prev, start_time: value }))}
                  placeholder="開始時間を選択"
                />
                {getErrorMessage('start_time') && (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {getErrorMessage('start_time')}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-500">終了時間</label>
                <TimePicker
                  value={formData.end_time}
                  onChange={(value) => setFormData(prev => ({ ...prev, end_time: value }))}
                  placeholder="終了時間を選択"
                />
                {getErrorMessage('end_time') && (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {getErrorMessage('end_time')}
                  </p>
                )}
              </div>
            </div>
            {formData.start_time && formData.end_time && (
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Timer className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">継続時間</p>
                    <p className="text-lg font-bold text-emerald-700">
                      {Math.max(0, (new Date(`2000-01-01T${formData.end_time}`).getTime() - new Date(`2000-01-01T${formData.start_time}`).getTime()) / (1000 * 60))}分
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 取得上限 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">取得上限数</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                min="1"
                value={formData.max_acquisitions}
                onChange={(e) => setFormData(prev => ({ ...prev, max_acquisitions: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="無制限の場合は空欄"
              />
            </div>
            <p className="text-xs text-gray-500">空欄の場合は無制限になります</p>
            {getErrorMessage('max_acquisitions') && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {getErrorMessage('max_acquisitions')}
              </p>
            )}
          </div>

          {/* 有効期間 */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              有効期間 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-500">開始日</label>
                <DatePicker
                  value={formData.valid_from}
                  onChange={(value) => setFormData(prev => ({ ...prev, valid_from: value }))}
                  placeholder="開始日を選択"
                  minDate={new Date().toISOString().split('T')[0]}
                  theme="emerald"
                />
                {getErrorMessage('valid_from') && (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {getErrorMessage('valid_from')}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-500">終了日（任意）</label>
                <DatePicker
                  value={formData.valid_until}
                  onChange={(value) => setFormData(prev => ({ ...prev, valid_until: value }))}
                  placeholder="終了日を選択（任意）"
                  minDate={formData.valid_from || new Date().toISOString().split('T')[0]}
                  theme="emerald"
                />
                {getErrorMessage('valid_until') && (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {getErrorMessage('valid_until')}
                  </p>
                )}
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <CalendarDays className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">有効期間設定</p>
                  <p className="text-xs text-gray-600">
                    {formData.valid_until 
                      ? `${formData.valid_from ? formatDateForDisplay(formData.valid_from) : '未設定'} ～ ${formatDateForDisplay(formData.valid_until)}`
                      : formData.valid_from 
                        ? `${formatDateForDisplay(formData.valid_from)} ～ 無期限`
                        : '期間未設定'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 有効/無効切り替え */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">スケジュール状態</label>
            <div className="p-4 border border-gray-200 rounded-lg">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="sr-only"
                />
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.is_active ? 'bg-emerald-600' : 'bg-gray-200'
                }`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.is_active ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  スケジュールを有効にする
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-2">
                無効にすると、このスケジュールは実行されません
              </p>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              disabled={loading}
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  更新中...
                </div>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  スケジュール更新
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 