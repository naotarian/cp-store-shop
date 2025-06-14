'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { LoginForm } from '@/components/auth/LoginForm'
import { TestAccounts, TestAccount } from '@/components/auth/TestAccounts'
import { LoginHeader } from '@/components/auth/LoginHeader'
import { LoginBackground } from '@/components/auth/LoginBackground'
import { GuestGuard } from '@/components/auth/GuestGuard'
import { loginApi, saveAuthToken, saveUserData } from '@/lib/api'

const testAccounts: TestAccount[] = [
  {
    role: 'ルート管理者',
    email: 'admin@starbucks-1.com',
    password: 'password',
    shop: 'スターバックス 渋谷スカイ店',
    color: 'bg-gray-600'
  },
  {
    role: 'マネージャー',
    email: 'manager@starbucks-1.com',
    password: 'password',
    shop: 'スターバックス 渋谷スカイ店',
    color: 'bg-slate-600'
  },
  {
    role: 'スタッフ',
    email: 'staff@starbucks-1.com',
    password: 'password',
    shop: 'スターバックス 渋谷スカイ店',
    color: 'bg-zinc-600'
  }
]

function LoginPageContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('Starting login process...')
      const result = await loginApi({ email, password })
      
      console.log('Login result:', { success: result.success, hasToken: !!result.token, hasUser: !!result.user })
      
      if (result.success && result.token && result.user) {
        // 認証成功
        console.log('Login successful, saving auth data...')
        saveAuthToken(result.token)
        saveUserData(result.user)
        
        // リダイレクト先を取得（デフォルトはダッシュボード）
        const redirectTo = searchParams.get('redirect') || '/'
        console.log('Redirecting to:', redirectTo)
        router.push(redirectTo)
      } else {
        // 認証失敗
        console.error('Login failed:', result.message)
        setError(result.message || 'ログインに失敗しました')
      }
    } catch (error) {
      console.error('Login error:', error)
      
      // より詳細なエラーメッセージ
      if (error instanceof Error) {
        if (error.message.includes('API calls are only allowed on the client side')) {
          setError('クライアントサイドでのみログインできます。ページを再読み込みしてください。')
        } else if (error.message.includes('Failed to fetch')) {
          setError('APIサーバーに接続できません。サーバーが起動しているか確認してください。')
        } else {
          setError(`エラー: ${error.message}`)
        }
      } else {
        setError('予期しないエラーが発生しました')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestAccountSelect = (account: TestAccount) => {
    setEmail(account.email)
    setPassword(account.password)
    setError('')
  }

  const handleForgotPassword = () => {
    router.push('/forgot-password')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-slate-200 to-zinc-300 flex items-center justify-center p-4">
      <LoginBackground />

      <div className="relative w-full max-w-md">
        <Card className="backdrop-blur-sm bg-white/90 border-gray-200 shadow-2xl">
          <LoginHeader />

          <CardContent className="space-y-6">
            {/* エラーメッセージ */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm text-center">{error}</p>
              </div>
            )}

            <LoginForm
              email={email}
              password={password}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onSubmit={handleLogin}
              isLoading={isLoading}
            />

            {/* パスワード忘れリンク */}
            <div className="text-center">
              <Button
                variant="link"
                className="text-gray-600 hover:text-gray-800 text-sm"
                onClick={handleForgotPassword}
              >
                パスワードをお忘れですか？
              </Button>
            </div>

            <Separator className="bg-gray-200" />

            {/* テスト用アカウント */}
            <TestAccounts
              accounts={testAccounts}
              onSelectAccount={handleTestAccountSelect}
            />
          </CardContent>
        </Card>

        {/* フッター */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            © 2024 CP Store. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <GuestGuard>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginPageContent />
      </Suspense>
    </GuestGuard>
  )
} 