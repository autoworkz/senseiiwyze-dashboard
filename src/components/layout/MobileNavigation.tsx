'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Menu, X, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  dashboardNavigation,
  isNavigationItemActive,
  type NavigationItem
} from '@/lib/navigation-config'

interface MobileNavigationProps {
  className?: string
}

export function MobileNavigation({ className }: MobileNavigationProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href)
        ? prev.filter(h => h !== href)
        : [...prev, href]
    )
  }

  const renderNavigationItem = (item: NavigationItem, depth = 0) => {
    const Icon = item.icon
    const isActive = isNavigationItemActive(item, pathname)
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.href)

    return (
      <div key={item.href} className={cn(depth > 0 && "ml-4")}>
        {hasChildren ? (
          <>
            <button
              onClick={() => toggleExpanded(item.href)}
              className={cn(
                "w-full flex items-center justify-between gap-3 py-3 px-4 rounded-lg transition-all duration-200",
                "hover:bg-accent/50",
                isActive && "bg-accent text-accent-foreground font-medium"
              )}
            >
              <div className="flex items-center gap-3">
                {Icon && <Icon className="h-5 w-5" />}
                <span>{item.title}</span>
              </div>
              <ChevronRight 
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isExpanded && "rotate-90"
                )} 
              />
            </button>
            {isExpanded && (
              <div className="mt-1 space-y-1">
                {item.children?.map(child => renderNavigationItem(child, depth + 1))}
              </div>
            )}
          </>
        ) : (
          <Link
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200",
              "hover:bg-accent/50 hover:translate-x-1",
              isActive && "bg-accent text-accent-foreground font-medium"
            )}
          >
            {Icon && <Icon className="h-5 w-5" />}
            <span>{item.title}</span>
          </Link>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile menu trigger */}
      <Button
        variant="ghost"
        size="icon"
        className={cn("md:hidden", className)}
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden animate-in fade-in-0 duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-80 bg-background border-r shadow-xl z-50 md:hidden",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <Link 
            href="/app" 
            className="flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-lg">SenseiiWyze</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-73px)]">
          {dashboardNavigation.map(item => renderNavigationItem(item))}
        </nav>
      </div>
    </>
  )
}