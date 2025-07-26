import { DashboardNav } from '@/components/layout/DashboardNav'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { UserMenu } from '@/components/layout/UserMenu'
import { getCurrentUser } from '@/lib/get-current-user'
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
        <DashboardSidebar user={user} className="hidden lg:flex flex-col" />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top navigation */}
          <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-4 lg:px-6">
              <div className="flex items-center gap-4">
                {/* Mobile logo - only show on mobile */}
                <div className="lg:hidden flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-xs">S</span>
                  </div>
                  <span className="font-semibold text-sm">SenseiiWyze</span>
                </div>
                
                {/* Desktop navigation */}
                <div className="hidden lg:block">
                  <DashboardNav user={user} />
                </div>
              </div>
              
              <UserMenu user={user} />
            </div>
          </header>
          
          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-6 xl:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <DashboardNav user={user} variant="mobile" />
      </div>
      
      {/* Mobile bottom nav spacer */}
      <div className="lg:hidden h-16"></div>
    </div>
  )
}
