import { DashboardNav } from '@/components/layout/DashboardNav'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { UserMenu } from '@/components/layout/UserMenu'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main layout */}
      <div className="flex h-screen">
        {/* Sidebar - Desktop only */}
        <DashboardSidebar user={user} className="hidden lg:flex" />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Top navigation */}
          <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-4 lg:px-8">
              <DashboardNav user={user} />
              <UserMenu user={user} />
            </div>
          </header>
          
          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
      
      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <DashboardNav user={user} variant="mobile" />
      </div>
    </div>
  )
}
