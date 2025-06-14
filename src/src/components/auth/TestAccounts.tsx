'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface TestAccount {
  role: string
  email: string
  password: string
  shop: string
  color: string
}

interface TestAccountsProps {
  accounts: TestAccount[]
  onSelectAccount: (account: TestAccount) => void
}

export function TestAccounts({ accounts, onSelectAccount }: TestAccountsProps) {
  return (
    <div className="space-y-3">
      <div className="text-center">
        <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-300">
          開発用テストアカウント
        </Badge>
      </div>
      
      <div className="space-y-2">
        {accounts.map((account, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            onClick={() => onSelectAccount(account)}
          >
            <div className="flex items-center space-x-3 w-full">
              <div className={`w-3 h-3 rounded-full ${account.color}`}></div>
              <div className="flex-1 text-left">
                <div className="font-medium">{account.role}</div>
                <div className="text-xs text-gray-500 truncate">
                  {account.email}
                </div>
              </div>
            </div>
          </Button>
        ))}
      </div>
      
      <p className="text-xs text-gray-600 text-center">
        ボタンをクリックして認証情報を自動入力
      </p>
    </div>
  )
} 