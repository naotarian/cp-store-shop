import { AuthGuard } from "@/components/auth/AuthGuard"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { CouponManagement } from "@/components/coupons/CouponManagement"

export default function CouponsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <CouponManagement />
      </DashboardLayout>
    </AuthGuard>
  )
} 