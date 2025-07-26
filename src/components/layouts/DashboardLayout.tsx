'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  fullWidth?: boolean
}

export function DashboardLayout({
  children,
  title,
  subtitle,
  actions,
  fullWidth = false
}: DashboardLayoutProps) {
  return (
    <main className="min-h-screen bg-background px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        {(title || actions) && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                {title && (
                  <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
                )}
              </div>
              {actions && (
                <div className="flex items-center gap-4">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className={cn(
          "mx-auto",
          !fullWidth && "max-w-7xl"
        )}>
          {children}
        </div>
      </div>
    </main>
  )
}