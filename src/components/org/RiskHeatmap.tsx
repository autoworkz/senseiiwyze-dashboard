'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, TrendingUp } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface RiskHeatmapProps {
    data?: any[] | null
    isLoading?: boolean
}

export function RiskHeatmap({ data, isLoading }: RiskHeatmapProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Risk Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </CardContent>
            </Card>
        )
    }

    const riskCategories = [
        { name: 'High Risk Learners', count: 23, severity: 'high', trend: '+2' },
        { name: 'Program Delays', count: 5, severity: 'medium', trend: '-1' },
        { name: 'Compliance Issues', count: 2, severity: 'high', trend: '0' },
        { name: 'Resource Constraints', count: 8, severity: 'medium', trend: '+3' },
    ]

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high':
                return 'bg-red-100 text-red-800 border-red-200'
            case 'medium':
                return 'bg-orange-100 text-orange-800 border-orange-200'
            case 'low':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Risk Analysis
                    </div>
                    <Badge variant="outline" className="text-xs">
                        Medium Overall Risk
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Risk Heatmap Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {riskCategories.map((category, index) => (
                        <div
                            key={index}
                            className={`p-3 rounded-lg border ${getSeverityColor(category.severity)}`}
                        >
                            <div className="text-sm font-medium">{category.name}</div>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-lg font-bold">{category.count}</span>
                                <div className="flex items-center text-xs">
                                    {category.trend !== '0' && (
                                        <>
                                            {category.trend.startsWith('+') ? (
                                                <TrendingUp className="h-3 w-3 mr-1" />
                                            ) : (
                                                <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                                            )}
                                            {category.trend}
                                        </>
                                    )}
                                    {category.trend === '0' && (
                                        <span className="text-gray-500">No change</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Risk Summary */}
                <div className="pt-3 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Risk Items</span>
                        <span className="font-medium">38</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Trend vs Last Month</span>
                        <span className="font-medium text-orange-600">+4 items</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Next risk review: Weekly executive meeting
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 