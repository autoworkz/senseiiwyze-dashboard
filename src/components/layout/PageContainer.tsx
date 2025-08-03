import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'default' | 'wide' | 'narrow' | 'full'
  noPadding?: boolean
}

const maxWidthClasses = {
  narrow: 'max-w-4xl', // 896px - for focused content
  default: 'max-w-7xl', // 1280px - standard app width
  wide: 'max-w-[1440px]', // 1440px - for data-heavy pages
  full: 'max-w-full', // Full width
}

/**
 * Standardized page container component for consistent layouts
 *
 * Usage:
 * - <PageContainer> - Default: responsive padding, max-w-7xl (1280px), centered
 * - <PageContainer maxWidth="narrow"> - For focused content (896px)
 * - <PageContainer maxWidth="wide"> - For data-heavy pages (1440px)
 * - <PageContainer noPadding> - No padding (for custom layouts)
 * - <PageContainer className="space-y-6"> - Additional classes
 */
export function PageContainer({
  children,
  className,
  maxWidth = 'default',
  noPadding = false,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        // Base layout: centered with max width
        'mx-auto w-full',
        maxWidthClasses[maxWidth],

        // Responsive padding unless disabled
        !noPadding && 'px-4 sm:px-6 lg:px-8 py-6 sm:py-8',

        // Allow custom classes
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * Page header component for consistent title/description layout
 */
interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
  className?: string
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn('space-y-4 pb-6 border-b border-border/50', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
          )}
        </div>
        {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
      </div>
    </div>
  )
}

/**
 * Page section component for consistent spacing between sections
 */
interface PageSectionProps {
  children: ReactNode
  className?: string
  title?: string
  description?: string
}

export function PageSection({ children, className, title, description }: PageSectionProps) {
  return (
    <section className={cn('space-y-6', className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <h2 className="text-xl font-semibold tracking-tight">{title}</h2>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
    </section>
  )
}
