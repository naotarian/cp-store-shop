'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/api'

interface GuestGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function GuestGuard({ children, fallback }: GuestGuardProps) {
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    
    // 認証済みの場合はダッシュボードにリダイレクト
    if (isAuthenticated()) {
      router.push('/')
      return
    }
  }, [router])

  // クライアントサイドでのみ認証チェックを実行
  if (!isClient) {
    return <>{children}</>
  }

  // 認証済みの場合は何も表示しない（リダイレクト中）
  if (isAuthenticated()) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">リダイレクト中...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 