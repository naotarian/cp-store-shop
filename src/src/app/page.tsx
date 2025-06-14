import { AuthGuard } from "@/components/auth/AuthGuard"
import { DashboardContent } from "@/components/dashboard/DashboardContent"
import { DashboardLayout } from "@/components/layout/DashboardLayout"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </AuthGuard>
  )
}
