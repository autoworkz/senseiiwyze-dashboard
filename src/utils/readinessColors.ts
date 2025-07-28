/**
 * Utility functions for consistent readiness score coloring and status styling
 * Uses semantic colors only - compliant with shadcn/ui theming system
 */

export type ReadinessStatus = 'ready' | 'needs-coaching' | 'at-risk' | 'critical'
export type TrendDirection = 'up' | 'down' | 'stable'

/**
 * Get semantic color class for readiness score
 */
export function getReadinessColor(score: number): string {
  if (score >= 85) return 'text-green-600'
  if (score >= 70) return 'text-amber-600' 
  if (score >= 50) return 'text-orange-600'
  return 'text-red-600'
}

/**
 * Get readiness status based on score
 */
export function getReadinessStatus(score: number): ReadinessStatus {
  if (score >= 85) return 'ready'
  if (score >= 70) return 'needs-coaching'
  if (score >= 50) return 'at-risk'
  return 'critical'
}

/**
 * Get status badge styling classes
 */
export function getStatusBadgeClasses(status: ReadinessStatus): string {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border'
  
  switch (status) {
    case 'ready':
      return `${baseClasses} text-green-700 bg-green-50 border-green-200`
    case 'needs-coaching':
      return `${baseClasses} text-amber-700 bg-amber-50 border-amber-200`
    case 'at-risk':
      return `${baseClasses} text-orange-700 bg-orange-50 border-orange-200`
    case 'critical':
      return `${baseClasses} text-red-700 bg-red-50 border-red-200`
    default:
      return `${baseClasses} text-muted-foreground bg-muted border-border`
  }
}

/**
 * Get status label for display
 */
export function getStatusLabel(status: ReadinessStatus): string {
  switch (status) {
    case 'ready': return 'Ready'
    case 'needs-coaching': return 'Needs Coaching'
    case 'at-risk': return 'At Risk'
    case 'critical': return 'Critical'
    default: return 'Unknown'
  }
}

/**
 * Get progress bar color classes based on score
 */
export function getProgressBarClasses(score: number): string {
  if (score >= 85) return 'bg-green-600'
  if (score >= 70) return 'bg-amber-600'
  if (score >= 50) return 'bg-orange-600'
  return 'bg-red-600'
} 