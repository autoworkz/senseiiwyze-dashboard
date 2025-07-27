'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ChevronDown, Settings } from 'lucide-react'
import {
    getCurrentContext,
    getNavigationForContext,
    getAccessibleContexts,
    getDashboardContextForRole,
    type NavigationContext
} from '@/lib/navigation-config'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface User {
    role: 'learner' | 'admin' | 'executive' | 'ceo' | 'worker' | 'frontliner'
    name: string
}

interface GlobalNavigationProps {
    user: User
    variant?: 'desktop' | 'mobile' | 'sidebar'
    className?: string
}

export function GlobalNavigation({ user, variant = 'desktop', className }: GlobalNavigationProps) {
    const pathname = usePathname()
    const currentContext = getCurrentContext(pathname)
    const accessibleContexts = getAccessibleContexts(user.role)
    const defaultContext = getDashboardContextForRole(user.role)

    // Use current context or fall back to user's default
    const activeContext = currentContext || defaultContext
    const navigationItems = getNavigationForContext(activeContext.key, user.role)

    if (variant === 'sidebar') {
        return (
            <div className={cn("flex flex-col w-64 border-r bg-card", className)}>
                {/* Header with Context Switcher */}
                <div className="p-6 border-b">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">S</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">SenseiiWyze</h2>
                        </div>
                    </div>

                    {/* Context Switcher */}
                    {accessibleContexts.length > 1 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    <span className="font-medium">{activeContext.title}</span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="start">
                                {accessibleContexts.map((context) => (
                                    <DropdownMenuItem key={context.key} asChild>
                                        <Link
                                            href={context.basePath}
                                            className={cn(
                                                "flex flex-col items-start py-2",
                                                activeContext.key === context.key && "bg-accent"
                                            )}
                                        >
                                            <span className="font-medium">{context.title}</span>
                                            <span className="text-xs text-muted-foreground">{context.description}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {accessibleContexts.length === 1 && (
                        <div className="text-center">
                            <div className="font-medium text-foreground">{activeContext.title}</div>
                            <div className="text-xs text-muted-foreground">{activeContext.description}</div>
                        </div>
                    )}
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 p-4 space-y-1">
                    {navigationItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href || (pathname?.startsWith(item.href + '/') ?? false)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 group",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {Icon && (
                                    <Icon className={cn(
                                        "h-4 w-4 shrink-0 transition-colors",
                                        isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                                    )} />
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className={cn(
                                        "font-medium truncate",
                                        isActive ? "text-primary-foreground" : "text-foreground"
                                    )}>
                                        {item.title}
                                    </div>
                                    {item.description && (
                                        <div className={cn(
                                            "text-xs truncate mt-0.5",
                                            isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                                        )}>
                                            {item.description}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </nav>

                {/* Universal Settings Footer */}
                <div className="p-4 border-t">
                    <Link
                        href="/settings"
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                            pathname === '/settings' || pathname?.startsWith('/settings/')
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Settings className="h-4 w-4 shrink-0" />
                        <span className="font-medium">Settings</span>
                    </Link>
                </div>
            </div>
        )
    }

    if (variant === 'mobile') {
        return (
            <nav className={cn("flex justify-around py-2 bg-background border-t", className)}>
                {navigationItems.slice(0, 4).map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || (pathname?.startsWith(item.href + '/') ?? false)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {Icon && <Icon className="h-4 w-4" />}
                            <span className="truncate">{item.title.split(' ')[0]}</span>
                        </Link>
                    )
                })}
                <Link
                    href="/settings"
                    className={cn(
                        "flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors",
                        pathname === '/settings' || pathname?.startsWith('/settings/')
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Settings className="h-4 w-4" />
                    <span className="truncate">Settings</span>
                </Link>
            </nav>
        )
    }

    // Desktop navigation
    return (
        <nav className={cn("flex items-center gap-1", className)}>
            {/* Context indicator */}
            {accessibleContexts.length > 1 && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-1">
                            <span className="font-medium">{activeContext.title}</span>
                            <ChevronDown className="h-3 w-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        {accessibleContexts.map((context) => (
                            <DropdownMenuItem key={context.key} asChild>
                                <Link href={context.basePath}>
                                    {context.title}
                                </Link>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/settings">
                                <Settings className="h-4 w-4 mr-2" />
                                Settings
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            {accessibleContexts.length === 1 && (
                <div className="px-3 py-1 text-sm font-medium text-muted-foreground">
                    {activeContext.title}
                </div>
            )}

            {/* Navigation items */}
            <div className="flex items-center gap-1">
                {navigationItems.slice(0, 5).map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || (pathname?.startsWith(item.href + '/') ?? false)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            {Icon && <Icon className="h-4 w-4" />}
                            <span className="hidden sm:block">{item.title.split(' ')[0]}</span>
                        </Link>
                    )
                })}

                {/* Universal Settings link */}
                <Link
                    href="/settings"
                    className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                        pathname === '/settings' || pathname?.startsWith('/settings/')
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                >
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:block">Settings</span>
                </Link>
            </div>
        </nav>
    )
} 