import { Coffee } from 'lucide-react'
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function LoginHeader() {
  return (
    <CardHeader className="text-center space-y-4">
      <div className="mx-auto w-16 h-16 bg-gradient-to-r from-gray-600 to-slate-700 rounded-full flex items-center justify-center shadow-lg">
        <Coffee className="w-8 h-8 text-white" />
      </div>
      <div>
        <CardTitle className="text-2xl font-bold text-gray-800">
          CP Store
        </CardTitle>
        <CardDescription className="text-gray-600">
          店舗管理画面にログイン
        </CardDescription>
      </div>
    </CardHeader>
  )
} 