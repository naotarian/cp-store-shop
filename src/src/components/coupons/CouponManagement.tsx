'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { CouponList } from './CouponList'
import { ActiveIssuesList } from './ActiveIssuesList'
import { SchedulesList } from './SchedulesList'
import { CreateCouponDialog } from './CreateCouponDialog'

export function CouponManagement() {
  const [activeTab, setActiveTab] = useState('coupons')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCreateSuccess = () => {
    setRefreshKey(prev => prev + 1) // リストを再読み込み
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="coupons">登録済みクーポン</TabsTrigger>
          <TabsTrigger value="active-issues">発行中クーポン</TabsTrigger>
          <TabsTrigger value="schedules">スケジュール</TabsTrigger>
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
      </Tabs>

      {/* クーポン作成モーダル */}
      <CreateCouponDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  )
} 