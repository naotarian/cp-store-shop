'use client'

import { useState } from 'react'
import { Eye, EyeOff, User, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface LoginFormProps {
  email: string
  password: string
  onEmailChange: (email: string) => void
  onPasswordChange: (password: string) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
}

export function LoginForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  isLoading
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
            onChange={(e) => onEmailChange(e.target.value)}
            className="pl-10 bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500"
            required
          />
        </div>
      </div>

      {/* パスワード */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-800 font-medium">
          パスワード
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="パスワードを入力"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
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
      </div>

      {/* ログインボタン */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-gray-700 to-slate-800 hover:from-gray-800 hover:to-slate-900 text-white font-semibold py-2.5 shadow-lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>ログイン中...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>ログイン</span>
          </div>
        )}
      </Button>
    </form>
  )
} 