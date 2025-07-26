'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Progress } from '@/components/ui/progress'
import { TrendingUp, TrendingDown, AlertTriangle, Users, Target } from 'lucide-react'

interface TeamInsightsProps {
  data: {
    totalLearners: number
    averageSkillFit: number
    atRiskPercentage: number
    atRiskCount: number
    weeklyActive: number
    completionRate: number
    averageProgress: number
  }
}

export function TeamInsights({ data }: TeamInsightsProps) {
  const insights = [
    {
      type: 'metric',
      icon: <Users className="h-4 w-4 text-blue-600" />,
      title: 'Team Composition',
      description: `Managing ${data.totalLearners} learners with ${data.weeklyActive} active this week`,
      value: `${Math.round((data.weeklyActive / data.totalLearners) * 100)}%`,
      label: 'Weekly Engagement',
      trend: null,
    },
    {
      type: 'warning',
      icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
      title: 'At-Risk Learners',
      description: `${data.atRiskCount} learners (${data.atRiskPercentage}%) require immediate attention`,
      value: data.atRiskCount.toString(),
      label: 'High Priority',
      trend: data.atRiskPercentage > 15 ? 'up' : 'stable',
    },
    {
      type: 'positive',
      icon: <Target className="h-4 w-4 text-green-600" />,
      title: 'Skill Alignment',
      description: `Average skill fit of ${data.averageSkillFit}% indicates good program matching`,
      value: `${data.averageSkillFit}%`,
      label: 'Skill Fit',
      trend: data.averageSkillFit > 75 ? 'up' : 'down',
    },
    {
      type: 'metric',
      icon: <TrendingUp className="h-4 w-4 text-purple-600" />,
      title: 'Progress Tracking',
      description: `Team average progress is ${data.averageProgress}% with ${data.completionRate}% completion rate`,
      value: `${data.averageProgress}%`,
      label: 'Avg Progress',
      trend: data.averageProgress > 60 ? 'up' : 'down',
    },
  ]

  const getTrendIcon = (trend: string | null) => {
    if (!trend || trend === 'stable') return null
    return trend === 'up' ? (
      <TrendingUp className="h-3 w-3 text-green-600" />
    ) : (
      <TrendingDown className="h-3 w-3 text-red-600" />
    )
  }

  const getCardBorder = (type: string) => {
    switch (type) {
      case 'positive':
        return 'border-green-200 dark:border-green-800'
      case 'warning':
        return 'border-red-200 dark:border-red-800'
      case 'metric':
        return 'border-blue-200 dark:border-blue-800'
      default:
        return 'border-border'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getCardBorder(insight.type)} bg-muted/50`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {insight.icon}
                  <h4 className="font-medium">{insight.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-lg font-bold">{insight.value}</div>
                    <div className="text-xs text-muted-foreground">{insight.label}</div>
                  </div>
                  {getTrendIcon(insight.trend)}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {insight.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Team Health Score</span>
              <span className="font-medium">
                {Math.round(((100 - data.atRiskPercentage) + data.averageSkillFit + data.averageProgress) / 3)}%
              </span>
            </div>
            <Progress 
              value={Math.round(((100 - data.atRiskPercentage) + data.averageSkillFit + data.averageProgress) / 3)} 
              className="h-2" 
            />
            <div className="text-xs text-muted-foreground">
              Based on risk level, skill fit, and progress metrics
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
