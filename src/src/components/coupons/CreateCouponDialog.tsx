'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { createCoupon } from '@/lib/api/coupons'
import type { CreateCouponFormData } from '@/types/coupon'

interface CreateCouponDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateCouponDialog({ isOpen, onClose, onSuccess }: CreateCouponDialogProps) {
  const [formData, setFormData] = useState<CreateCouponFormData>({
    title: '',
    description: '',
    conditions: '',
    notes: '',
    image_url: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await createCoupon(formData)
      
      if (result.success) {
        onSuccess()
        onClose()
        // フォームをリセット
        setFormData({
          title: '',
          description: '',
          conditions: '',
          notes: '',
          image_url: ''
        })
      } else {
        setError(result.message || 'クーポンの作成に失敗しました')
      }
    } catch {
      setError('クーポンの作成に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof CreateCouponFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-black supports-[backdrop-filter]:bg-background/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">新しいクーポンを作成</h2>
            <p className="text-sm text-gray-600 mt-1">魅力的なクーポンでお客様を呼び込みましょう</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-white rounded-full p-2 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* エラー表示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* クーポン名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              クーポン名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例: ドリンク10%OFF"
              required
            />
          </div>

          {/* 説明 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              説明
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例: 全ドリンクメニューが10%割引になります"
            />
          </div>

          {/* 利用条件 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              利用条件
            </label>
            <textarea
              value={formData.conditions}
              onChange={(e) => handleInputChange('conditions', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例: 他のクーポンとの併用不可、1人1回まで"
            />
          </div>

          {/* 備考 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              備考・メモ
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例: スタッフ向けの補足情報や特記事項"
            />
          </div>

          {/* 画像URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              画像URL
            </label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/coupon-image.jpg"
            />
          </div>

          {/* ボタン */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              disabled={isLoading}
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  作成中...
                </div>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  作成
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 