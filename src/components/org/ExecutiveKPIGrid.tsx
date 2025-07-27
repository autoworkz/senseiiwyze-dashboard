'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Target,
    Users,
    Building2,
    AlertTriangle,
    Shield,
    Activity
} from 'lucide-react'
import { getReadinessColor, getReadinessLevel } from '@/lib/readiness-score'

interface ExecutiveKPIData {
    // Readiness Score (Primary Metric)
    readinessScore: number
    readinessChange: number
    readinessTrend: 'up' | 'down' | 'stable'

    // Financial Metrics
    revenue: number
    revenueGrowth: number
    trainingROI: number
    costPerEmployee: number

    // Operational Metrics
    workforceCount: number
    retentionRate: number
    productivityIndex: number
    complianceScore: number

    // Risk Metrics
    atRiskEmployees: number
    criticalIssues: number
    riskTrend: 'improving' | 'declining' | 'stable'
}

interface ExecutiveKPIGridProps {
    data?: ExecutiveKPIData
    isLoading?: boolean
    className?: string
}

export function ExecutiveKPIGrid({ data, isLoading, className }: ExecutiveKPIGridProps) {
    // Mock data for demonstration
    const mockData: ExecutiveKPIData = {
        readinessScore: 87.3,
        readinessChange: 5.2,
        readinessTrend: 'up',
        revenue: 2400000,
        revenueGrowth: 15.2,
        trainingROI: 324,
        costPerEmployee: 284,
        workforceCount: 1247,
        retentionRate: 94.7,
        productivityIndex: 112.3,
        complianceScore: 89.1,
        atRiskEmployees: 23,
        criticalIssues: 3,
        riskTrend: 'improving'
    }

    const kpiData = data || mockData
    const readinessLevel = getReadinessLevel(kpiData.readinessScore)
    const readinessColor = getReadinessColor(kpiData.readinessScore)

    if (isLoading) {
        return (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                <div className="h-4 bg-muted animate-pulse rounded" />
                                <div className="h-8 bg-muted animate-pulse rounded" />
                                <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
            {/* Primary Metric: Enhanced Readiness Score */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Organizational Readiness</CardTitle>
                    <Target className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline gap-2">
                        <div className="text-3xl font-bold text-primary">
                            {kpiData.readinessScore.toFixed(1)}%
                        </div>
                        <Badge className={`${readinessColor} border-0 text-xs`}>
                            {readinessLevel.toUpperCase()}
                        </Badge>
                    </div>
                    <div className="flex items-center text-xs mt-2">
                        {kpiData.readinessTrend === 'up' ? (
                            <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                        ) : (
                            <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                        )}
                        <span className={kpiData.readinessTrend === 'up' ? 'text-green-600' : 'text-red-600'}>
                            {kpiData.readinessChange > 0 ? '+' : ''}{kpiData.readinessChange.toFixed(1)}% this quarter
                        </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        Enhanced with psychometric analysis
                    </div>
                </CardContent>
            </Card>

            {/* Revenue Impact */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue Impact</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ${(kpiData.revenue / 1000000).toFixed(1)}M
                    </div>
                    <div className="flex items-center text-xs text-green-600 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +{kpiData.revenueGrowth.toFixed(1)}% from training impact
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        ROI: {kpiData.trainingROI}%
                    </div>
                </CardContent>
            </Card>

            {/* Workforce Metrics */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Workforce Health</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpiData.workforceCount.toLocaleString()}</div>
                    <div className="space-y-1 mt-2">
                        <div className="flex justify-between text-xs">
                            <span>Retention Rate</span>
                            <span className="font-medium text-green-600">{kpiData.retentionRate}%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span>Productivity</span>
                            <span className="font-medium">{kpiData.productivityIndex}%</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Risk Assessment</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{kpiData.atRiskEmployees}</div>
                    <div className="text-xs text-muted-foreground">High-risk employees</div>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-xs">Critical Issues</span>
                        <Badge variant={kpiData.criticalIssues > 5 ? 'destructive' : 'secondary'} className="text-xs">
                            {kpiData.criticalIssues}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Training Efficiency */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Training Efficiency</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${kpiData.costPerEmployee}</div>
                    <div className="text-xs text-muted-foreground">Cost per employee</div>
                    <div className="flex items-center text-xs text-green-600 mt-1">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        42% below industry avg
                    </div>
                </CardContent>
            </Card>

            {/* Compliance Status */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpiData.complianceScore.toFixed(1)}%</div>
                    <Progress value={kpiData.complianceScore} className="mt-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                        2 items need attention
                    </div>
                </CardContent>
            </Card>

            {/* Readiness Trends */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Readiness Projection</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-600">91.5%</div>
                    <div className="text-xs text-muted-foreground">6-month projection</div>
                    <div className="flex items-center text-xs text-blue-600 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +4.2% projected growth
                    </div>
                </CardContent>
            </Card>

            {/* Board Readiness Summary */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Board Summary</CardTitle>
                    <Building2 className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs">Overall Health</span>
                            <Badge className="bg-green-100 text-green-800 text-xs">STRONG</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs">Growth Trajectory</span>
                            <div className="flex items-center text-xs text-green-600">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                POSITIVE
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs">Risk Level</span>
                            <Badge variant="secondary" className="text-xs">LOW</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 