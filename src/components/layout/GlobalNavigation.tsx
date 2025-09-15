'use client'

import { ChevronDown, Menu, Sparkles, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { InteractiveButton } from '@/components/interactive'
import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { onboardingUtils } from '@/utils/onboarding'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { authClient, useSession } from '@/lib/auth-client'
import {
  dashboardNavigation,
  isNavigationItemActive,
  type NavigationItem,
} from '@/lib/navigation-config'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
interface GlobalNavigationProps {
  className?: string
  user?: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  }
}

export function GlobalNavigation({ className, user: serverUser }: GlobalNavigationProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { data: organizations } = authClient.useListOrganizations()
  const user = serverUser || session?.user
  const userInitials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'

  const handleSignOut = async () => {
    // Clear onboarding status from localStorage
    onboardingUtils.clearOnboardingStatus()

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/login"); // redirect to login page
        },
      },
    });
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
                'relative flex items-center gap-2 h-16 px-4 transition-all duration-200',
                'hover:bg-accent/50',
                isActive && 'text-primary bg-accent/10'
              )}
            >
              {Icon && <Icon className={cn('h-4 w-4', isActive && 'text-primary')} />}
              <span className="font-medium">{item.title}</span>
              <ChevronDown
                className={cn('h-3 w-3 ml-1 transition-transform', isActive && 'rotate-180')}
              />
              {isActive && <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary" />}
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
                    className={cn('flex items-center gap-2', childActive && 'bg-accent')}
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

    // Simple navigation item (mobile or no children)
    if (isMobile) {
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setMobileMenuOpen(false)}
          className={cn(
            'flex items-center gap-3 py-2 px-4 rounded-md transition-colors',
            isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
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
          'relative flex items-center gap-2 h-16 px-4 transition-all duration-200',
          'hover:bg-accent/50',
          isActive && 'text-primary bg-accent/10'
        )}
      >
        {Icon && <Icon className={cn('h-4 w-4', isActive && 'text-primary')} />}
        <span className="font-medium">{item.title}</span>
        {isActive && <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary" />}
      </Link>
    )
  }
  const setOrganization = async (orgId: string, orgSlug: string) => {
    const { data, error } = await authClient.organization.setActive({
      organizationId: orgId,
      organizationSlug: orgSlug,
    });
    if (error) {
      console.error("Failed to set active organization:", error);
      return;
    }
    router.refresh();
  }
  return (
    <header
      className={cn('bg-background/80 backdrop-blur-md border-b sticky top-0 z-50', className)}
    >
      <div className="container flex h-16 items-center px-4 md:px-6">
        {/* Left side - Logo and main nav */}
        <div className="flex items-center gap-6 flex-1">
          {/* Mobile menu trigger */}
          <Popover open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <PopoverTrigger asChild>
              <InteractiveButton variant="ghost" size="icon" className="md:hidden" effect="scale">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </InteractiveButton>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[300px] p-4 md:hidden" sideOffset={12}>
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
            <div className="relative w-[150px] h-8">
              <Image
                src="/assets/images/logo.jpeg"
                alt="SenseiiWyze Logo"
                fill
                className="object-contain rounded-lg"
              />
            </div>
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
          {/* <InteractiveButton
            size="sm"
            variant="default"
            className="hidden sm:flex gap-2 shadow-sm"
            effect="glow"
            intensity="subtle"
          >
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="hidden lg:inline">Upgrade</span>
          </InteractiveButton> */}
          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InteractiveButton
                variant="ghost"
                size="icon"
                className="relative rounded-full hover:ring-2 hover:ring-primary/20 hover:ring-offset-2 transition-all"
                effect="scale"
                intensity="subtle"
              >
                <Avatar className="h-10 w-10 hover:scale-105 transition-transform">
                  <AvatarImage src={user?.image || undefined} alt={user?.name || ''} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </InteractiveButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/app/settings?tab=profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/app/settings?tab=billing">Billing</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/app/settings">Settings</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              {user?.role === 'admin-executive' && (
                <>
                  <DropdownMenuSeparator />
                  {organizations && organizations.length > 0 && (
                    organizations.map((org) => (
                      <DropdownMenuItem asChild key={org.id}>
                        <Link href={`#`}>
                          {org.name}
                        </Link>
                      </DropdownMenuItem>
                    ))
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/app/onboarding">Create Organization</Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/support">Support</Link>
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
