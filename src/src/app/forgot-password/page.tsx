'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoginHeader } from '@/components/auth/LoginHeader'
import { LoginBackground } from '@/components/auth/LoginBackground'
import { GuestGuard } from '@/components/auth/GuestGuard'
import { sendPasswordResetEmail } from '@/lib/api'
import { Mail, ArrowLeft, Send } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await sendPasswordResetEmail({ email })
      
      if (result.success) {
        setIsSuccess(true)
      } else {
        setError(result.message || 'メールの送信に失敗しました。もう一度お試しください。')
      }
    } catch (error) {
      console.error('Password reset error:', error)
      setError('予期しないエラーが発生しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <GuestGuard>
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-slate-200 to-zinc-300 flex items-center justify-center p-4">
        <LoginBackground />

        <div className="relative w-full max-w-md">
          <Card className="backdrop-blur-sm bg-white/90 border-gray-200 shadow-2xl">
            <LoginHeader />

            <CardContent className="space-y-6 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Send className="w-8 h-8 text-green-600" />
              </div>

              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  メールを送信しました
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {email} にパスワードリセット用のリンクを送信しました。
                  <br />
                  メールをご確認の上、リンクをクリックしてパスワードを再設定してください。
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-gray-700 to-slate-800 hover:from-gray-800 hover:to-slate-900 text-white font-semibold py-2.5 shadow-lg"
                >
                  <Link href="/login">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    ログイン画面に戻る
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  onClick={async () => {
                    setIsLoading(true)
                    try {
                      // TODO: API実装時にリセットメール送信処理を追加
                      // const result = await sendPasswordResetEmail({ email })
                      
                      // 仮の処理（成功として扱う）
                      await new Promise(resolve => setTimeout(resolve, 1000))
                      // 成功時は特に何もしない（すでに成功画面にいるため）
                    } catch (error) {
                      console.error('Password reset resend error:', error)
                      setError('メールの再送信に失敗しました。もう一度お試しください。')
                      setIsSuccess(false)
                    } finally {
                      setIsLoading(false)
                    }
                  }}
                  disabled={isLoading}
                  className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>再送信中...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="w-4 h-4" />
                      <span>再送信</span>
                    </div>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsSuccess(false)
                    setEmail('')
                  }}
                  className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                >
                  別のメールアドレスで送信
                </Button>
              </div>
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
      </GuestGuard>
    )
  }

  return (
    <GuestGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-slate-200 to-zinc-300 flex items-center justify-center p-4">
      <LoginBackground />

      <div className="relative w-full max-w-md">
        <Card className="backdrop-blur-sm bg-white/90 border-gray-200 shadow-2xl">
          <LoginHeader />

          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-gray-800">
                パスワードをリセット
              </h2>
              <p className="text-gray-600 text-sm">
                メールアドレスを入力してください。
                <br />
                パスワードリセット用のリンクをお送りします。
              </p>
            </div>

            {/* エラーメッセージ */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* メールアドレス */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-800 font-medium">
                  メールアドレス
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500"
                    required
                  />
                </div>
              </div>

              {/* 送信ボタン */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-gray-700 to-slate-800 hover:from-gray-800 hover:to-slate-900 text-white font-semibold py-2.5 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>送信中...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>リセットリンクを送信</span>
                  </div>
                )}
              </Button>
            </form>

            {/* ログインページに戻るリンク */}
            <div className="text-center">
              <Button
                asChild
                variant="link"
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                <Link href="/login">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  ログイン画面に戻る
                </Link>
              </Button>
            </div>
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
    </GuestGuard>
  )
} 