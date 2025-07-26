"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardSidebar, DashboardSidebarItems } from "@/components/dashboard-sidebar"
import { authClient } from "@/auth-client"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isClient, setIsClient] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    // Check session on mount
    const checkSession = async () => {
      try {
        const sessionData = await authClient.getSession()
        setSession(sessionData)
      } catch (error) {
        console.error('Session check failed:', error)
        router.push('/auth/login')
      } finally {
        setIsLoading(false)
      }
    }
    checkSession()
  }, [router])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await authClient.signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Show loading state while checking session
  if (!isClient || isLoading) {
    return null
  }

  // Don't render dashboard if not authenticated
  if (!session) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
              className="h-8 w-8"
              alt="SenseiiWyze Logo"
            />
            <span className="text-lg font-semibold tracking-tight">SenseiiWyze</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Link href="/settings">
            <Button variant="outline" size="icon" className="rounded-full">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Log out</span>
          </Button>
          <Avatar>
            <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
            <AvatarFallback>{session.user.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-background lg:block">
          <div className="flex h-full flex-col gap-2 p-4">
            <DashboardSidebar items={DashboardSidebarItems()} className="px-1" />
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}