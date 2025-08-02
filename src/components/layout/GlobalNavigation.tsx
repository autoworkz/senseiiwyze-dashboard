'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ChevronDown, Menu, Sparkles, X } from 'lucide-react'
import { signOut, useSession } from '@/lib/auth-client'
import {
  dashboardNavigation,
  isNavigationItemActive,
  type NavigationItem
} from '@/lib/navigation-config'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/theme-toggle'
import { useState } from 'react'

interface GlobalNavigationProps {
  className?: string
  user?: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function GlobalNavigation({ className, user: serverUser }: GlobalNavigationProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Use server user prop if available, fallback to client session
  const user = serverUser || session?.user
  const userInitials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  const handleSignOut = async () => {
    await signOut()
  }

  // Render navigation item with optional dropdown
  const renderNavigationItem = (item: NavigationItem, isMobile = false) => {
    const Icon = item.icon
    const isActive = isNavigationItemActive(item, pathname)
    const hasChildren = item.children && item.children.length > 0

    if (hasChildren && !isMobile) {
      return (
        <DropdownMenu key={item.href}>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "relative flex items-center gap-2 h-16 px-4 transition-all duration-200",
                "hover:bg-accent/50",
                isActive && "text-primary bg-accent/10"
              )}
            >
              {Icon && <Icon className={cn("h-4 w-4", isActive && "text-primary")} />}
              <span className="font-medium">{item.title}</span>
              <ChevronDown className={cn("h-3 w-3 ml-1 transition-transform", isActive && "rotate-180")} />
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {item.children?.map((child) => {
              const ChildIcon = child.icon
              const childActive = isNavigationItemActive(child, pathname)
              return (
                <DropdownMenuItem key={child.href} asChild>
                  <Link
                    href={child.href}
                    className={cn(
                      "flex items-center gap-2",
                      childActive && "bg-accent"
                    )}
                  >
                    {ChildIcon && <ChildIcon className="h-4 w-4" />}
                    <div className="flex flex-col">
                      <span>{child.title}</span>
                      {child.description && (
                        <span className="text-xs text-muted-foreground">
                          {child.description}
                        </span>
                      )}
                    </div>
                  </Link>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    // Simple navigation item (mobile or no children)
    if (isMobile) {
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setMobileMenuOpen(false)}
          className={cn(
            "flex items-center gap-3 py-2 px-4 rounded-md transition-colors",
            isActive
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent/50"
          )}
        >
          {Icon && <Icon className="h-4 w-4" />}
          <span>{item.title}</span>
        </Link>
      )
    }

    // Desktop simple item
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "relative flex items-center gap-2 h-16 px-4 transition-all duration-200",
          "hover:bg-accent/50",
          isActive && "text-primary bg-accent/10"
        )}
      >
        {Icon && <Icon className={cn("h-4 w-4", isActive && "text-primary")} />}
        <span className="font-medium">{item.title}</span>
        {isActive && (
          <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary" />
        )}
      </Link>
    )
  }

  return (
    <header className={cn("bg-background/80 backdrop-blur-md border-b sticky top-0 z-50", className)}>
      <div className="container flex h-16 items-center px-4 md:px-6">
        {/* Left side - Logo and main nav */}
        <div className="flex items-center gap-6 flex-1">
          {/* Mobile menu trigger */}
          <Popover open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              align="start" 
              className="w-[300px] p-4 md:hidden"
              sideOffset={12}
            >
              <nav className="flex flex-col gap-1">
                {dashboardNavigation.map((item) => (
                  <div key={item.href}>
                    {renderNavigationItem(item, true)}
                    {/* Render children in mobile */}
                    {item.children && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map((child) => renderNavigationItem(child, true))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </PopoverContent>
          </Popover>

          {/* Logo */}
          <Link href="/app" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-lg hidden sm:inline">SenseiiWyze</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center h-full">
            {dashboardNavigation.map((item) => renderNavigationItem(item))}
          </nav>
        </div>

        {/* Right side - User menu and actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <ThemeToggle />
          
          {/* Upgrade button */}
          <Button size="sm" variant="default" className="hidden sm:flex gap-2 shadow-sm">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="hidden lg:inline">Upgrade</span>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-full hover:ring-2 hover:ring-primary/20 hover:ring-offset-2 transition-all">
                <Avatar className="h-10 w-10 hover:scale-105 transition-transform">
                  <AvatarImage src={user?.image || undefined} alt={user?.name || ''} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/app/settings?tab=profile">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/app/settings?tab=billing">
                    Billing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/app/settings">
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/support">
                  Support
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}