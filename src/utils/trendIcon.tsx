import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { TrendDirection } from './readinessColors'

interface TrendIconProps {
    trend: TrendDirection
    className?: string
}

/**
 * Visual trend indicator for learner progress
 * Shows up/down/stable arrows with semantic colors
 */
export function TrendIcon({ trend, className = 'h-4 w-4' }: TrendIconProps) {
    switch (trend) {
        case 'up':
            return <TrendingUp className={`${className} text-green-600`} />
        case 'down':
            return <TrendingDown className={`${className} text-red-600`} />
        case 'stable':
            return <Minus className={`${className} text-muted-foreground`} />
        default:
            return <Minus className={`${className} text-muted-foreground`} />
    }
}

/**
 * Get trend description for accessibility
 */
export function getTrendLabel(trend: TrendDirection): string {
    switch (trend) {
        case 'up': return 'Improving'
        case 'down': return 'Declining'
        case 'stable': return 'Stable'
        default: return 'No change'
    }
} 