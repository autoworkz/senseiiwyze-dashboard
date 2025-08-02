import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full'
  noPadding?: boolean
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md', 
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full'
}

/**
 * Standardized page container component for consistent layouts
 * 
 * Usage:
 * - <PageContainer> - Default: p-8, max-w-6xl, centered
 * - <PageContainer maxWidth="4xl"> - Custom max width
 * - <PageContainer noPadding> - No padding (for custom layouts)
 * - <PageContainer className="space-y-6"> - Additional classes
 */
export function PageContainer({ 
  children, 
  className,
  maxWidth = '6xl',
  noPadding = false
}: PageContainerProps) {
  return (
    <div className={cn(
      // Base layout: centered with responsive padding
      'mx-auto',
      maxWidthClasses[maxWidth],
      
      // Standard padding unless disabled
      !noPadding && 'p-6 sm:p-8',
      
      // Allow custom classes
      className
    )}>
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
    <div className={cn('mb-8', className)}>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        {children && (
          <div className="flex gap-2">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}