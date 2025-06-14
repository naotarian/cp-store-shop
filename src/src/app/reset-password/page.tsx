'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoginHeader } from '@/components/auth/LoginHeader'
import { LoginBackground } from '@/components/auth/LoginBackground'
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

function ResetPasswordContent() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [tokenError, setTokenError] = useState('')
  
  const searchParams = useSearchParams()

  useEffect(() => {
    const resetToken = searchParams.get('token')
    if (!resetToken) {
      setTokenError('無効なリセットリンクです。')
    }
    // TODO: API実装時にトークンの有効性を確認
    // validateResetToken(resetToken)
  }, [searchParams])

  const validatePassword = (password: string) => {
    const errors = []
    if (password.length < 8) {
      errors.push('8文字以上で入力してください')
    }
    if (!/[A-Za-z]/.test(password)) {
      errors.push('英字を含めてください')
    }
    if (!/[0-9]/.test(password)) {
      errors.push('数字を含めてください')
    }
    return errors
  }

  const passwordErrors = validatePassword(password)
  const isPasswordValid = passwordErrors.length === 0 && password.length > 0
  const isConfirmPasswordValid = confirmPassword === password && confirmPassword.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!isPasswordValid) {
      setError('パスワードの要件を満たしてください。')
      setIsLoading(false)
      return
    }

    if (!isConfirmPasswordValid) {
      setError('パスワードが一致しません。')
      setIsLoading(false)
      return
    }

    try {
      // TODO: API実装時にパスワードリセット処理を追加
      // const result = await resetPassword({ token, password })
      
      // 仮の処理（成功として扱う）
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSuccess(true)
    } catch (error) {
      console.error('Password reset error:', error)
      setError('パスワードの再設定に失敗しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  // トークンエラーがある場合
  if (tokenError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-slate-200 to-zinc-300 flex items-center justify-center p-4">
        <LoginBackground />

        <div className="relative w-full max-w-md">
          <Card className="backdrop-blur-sm bg-white/90 border-gray-200 shadow-2xl">
            <LoginHeader />

            <CardContent className="space-y-6 text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>

              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  無効なリンクです
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  このパスワードリセットリンクは無効または期限切れです。
                  <br />
                  新しいリセットリンクを取得してください。
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-gray-700 to-slate-800 hover:from-gray-800 hover:to-slate-900 text-white font-semibold py-2.5 shadow-lg"
                >
                  <Link href="/forgot-password">
                    パスワードリセットを再試行
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
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
    )
  }

  // 成功画面
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-slate-200 to-zinc-300 flex items-center justify-center p-4">
        <LoginBackground />

        <div className="relative w-full max-w-md">
          <Card className="backdrop-blur-sm bg-white/90 border-gray-200 shadow-2xl">
            <LoginHeader />

            <CardContent className="space-y-6 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  パスワードを再設定しました
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  パスワードの再設定が完了しました。
                  <br />
                  新しいパスワードでログインしてください。
                </p>
              </div>

              <Button
                asChild
                className="w-full bg-gradient-to-r from-gray-700 to-slate-800 hover:from-gray-800 hover:to-slate-900 text-white font-semibold py-2.5 shadow-lg"
              >
                <Link href="/login">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  ログイン画面に移動
                </Link>
              </Button>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-slate-200 to-zinc-300 flex items-center justify-center p-4">
      <LoginBackground />

      <div className="relative w-full max-w-md">
        <Card className="backdrop-blur-sm bg-white/90 border-gray-200 shadow-2xl">
          <LoginHeader />

          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-gray-800">
                新しいパスワードを設定
              </h2>
              <p className="text-gray-600 text-sm">
                新しいパスワードを入力してください。
              </p>
            </div>

            {/* エラーメッセージ */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 新しいパスワード */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-800 font-medium">
                  新しいパスワード
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="新しいパスワードを入力"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* パスワード要件 */}
                {password && (
                  <div className="space-y-1">
                    {passwordErrors.map((error, index) => (
                      <div key={index} className="flex items-center text-xs text-red-600">
                        <div className="w-1 h-1 bg-red-600 rounded-full mr-2"></div>
                        {error}
                      </div>
                    ))}
                    {isPasswordValid && (
                      <div className="flex items-center text-xs text-green-600">
                        <CheckCircle className="w-3 h-3 mr-2" />
                        パスワードの要件を満たしています
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* パスワード確認 */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-800 font-medium">
                  パスワード確認
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="パスワードを再入力"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* パスワード一致確認 */}
                {confirmPassword && (
                  <div className="text-xs">
                    {isConfirmPasswordValid ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-3 h-3 mr-2" />
                        パスワードが一致しています
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <div className="w-1 h-1 bg-red-600 rounded-full mr-2"></div>
                        パスワードが一致しません
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 設定ボタン */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-gray-700 to-slate-800 hover:from-gray-800 hover:to-slate-900 text-white font-semibold py-2.5 shadow-lg"
                disabled={isLoading || !isPasswordValid || !isConfirmPasswordValid}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>設定中...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>パスワードを設定</span>
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
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
} 