'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
    generateMockPsychometricData,
    calculatePsychometricReadinessScore,
    type PsychometricReadinessResult
} from '@/lib/readiness-score-psychometric'

export default function TestReadinessPage() {
    const [results, setResults] = useState<PsychometricReadinessResult | null>(null)
    const [testScenario, setTestScenario] = useState<string>('balanced')
    const [isLoading, setIsLoading] = useState(false)

    const testScenarios = {
        'balanced': 'Balanced Team - Mixed psychometric profiles',
        'high-performers': 'High Performers - Excellent across all metrics',
        'risk-scenario': 'At-Risk Team - Low motivation and personality misalignments',
        'incomplete-data': 'Incomplete Data - Missing psychometric assessments',
        'leadership-ready': 'Leadership Ready - High leadership potential and adaptability'
    }

    const runTest = async () => {
        setIsLoading(true)

        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Generate test data based on scenario
        const mockData = generateMockPsychometricData()

        // Modify data based on selected scenario
        const modifiedData = modifyDataForScenario(mockData, testScenario)

        // Calculate results
        const calculationResult = calculatePsychometricReadinessScore(modifiedData)

        setResults(calculationResult)
        setIsLoading(false)
    }

    const modifyDataForScenario = (data: any, scenario: string) => {
        const users = [...data.users]

        switch (scenario) {
            case 'high-performers':
                return {
                    ...data,
                    users: users.map(user => ({
                        ...user,
                        performanceRating: Math.random() * 1 + 4.0, // 4.0-5.0
                        bigFive: user.bigFive ? {
                            ...user.bigFive,
                            conscientiousness: Math.random() * 15 + 85, // 85-100
                            leadershipPotential: Math.random() * 20 + 80, // 80-100
                            stressResilience: Math.random() * 15 + 85
                        } : user.bigFive,
                        gamingPsychometrics: user.gamingPsychometrics ? {
                            ...user.gamingPsychometrics,
                            cognitiveMetrics: {
                                ...user.gamingPsychometrics.cognitiveMetrics,
                                problemSolvingSpeed: Math.random() * 15 + 85,
                                decisionQuality: Math.random() * 15 + 85
                            }
                        } : user.gamingPsychometrics
                    }))
                }

            case 'risk-scenario':
                return {
                    ...data,
                    users: users.map(user => ({
                        ...user,
                        performanceRating: Math.random() * 1.5 + 2.0, // 2.0-3.5
                        bigFive: user.bigFive ? {
                            ...user.bigFive,
                            neuroticism: Math.random() * 30 + 60, // 60-90 (high stress)
                            conscientiousness: Math.random() * 30 + 20, // 20-50 (low)
                            leadershipPotential: Math.random() * 30 + 20
                        } : user.bigFive,
                        visionBoard: user.visionBoard ? {
                            ...user.visionBoard,
                            motivationProfile: {
                                ...user.visionBoard.motivationProfile,
                                intrinsicMotivation: Math.random() * 30 + 20, // Low motivation
                                growthMindset: Math.random() * 30 + 25
                            },
                            engagementPredictors: {
                                ...user.visionBoard.engagementPredictors,
                                retentionRisk: Math.random() * 30 + 60, // High retention risk
                                likelyEngagementLevel: Math.random() * 30 + 20
                            }
                        } : user.visionBoard
                    }))
                }

            case 'incomplete-data':
                return {
                    ...data,
                    users: users.map((user, index) => ({
                        ...user,
                        bigFive: index % 3 === 0 ? user.bigFive : undefined, // Only 1/3 have Big Five
                        gamingPsychometrics: index % 2 === 0 ? user.gamingPsychometrics : undefined, // Only 1/2 have gaming
                        visionBoard: index % 4 === 0 ? user.visionBoard : undefined // Only 1/4 have vision boards
                    }))
                }

            case 'leadership-ready':
                return {
                    ...data,
                    users: users.map(user => ({
                        ...user,
                        bigFive: user.bigFive ? {
                            ...user.bigFive,
                            leadershipPotential: Math.random() * 15 + 85,
                            changeAdaptability: Math.random() * 15 + 85,
                            extraversion: Math.random() * 20 + 70,
                            conscientiousness: Math.random() * 15 + 80
                        } : user.bigFive,
                        visionBoard: user.visionBoard ? {
                            ...user.visionBoard,
                            engagementPredictors: {
                                ...user.visionBoard.engagementPredictors,
                                leadershipAspiration: Math.random() * 15 + 85,
                                promotionReadiness: Math.random() * 15 + 80
                            }
                        } : user.visionBoard
                    }))
                }

            default:
                return data
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 85) return 'text-green-600'
        if (score >= 70) return 'text-blue-600'
        if (score >= 55) return 'text-yellow-600'
        return 'text-red-600'
    }

    const getScoreLabel = (score: number) => {
        if (score >= 85) return 'Excellent'
        if (score >= 70) return 'Good'
        if (score >= 55) return 'Moderate'
        return 'Needs Attention'
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">🧪 Psychometric Readiness Test Lab</h1>
                    <p className="text-muted-foreground">
                        Test different scenarios to see how the enhanced readiness calculation responds
                    </p>
                </div>

                {/* Test Controls */}
                <Card>
                    <CardHeader>
                        <CardTitle>Test Scenario Selection</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(testScenarios).map(([key, label]) => (
                                <Button
                                    key={key}
                                    variant={testScenario === key ? 'default' : 'outline'}
                                    onClick={() => setTestScenario(key)}
                                    className="h-auto p-4 text-left"
                                >
                                    <div>
                                        <div className="font-medium">{key.replace('-', ' ').toUpperCase()}</div>
                                        <div className="text-xs text-muted-foreground mt-1">{label}</div>
                                    </div>
                                </Button>
                            ))}
                        </div>

                        <Button
                            onClick={runTest}
                            disabled={isLoading}
                            className="w-full"
                            size="lg"
                        >
                            {isLoading ? 'Running Calculation...' : '🚀 Run Psychometric Analysis'}
                        </Button>
                    </CardContent>
                </Card>

                {/* Results Display */}
                {results && (
                    <>
                        {/* Overall Score */}
                        <Card className="border-2 border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    Enhanced Readiness Score
                                    <Badge className={`${getScoreColor(results.overallScore)} border-0`}>
                                        {getScoreLabel(results.overallScore)}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <div className={`text-6xl font-bold ${getScoreColor(results.overallScore)}`}>
                                        {results.overallScore.toFixed(1)}%
                                    </div>
                                    <div className="flex-1">
                                        <Progress value={results.overallScore} className="h-4" />
                                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                            <span>Data Completeness: {(results.dataCompleteness * 100).toFixed(0)}%</span>
                                            <span>Predictive Confidence: {results.predictiveConfidence.toFixed(0)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Component Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Traditional Components */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Traditional Components</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {[
                                        { name: 'Individual Competency', value: results.components.individualCompetency },
                                        { name: 'Team Effectiveness', value: results.components.teamEffectiveness },
                                        { name: 'Organizational Alignment', value: results.components.organizationalAlignment },
                                        { name: 'Adaptability Index', value: results.components.adaptabilityIndex },
                                        { name: 'Risk Mitigation', value: results.components.riskMitigation }
                                    ].map((component) => (
                                        <div key={component.name} className="flex items-center justify-between">
                                            <span className="text-sm">{component.name}</span>
                                            <div className="flex items-center gap-2">
                                                <Progress value={component.value} className="w-20 h-2" />
                                                <span className="text-sm font-medium w-12 text-right">
                                                    {component.value.toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Psychometric Components */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>🧠 Psychometric Components</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {[
                                        { name: 'Personality Alignment', value: results.psychometricComponents.personalityAlignment, color: 'bg-blue-500' },
                                        { name: 'Cognitive Readiness', value: results.psychometricComponents.cognitiveReadiness, color: 'bg-green-500' },
                                        { name: 'Motivational Alignment', value: results.psychometricComponents.motivationalAlignment, color: 'bg-purple-500' },
                                        { name: 'Behavioral Predictors', value: results.psychometricComponents.behavioralPredictors, color: 'bg-orange-500' }
                                    ].map((component) => (
                                        <div key={component.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${component.color}`} />
                                                <span className="text-sm">{component.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Progress value={component.value} className="w-20 h-2" />
                                                <span className="text-sm font-medium w-12 text-right">
                                                    {component.value.toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Insights and Recommendations */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>💡 AI Insights</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {results.insights.map((insight, index) => (
                                            <div key={index} className="flex items-start gap-2 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                                <span>{insight}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>🎯 Recommendations</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {results.recommendations.map((recommendation, index) => (
                                            <div key={index} className="flex items-start gap-2 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                                                <span>{recommendation}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
} 