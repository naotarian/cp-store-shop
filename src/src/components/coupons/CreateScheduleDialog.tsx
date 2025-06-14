'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Calendar, Users, AlertCircle, CalendarDays, Timer, Repeat } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Checkbox } from '../ui/checkbox'
import { TimePicker } from '../ui/time-picker'
import { DatePicker } from '../ui/date-picker'
import { createSchedule } from '@/lib/api/coupons'
import { getCoupons } from '@/lib/api/coupons'
import type { Coupon } from '@/types/coupon'

interface CreateScheduleDialogProps {
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

const DAY_TYPES = [
  { value: 'daily', label: '毎日', icon: Repeat, description: '毎日実行されます' },
  { value: 'weekdays', label: '平日のみ', icon: CalendarDays, description: '月曜日から金曜日まで' },
  { value: 'weekends', label: '土日のみ', icon: Calendar, description: '土曜日と日曜日のみ' },
  { value: 'custom', label: 'カスタム', icon: Timer, description: '指定した曜日のみ' },
]

export function CreateScheduleDialog({ isOpen, onClose, onSuccess }: CreateScheduleDialogProps) {
  const [loading, setLoading] = useState(false)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [formData, setFormData] = useState({
    coupon_id: '',
    schedule_name: '',
    day_type: 'daily' as 'daily' | 'weekdays' | 'weekends' | 'custom',
    custom_days: [] as number[],
    start_time: '10:00',
    end_time: '12:00',
    max_acquisitions: '',
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: '',
  })
  const [errors, setErrors] = useState<Record<string, string | string[]>>({})

  useEffect(() => {
    if (isOpen) {
      fetchCoupons()
    }
  }, [isOpen])

  const fetchCoupons = async () => {
    try {
      const response = await getCoupons()
      if (response.success && 'data' in response && response.data) {
        const apiResponse = response.data as { data: { coupons: Coupon[] } }
        setCoupons(apiResponse.data?.coupons || [])
      }
    } catch (error) {
      console.error('Failed to fetch coupons:', error)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.coupon_id) {
      newErrors.coupon_id = 'クーポンを選択してください'
    }
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
        coupon_id: formData.coupon_id,
        schedule_name: formData.schedule_name,
        day_type: formData.day_type,
        start_time: formData.start_time,
        end_time: formData.end_time,
        valid_from: formData.valid_from,
        ...(formData.day_type === 'custom' && { custom_days: formData.custom_days }),
        ...(formData.max_acquisitions && { max_acquisitions: parseInt(formData.max_acquisitions) }),
        ...(formData.valid_until && { valid_until: formData.valid_until }),
      }

      const response = await createSchedule(submitData)
      if (response.success) {
        onSuccess()
        handleClose()
      } else {
        console.error('API error response:', response)
        // バリデーションエラーがある場合は項目ごとに設定
        if ('data' in response && response.data && typeof response.data === 'object' && 'errors' in response.data) {
          setErrors(response.data.errors as Record<string, string | string[]>)
        } else {
          setErrors({ submit: response.message || 'スケジュールの作成に失敗しました' })
        }
      }
    } catch (error) {
      console.error('Failed to create schedule:', error)
      setErrors({ submit: 'スケジュールの作成に失敗しました' })
    } finally {
      setLoading(false)
    }
  }

  const handleCustomDayChange = (day: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      custom_days: checked 
        ? [...prev.custom_days, day].sort()
        : prev.custom_days.filter(d => d !== day)
    }))
  }

  const handleClose = () => {
    setFormData({
      coupon_id: '',
      schedule_name: '',
      day_type: 'daily',
      custom_days: [],
      start_time: '10:00',
      end_time: '12:00',
      max_acquisitions: '',
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: '',
    })
    setErrors({})
    onClose()
  }

  const selectedCoupon = coupons.find(c => c.id === formData.coupon_id)

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
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-purple-600" />
              新しいスケジュール作成
            </h2>
            <p className="text-sm text-gray-600 mt-1">自動でクーポンを発行するスケジュールを設定しましょう</p>
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
                <p className="text-sm text-red-600">{getErrorMessage('submit')}</p>
              </div>
            </div>
          )}

          {/* 対象クーポン選択 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              対象クーポン <span className="text-red-500">*</span>
            </label>
            <Select value={formData.coupon_id} onValueChange={(value: string) => setFormData(prev => ({ ...prev, coupon_id: value }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="クーポンを選択してください" />
              </SelectTrigger>
              <SelectContent>
                {coupons.map((coupon) => (
                  <SelectItem key={coupon.id} value={coupon.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{coupon.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCoupon && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-900">{selectedCoupon.title}</span>
                </div>
                {selectedCoupon.description && (
                  <p className="text-xs text-blue-700 mt-1">{selectedCoupon.description}</p>
                )}
              </div>
            )}
            {getErrorMessage('coupon_id') && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {getErrorMessage('coupon_id')}
              </p>
            )}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="例: 平日午後の空席時間"
            />
            {getErrorMessage('schedule_name') && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {getErrorMessage('schedule_name')}
              </p>
            )}
          </div>

          {/* 実行タイミング */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              実行タイミング <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3">
              {DAY_TYPES.map((type) => {
                const Icon = type.icon
                return (
                  <label
                    key={type.value}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.day_type === type.value
                        ? 'border-purple-500 bg-purple-50 shadow-sm'
                        : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="day_type"
                      value={type.value}
                      checked={formData.day_type === type.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, day_type: e.target.value as 'daily' | 'weekdays' | 'weekends' | 'custom', custom_days: [] }))}
                      className="sr-only"
                    />
                    <Icon className="h-5 w-5 text-gray-600 mr-3" />
                    <div>
                      <span className="text-sm font-medium text-gray-900">{type.label}</span>
                      <p className="text-xs text-gray-500">{type.description}</p>
                    </div>
                  </label>
                )
              })}
            </div>
            {getErrorMessage('day_type') && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {getErrorMessage('day_type')}
              </p>
            )}
          </div>

          {/* カスタム曜日選択 */}
          {formData.day_type === 'custom' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                実行する曜日 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-3">
                {WEEKDAYS.map((day) => (
                  <label
                    key={day.value}
                    className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.custom_days.includes(day.value)
                        ? 'border-purple-500 bg-purple-50 text-purple-900'
                        : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <Checkbox
                      id={`day-${day.value}`}
                      checked={formData.custom_days.includes(day.value)}
                      onCheckedChange={(checked: boolean) => handleCustomDayChange(day.value, checked)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{day.label}</span>
                  </label>
                ))}
              </div>
              {getErrorMessage('custom_days') && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {getErrorMessage('custom_days')}
                </p>
              )}
            </div>
          )}

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
              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Timer className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">継続時間</p>
                    <p className="text-lg font-bold text-purple-700">
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
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  theme="purple"
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
                  theme="purple"
                />
                {getErrorMessage('valid_until') && (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {getErrorMessage('valid_until')}
                  </p>
                )}
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <CalendarDays className="h-4 w-4 text-purple-600" />
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  作成中...
                </div>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  スケジュール作成
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 