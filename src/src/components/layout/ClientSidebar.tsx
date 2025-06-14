'use client'

import { Sidebar } from './Sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

export function ClientSidebar() {
  return (
    <SidebarProvider>
      <Sidebar />
    </SidebarProvider>
  )
} 