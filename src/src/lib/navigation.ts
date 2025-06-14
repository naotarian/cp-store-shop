import { 
  Home, 
  Store, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Users,
  Calendar,
  FileText,
  Ticket,
  LucideIcon
} from 'lucide-react'

export interface NavigationItem {
  title: string
  href: string
  icon: LucideIcon
  description?: string
  badge?: string
}

export const navigationItems: NavigationItem[] = [
  {
    title: 'ダッシュボード',
    href: '/',
    icon: Home,
    description: '概要とサマリー'
  },
  {
    title: '店舗情報',
    href: '/shop',
    icon: Store,
    description: '基本情報の管理'
  },
  {
    title: 'クーポン管理',
    href: '/coupons',
    icon: Ticket,
    description: 'クーポンの作成・発行・管理'
  },
  {
    title: 'レビュー管理',
    href: '/reviews',
    icon: MessageSquare,
    description: 'お客様のレビュー'
  },
  {
    title: '統計・分析',
    href: '/analytics',
    icon: BarChart3,
    description: 'データ分析'
  },
  {
    title: '予約管理',
    href: '/reservations',
    icon: Calendar,
    description: '予約の確認・管理'
  },
  {
    title: 'スタッフ管理',
    href: '/staff',
    icon: Users,
    description: 'スタッフアカウント'
  },
  {
    title: 'レポート',
    href: '/reports',
    icon: FileText,
    description: '各種レポート'
  },
  {
    title: '設定',
    href: '/settings',
    icon: Settings,
    description: 'システム設定'
  }
] 