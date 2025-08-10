'use client'

import { ChevronDown, Menu, Sparkles, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSession, authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import {
  dashboardNavigation,
  isNavigationItemActive,
  type NavigationItem,
} from '@/lib/navigation-config'
import { cn } from '@/lib/utils'

interface SlidingNavigationProps {
  className?: string
  user?: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function SlidingNavigation({ className, user: serverUser }: SlidingNavigationProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  // Simplified refs - only what we need
  const navRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Use server user prop if available, fallback to client session
  const user = serverUser || session?.user
  const userInitials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'

  // Optimized indicator update with useCallback
  const updateIndicator = useCallback(() => {
    if (!navRef.current || !indicatorRef.current) return

    const activeItem = navRef.current.querySelector('[data-active="true"]') as HTMLElement
    if (activeItem) {
      const navRect = navRef.current.getBoundingClientRect()
      const itemRect = activeItem.getBoundingClientRect()

      // Use requestAnimationFrame for smooth updates
      requestAnimationFrame(() => {
        if (indicatorRef.current) {
          indicatorRef.current.style.setProperty(
            '--indicator-x',
            `${itemRect.left - navRect.left}px`
          )
          indicatorRef.current.style.setProperty('--indicator-width', `${itemRect.width}px`)
        }
      })
    }
  }, [])

  // Update sliding indicator position
  useEffect(() => {
    updateIndicator()

    const handleResize = () => updateIndicator()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [pathname, updateIndicator])

  // Simplified mouse tracking with throttling
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!navRef.current) return

    const rect = navRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    navRef.current.style.setProperty('--mouse-x', `${x}px`)
    navRef.current.style.setProperty('--mouse-y', `${y}px`)
  }, [])

  // Handle mobile menu toggle with body scroll lock
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => {
      const newState = !prev
      // Lock body scroll when menu is open
      document.body.style.overflow = newState ? 'hidden' : ''
      return newState
    })
  }, [])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        toggleMobileMenu()
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [mobileMenuOpen, toggleMobileMenu])

  // Cleanup body scroll lock on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

    const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/login"); // redirect to login page
        },
      },  
    });
  }

  // Simplified navigation item renderer with Firegeo-inspired micro-interactions
  const renderNavigationItem = useCallback(
    (item: NavigationItem) => {
      const Icon = item.icon
      const isActive = isNavigationItemActive(item, pathname)
      const hasChildren = item.children && item.children.length > 0

      // Shared classes with consistent 200ms transitions
      const itemClasses = cn(
        'nav-item relative flex items-center gap-2 h-16 px-6',
        'transition-all duration-200 ease-out',
        'hover:text-primary focus-visible:text-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
        isActive && 'text-primary'
      )

      const iconClasses = cn(
        'nav-icon h-4 w-4 transition-all duration-200 ease-out',
        isActive && 'text-primary'
      )

      if (hasChildren) {
        return (
          <DropdownMenu key={item.href}>
            <DropdownMenuTrigger asChild>
              <button data-active={isActive} className={itemClasses}>
                {Icon && <Icon className={iconClasses} />}
                <span className="font-medium">{item.title}</span>
                <ChevronDown className="h-3 w-3 ml-1 transition-transform duration-200 ease-out" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 animate-in slide-in-from-top-1">
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
                        'flex items-center gap-2 transition-colors duration-200',
                        childActive && 'bg-accent text-accent-foreground'
                      )}
                    >
                      {ChildIcon && <ChildIcon className="h-4 w-4" />}
                      <div className="flex flex-col">
                        <span>{child.title}</span>
                        {child.description && (
                          <span className="text-xs text-muted-foreground">{child.description}</span>
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

      return (
        <Link key={item.href} href={item.href} data-active={isActive} className={itemClasses}>
          {Icon && <Icon className={iconClasses} />}
          <span className="font-medium">{item.title}</span>
        </Link>
      )
    },
    [pathname]
  )

  return (
    <>
      <header
        className={cn(
          'sliding-navigation bg-background/80 backdrop-blur-md border-b sticky top-0 z-50',
          'transition-all duration-200 ease-out',
          className
        )}
      >
        <div className="container flex h-16 items-center px-4 md:px-6">
          {/* Left side - Logo and main nav */}
          <div className="flex items-center gap-6 flex-1">
            {/* Mobile menu trigger with micro-interaction */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'md:hidden transition-all duration-200 ease-out',
                'hover:scale-105 active:scale-95',
                'focus-visible:ring-2 focus-visible:ring-primary/20'
              )}
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <div className="relative w-5 h-5">
                <Menu
                  className={cn(
                    'absolute inset-0 transition-all duration-200 ease-out',
                    mobileMenuOpen
                      ? 'opacity-0 rotate-90 scale-75'
                      : 'opacity-100 rotate-0 scale-100'
                  )}
                />
                <X
                  className={cn(
                    'absolute inset-0 transition-all duration-200 ease-out',
                    mobileMenuOpen
                      ? 'opacity-100 rotate-0 scale-100'
                      : 'opacity-0 rotate-90 scale-75'
                  )}
                />
              </div>
            </Button>

            {/* Logo with enhanced micro-interactions */}
            <Link
              href="/app"
              className={cn(
                'nav-logo flex items-center gap-2 group',
                'transition-all duration-200 ease-out',
                'hover:scale-[1.02] active:scale-[0.98]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:rounded-lg'
              )}
            >
              <div className="nav-logo-icon w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-all duration-200 ease-out group-hover:shadow-lg group-hover:shadow-primary/25">
                <span className="text-primary-foreground font-bold text-sm transition-transform duration-200 ease-out group-hover:scale-110">
                  S
                </span>
              </div>
              <span className="font-semibold text-lg hidden sm:inline transition-colors duration-200 ease-out group-hover:text-primary">
                SenseiiWyze
              </span>
            </Link>

            {/* Desktop Navigation with simplified mouse tracking */}
            <nav
              ref={navRef}
              className="nav-container hidden md:flex items-center h-full relative"
              onMouseMove={handleMouseMove}
            >
              {/* Sliding Indicator - now with 200ms transition */}
              <div
                ref={indicatorRef}
                className="nav-indicator absolute bottom-0 h-[2px] bg-primary transition-all duration-200 ease-out rounded-full"
                style={{
                  transform: 'translateX(var(--indicator-x))',
                  width: 'var(--indicator-width)',
                }}
              />

              {/* Subtle mouse glow effect */}
              <div className="nav-glow absolute inset-0 pointer-events-none transition-opacity duration-200 ease-out" />

              {dashboardNavigation.map((item) => renderNavigationItem(item))}
            </nav>
          </div>

          {/* Right side - User menu and actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle with micro-interaction */}
            <div className="transition-transform duration-200 ease-out hover:scale-105 active:scale-95">
              <ThemeToggle />
            </div>

            {/* Upgrade button with enhanced effects */}
            <Button
              size="sm"
              variant="default"
              className={cn(
                'nav-upgrade hidden sm:flex gap-2 shadow-sm',
                'transition-all duration-200 ease-out',
                'hover:shadow-md hover:scale-105 active:scale-95',
                'hover:shadow-primary/25',
                'focus-visible:ring-2 focus-visible:ring-primary/20'
              )}
            >
              <Sparkles className="h-4 w-4 transition-transform duration-200 ease-out group-hover:rotate-12" />
              <span className="hidden lg:inline">Upgrade</span>
            </Button>

            {/* User menu with enhanced micro-interactions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'nav-avatar relative rounded-full',
                    'transition-all duration-200 ease-out',
                    'hover:scale-105 active:scale-95',
                    'focus-visible:ring-2 focus-visible:ring-primary/20'
                  )}
                >
                  <Avatar className="h-10 w-10 transition-transform duration-200 ease-out hover:shadow-lg">
                    <AvatarImage src={user?.image || undefined} alt={user?.name || ''} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 animate-in slide-in-from-top-1">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/app/settings?tab=profile"
                      className="transition-colors duration-200"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/app/settings?tab=billing"
                      className="transition-colors duration-200"
                    >
                      Billing
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/app/settings" className="transition-colors duration-200">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/support" className="transition-colors duration-200">
                    Support
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950 transition-colors duration-200"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Firegeo-inspired mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop with blur */}
          <div
            className={cn(
              'fixed inset-0 bg-black/20 backdrop-blur-sm',
              'animate-in fade-in-0 duration-200'
            )}
            onClick={toggleMobileMenu}
          />

          {/* Sliding sidebar */}
          <div
            ref={mobileMenuRef}
            className={cn(
              'relative flex flex-col w-80 max-w-[80vw] h-full',
              'bg-background/95 backdrop-blur-md border-r shadow-xl',
              'animate-in slide-in-from-left-0 duration-200 ease-out'
            )}
          >
            {/* Mobile header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">S</span>
                </div>
                <span className="font-semibold text-lg">SenseiiWyze</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-1">
                {dashboardNavigation.map((item, index) => {
                  const Icon = item.icon
                  const isActive = isNavigationItemActive(item, pathname)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={toggleMobileMenu}
                      className={cn(
                        'flex items-center gap-3 py-3 px-4 rounded-lg',
                        'transition-all duration-200 ease-out',
                        'hover:bg-accent/50 active:scale-[0.98]',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
                        isActive && 'bg-accent text-accent-foreground shadow-sm',
                        // Staggered animation
                        'animate-in slide-in-from-left-0 fade-in-0'
                      )}
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animationDuration: '200ms',
                        animationFillMode: 'both',
                      }}
                    >
                      {Icon && (
                        <Icon
                          className={cn(
                            'h-5 w-5 transition-colors duration-200',
                            isActive ? 'text-accent-foreground' : 'text-muted-foreground'
                          )}
                        />
                      )}
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  )
                })}
              </div>
            </nav>

            {/* Mobile footer actions */}
            <div className="p-4 border-t space-y-2">
              <Button
                size="sm"
                variant="default"
                className="w-full justify-start gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="h-4 w-4" />
                Upgrade Plan
              </Button>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image || undefined} alt={user?.name || ''} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
