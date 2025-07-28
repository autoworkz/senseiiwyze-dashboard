'use client'

import { Card, CardContent } from '@/components/ui/card'
import { LearnerSummaryStats } from './types'
import { getReadinessColor } from '@/utils/readinessColors'
import { TrendIcon } from '@/utils/trendIcon'

interface SummaryStatsCardsProps {
    stats: LearnerSummaryStats
    isLoading?: boolean
}

export function SummaryStatsCards({ stats, isLoading = false }: SummaryStatsCardsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="pt-6">
                            <div className="animate-pulse">
                                <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                                <div className="h-8 bg-muted rounded w-16 mb-1"></div>
                                <div className="h-3 bg-muted rounded w-12"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    const readyPercentage = Math.round((stats.readyForDeployment / stats.totalLearners) * 100)
    const coachingPercentage = Math.round((stats.needsCoaching / stats.totalLearners) * 100)
    const atRiskPercentage = Math.round(((stats.atRisk + stats.critical) / stats.totalLearners) * 100)

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Users */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Learners</p>
                            <p className="text-2xl font-bold text-foreground">{stats.totalLearners}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground">Avg. Readiness</p>
                            <p className={`text-lg font-semibold ${getReadinessColor(stats.averageReadiness)}`}>
                                {stats.averageReadiness}%
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Ready for Deployment */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Ready for Deployment</p>
                            <p className="text-2xl font-bold text-green-600">{stats.readyForDeployment}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground">Percentage</p>
                            <p className="text-lg font-semibold text-green-600">{readyPercentage}%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Needs Coaching */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Needs Coaching</p>
                            <p className="text-2xl font-bold text-amber-600">{stats.needsCoaching}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground">Percentage</p>
                            <p className="text-lg font-semibold text-amber-600">{coachingPercentage}%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* At Risk */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">At Risk</p>
                            <p className="text-2xl font-bold text-red-600">{stats.atRisk + stats.critical}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground">Percentage</p>
                            <p className="text-lg font-semibold text-red-600">{atRiskPercentage}%</p>
                        </div>
                    </div>
                    {stats.critical > 0 && (
                        <div className="mt-2 pt-2 border-t border-border">
                            <p className="text-xs text-red-700">
                                {stats.critical} critical cases need immediate attention
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
} 