'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface FinancialSnapshotProps {
    data?: Record<string, any> | null
    isLoading?: boolean
}

export function FinancialSnapshot({ data, isLoading }: FinancialSnapshotProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Financial Performance
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Financial Performance
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Revenue Impact</span>
                        <div className="flex items-center gap-1">
                            <span className="font-medium">$2.4M</span>
                            <Badge variant="secondary" className="text-xs">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +15%
                            </Badge>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Training ROI</span>
                        <div className="flex items-center gap-1">
                            <span className="font-medium">324%</span>
                            <Badge variant="default" className="text-xs">
                                Target: 200%
                            </Badge>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Cost Efficiency</span>
                        <div className="flex items-center gap-1">
                            <span className="font-medium">$284</span>
                            <Badge variant="secondary" className="text-xs">
                                <TrendingDown className="h-3 w-3 mr-1" />
                                -42%
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="pt-3 border-t">
                    <div className="text-xs text-muted-foreground">
                        Based on Q1 training data and productivity metrics
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 