'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { issueCouponNow } from '@/lib/api/coupons'
import type { Coupon, IssueNowFormData } from '@/types/coupon'
import { Clock, Users, Play } from 'lucide-react'

interface ToastFunctions {
  success: (title: string, message?: string, duration?: number) => void
  error: (title: string, message?: string, duration?: number) => void
}

interface IssueNowDialogProps {
  coupon: Coupon
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  toast: ToastFunctions
}

export function IssueNowDialog({ 
  coupon, 
  open, 
  onOpenChange, 
  onSuccess,
  toast
}: IssueNowDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<IssueNowFormData>({
    duration_minutes: 60, // デフォルト1時間
    max_acquisitions: undefined
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      const response = await issueCouponNow(coupon.id, formData)
      
      if (response.success) {
        const durationText = durationOptions.find(opt => opt.value === formData.duration_minutes)?.label || `${formData.duration_minutes}分`
        const limitText = formData.max_acquisitions ? `（上限${formData.max_acquisitions}名）` : '（無制限）'
        
        toast.success(
          'クーポン発行を開始しました！',
          `「${coupon.title}」を${durationText}間発行します${limitText}。既存の発行は自動的に停止されました。`,
          6000
        )
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(
          '発行に失敗しました',
          response.message || 'クーポン発行の開始中にエラーが発生しました'
        )
      }
    } catch (error) {
      console.error('Failed to issue coupon:', error)
      toast.error(
        '発行に失敗しました',
        'ネットワークエラーまたはサーバーエラーが発生しました'
      )
    } finally {
      setLoading(false)
    }
  }

  const durationOptions = [
    { value: 30, label: '30分' },
    { value: 60, label: '1時間' },
    { value: 120, label: '2時間' },
    { value: 180, label: '3時間' },
    { value: 360, label: '6時間' },
    { value: 720, label: '12時間' },
    { value: 1440, label: '24時間' }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-green-600" />
            クーポン即時発行
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 選択されたクーポン情報 */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="font-medium">{coupon.title}</div>
            <div className="text-sm text-muted-foreground">{coupon.description}</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 継続時間 */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                継続時間
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {durationOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={formData.duration_minutes === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, duration_minutes: option.value }))}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* 取得上限 */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                取得上限（オプション）
              </Label>
              <Input
                type="number"
                min="1"
                max="1000"
                placeholder="無制限の場合は空白"
                value={formData.max_acquisitions || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  max_acquisitions: e.target.value ? parseInt(e.target.value) : undefined
                }))}
              />
              <div className="text-xs text-muted-foreground">
                設定しない場合は無制限になります
              </div>
            </div>

            {/* 発行ボタン */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>処理中...</>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    発行開始
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
} 