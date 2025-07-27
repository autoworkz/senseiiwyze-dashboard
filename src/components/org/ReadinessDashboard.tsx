'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
    TrendingUp,
    TrendingDown,
    Target,
    AlertTriangle,
    Users,
    CheckCircle,
    Clock,
    Activity
} from 'lucide-react'
import {
    generateMockReadinessData,
    generateReadinessBreakdown,
    calculateReadinessScore,
    getReadinessLevel,
    getReadinessColor,
    generateExecutiveInsights,
    type ReadinessMetrics,
    type ReadinessBreakdown as ReadinessBreakdownType,
    type DepartmentReadiness,
    type ProgramReadiness
} from '@/lib/readiness-score'
import {
    generateMockCalculationData,
    calculateComprehensiveReadinessScore,
    type ReadinessCalculationResult
} from '@/lib/readiness-score-calculation'
import {
    generateMockPsychometricData,
    calculatePsychometricReadinessScore,
    type PsychometricReadinessResult
} from '@/lib/readiness-score-psychometric'

interface ReadinessDashboardProps {
    className?: string
}

export function ReadinessDashboard({ className }: ReadinessDashboardProps) {
    const [metrics, setMetrics] = useState<ReadinessMetrics | null>(null)
    const [breakdown, setBreakdown] = useState<ReadinessBreakdownType | null>(null)
    const [calculationResult, setCalculationResult] = useState<ReadinessCalculationResult | null>(null)
    const [psychometricResult, setPsychometricResult] = useState<PsychometricReadinessResult | null>(null)
    const [insights, setInsights] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Mock departments data
    const mockDepartments: DepartmentReadiness[] = [
        {
            department: 'Engineering',
            readinessScore: 89.3,
            employeeCount: 245,
            criticalGaps: ['Cloud Architecture', 'AI/ML'],
            trend: 'improving'
        },
        {
            department: 'Sales',
            readinessScore: 82.7,
            employeeCount: 156,
            criticalGaps: ['Product Knowledge', 'CRM Proficiency'],
            trend: 'stable'
        },
        {
            department: 'Operations',
            readinessScore: 75.1,
            employeeCount: 198,
            criticalGaps: ['Process Optimization', 'Digital Tools'],
            trend: 'improving'
        },
        {
            department: 'Finance',
            readinessScore: 91.2,
            employeeCount: 87,
            criticalGaps: [],
            trend: 'stable'
        }
    ]

    // Mock programs data
    const mockPrograms: ProgramReadiness[] = [
        {
            programId: 'prog-001',
            programName: 'Leadership Development',
            readinessScore: 87.5,
            enrollmentCount: 234,
            completionRate: 78.2,
            effectivenessRating: 4.3
        },
        {
            programId: 'prog-002',
            programName: 'Technical Skills Bootcamp',
            readinessScore: 82.1,
            enrollmentCount: 445,
            completionRate: 69.8,
            effectivenessRating: 4.1
        },
        {
            programId: 'prog-003',
            programName: 'Compliance Training',
            readinessScore: 94.7,
            enrollmentCount: 1247,
            completionRate: 95.3,
            effectivenessRating: 3.9
        }
    ]

    // Simulate data loading
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Use enhanced psychometric calculation system
            const mockPsychometricData = generateMockPsychometricData()
            const psychometricResult = calculatePsychometricReadinessScore(mockPsychometricData)

            // Also generate traditional calculation for comparison
            const mockCalculationData = generateMockCalculationData()
            const comprehensiveResult = calculateComprehensiveReadinessScore(mockCalculationData)

            // Legacy format for backward compatibility
            const mockMetrics = generateMockReadinessData()
            const readinessBreakdown = generateReadinessBreakdown(
                mockMetrics,
                mockDepartments,
                mockPrograms
            )

            setPsychometricResult(psychometricResult)
            setCalculationResult(comprehensiveResult)
            setMetrics(mockMetrics)
            setBreakdown(readinessBreakdown)
            setInsights(psychometricResult.insights)
            setIsLoading(false)
        }

        loadData()

        // Set up real-time updates every 30 seconds
        const interval = setInterval(loadData, 30000)
        return () => clearInterval(interval)
    }, [])

    if (isLoading || !metrics || !breakdown || !calculationResult || !psychometricResult) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Organizational Readiness Score
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="h-24 bg-muted animate-pulse rounded-lg" />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-16 bg-muted animate-pulse rounded-lg" />
                            <div className="h-16 bg-muted animate-pulse rounded-lg" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Use enhanced psychometric calculation result
    const overallScore = psychometricResult.overallScore
    const readinessLevel = psychometricResult.gradeLevel
    const colorClass = getReadinessColor(overallScore)
    const trendDirection = metrics.quarterlyGrowth > 0 ? 'up' : 'down'

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Organizational Readiness Score
                    </div>
                    <Badge variant="outline" className="gap-1">
                        <Activity className="h-3 w-3" />
                        Live Data
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Main Readiness Score Display */}
                <div className="text-center space-y-4">
                    <div className="relative">
                        <div className={`text-6xl font-bold ${colorClass.split(' ')[0]} mb-2`}>
                            {overallScore.toFixed(1)}%
                        </div>
                        <Badge className={`${colorClass} border-0 text-sm font-medium`}>
                            {readinessLevel.toUpperCase()}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                            {trendDirection === 'up' ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                            <span className={trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}>
                                {Math.abs(metrics.quarterlyGrowth).toFixed(1)}% QoQ
                            </span>
                        </div>
                        <div className="text-muted-foreground">
                            Projected: {breakdown.projectedReadiness.toFixed(1)}%
                        </div>
                    </div>
                </div>

                {/* Enhanced Psychometric Component Breakdown */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Enhanced Readiness Components (Psychometric Analysis)</h4>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-sm">Individual Competency</span>
                                <span className="text-xs text-muted-foreground">Learning progress, skills, assessments</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Progress value={psychometricResult.components.individualCompetency} className="w-20 h-2" />
                                <span className="text-sm font-medium w-12 text-right">
                                    {psychometricResult.components.individualCompetency.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-sm">Team Effectiveness</span>
                                <span className="text-xs text-muted-foreground">Dept performance, collaboration</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Progress value={psychometricResult.components.teamEffectiveness} className="w-20 h-2" />
                                <span className="text-sm font-medium w-12 text-right">
                                    {psychometricResult.components.teamEffectiveness.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-sm">Organizational Alignment</span>
                                <span className="text-xs text-muted-foreground">Strategic goals, customer satisfaction</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Progress value={psychometricResult.components.organizationalAlignment} className="w-20 h-2" />
                                <span className="text-sm font-medium w-12 text-right">
                                    {psychometricResult.components.organizationalAlignment.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-sm">Adaptability Index</span>
                                <span className="text-xs text-muted-foreground">Innovation, learning agility</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Progress value={psychometricResult.components.adaptabilityIndex} className="w-20 h-2" />
                                <span className="text-sm font-medium w-12 text-right">
                                    {psychometricResult.components.adaptabilityIndex.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-sm">Risk Mitigation</span>
                                <span className="text-xs text-muted-foreground">Compliance, consistency, coverage</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Progress value={psychometricResult.components.riskMitigation} className="w-20 h-2" />
                                <span className="text-sm font-medium w-12 text-right">
                                    {psychometricResult.components.riskMitigation.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-t pt-2">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-primary">Psychometric Readiness</span>
                                <span className="text-xs text-muted-foreground">Big Five, gaming analytics, vision alignment</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Progress value={(psychometricResult as any).components.psychometricReadiness || 85} className="w-20 h-2" />
                                <span className="text-sm font-medium w-12 text-right text-primary">
                                    {((psychometricResult as any).components.psychometricReadiness || 85).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Psychometric Deep Dive */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Psychometric Analysis</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-muted/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-xs text-muted-foreground">Personality Alignment</span>
                            </div>
                            <div className="text-lg font-bold">{psychometricResult.psychometricComponents.personalityAlignment.toFixed(1)}%</div>
                            <div className="text-xs text-muted-foreground">Big Five role fit</div>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-xs text-muted-foreground">Cognitive Readiness</span>
                            </div>
                            <div className="text-lg font-bold">{psychometricResult.psychometricComponents.cognitiveReadiness.toFixed(1)}%</div>
                            <div className="text-xs text-muted-foreground">Gaming analytics</div>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full bg-purple-500" />
                                <span className="text-xs text-muted-foreground">Motivational Alignment</span>
                            </div>
                            <div className="text-lg font-bold">{psychometricResult.psychometricComponents.motivationalAlignment.toFixed(1)}%</div>
                            <div className="text-xs text-muted-foreground">Vision board insights</div>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full bg-orange-500" />
                                <span className="text-xs text-muted-foreground">Behavioral Predictors</span>
                            </div>
                            <div className="text-lg font-bold">{psychometricResult.psychometricComponents.behavioralPredictors.toFixed(1)}%</div>
                            <div className="text-xs text-muted-foreground">Combined indicators</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                            Data Completeness: {(psychometricResult.dataCompleteness * 100).toFixed(0)}%
                        </span>
                        <span className="text-muted-foreground">
                            Predictive Confidence: {psychometricResult.predictiveConfidence.toFixed(0)}%
                        </span>
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Total Workforce</span>
                        </div>
                        <div className="text-xl font-bold">{metrics.totalEmployees.toLocaleString()}</div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Active Learners</span>
                        </div>
                        <div className="text-xl font-bold">{metrics.activeTrainees.toLocaleString()}</div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <span className="text-xs text-muted-foreground">At Risk</span>
                        </div>
                        <div className="text-xl font-bold text-orange-600">{metrics.atRiskIndividuals}</div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Programs</span>
                        </div>
                        <div className="text-xl font-bold">{metrics.completedPrograms}</div>
                    </div>
                </div>

                {/* Executive Insights */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Executive Insights</h4>
                    <div className="space-y-2">
                        {insights.map((insight, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                <span className="text-muted-foreground">{insight}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actionable Recommendations */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Priority Recommendations</h4>
                    <div className="space-y-2">
                        {calculationResult.recommendations.map((recommendation, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                                <span className="text-muted-foreground">{recommendation}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Department Leaders */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Top Performing Departments</h4>
                    <div className="space-y-2">
                        {breakdown.byDepartment
                            .sort((a, b) => b.readinessScore - a.readinessScore)
                            .slice(0, 3)
                            .map((dept, index) => (
                                <div key={dept.department} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center`}>
                                            {index + 1}
                                        </div>
                                        <span className="text-sm">{dept.department}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-xs">
                                            {dept.readinessScore.toFixed(1)}%
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {dept.employeeCount} employees
                                        </span>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Last Updated */}
                <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                    Last updated: {new Date().toLocaleTimeString()} • Auto-refresh every 30s
                </div>
            </CardContent>
        </Card>
    )
} 