'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

interface ExecutiveInsightsProps {
  data: {
    completionRate: {
      value: number
      trend: number
      period: string
      history: number[]
    }
    costPerCompletion: {
      value: number
      trend: number
      period: string
      history: number[]
    }
    atRiskCount: {
      value: number
      trend: number
      period: string
      alert: boolean
    }
    averageTimeToComplete: number
  }
}

export function ExecutiveInsights({ data }: ExecutiveInsightsProps) {
  const insights = [
    {
      type: 'positive',
      icon: <TrendingUp className="h-4 w-4 text-green-600" />,
      title: 'Completion Rate Trending Up',
      description: `Completion rate has increased by ${data.completionRate.trend}% this month, indicating improved learner engagement.`,
      impact: 'High',
    },
    {
      type: 'warning',
      icon: <AlertTriangle className="h-4 w-4 text-yellow-600" />,
      title: 'At-Risk Learners Require Attention',
      description: `${data.atRiskCount.value} learners are currently at risk of not completing their programs.`,
      impact: 'Medium',
    },
    {
      type: 'neutral',
      icon: <Clock className="h-4 w-4 text-blue-600" />,
      title: 'Average Completion Time Stable',
      description: `Programs are completing in an average of ${data.averageTimeToComplete} weeks, within expected range.`,
      impact: 'Low',
    },
    {
      type: 'positive',
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
      title: 'Cost Efficiency Improving',
      description: `Cost per completion has decreased by ${Math.abs(data.costPerCompletion.trend)}%, showing improved ROI.`,
      impact: 'High',
    },
  ]

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'High':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">High Impact</Badge>
      case 'Medium':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Medium Impact</Badge>
      case 'Low':
        return <Badge variant="outline">Low Impact</Badge>
      default:
        return null
    }
  }

  const getCardBorder = (type: string) => {
    switch (type) {
      case 'positive':
        return 'border-green-200 dark:border-green-800'
      case 'warning':
        return 'border-yellow-200 dark:border-yellow-800'
      case 'negative':
        return 'border-red-200 dark:border-red-800'
      default:
        return 'border-border'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Executive Insights</CardTitle>
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
                {getImpactBadge(insight.impact)}
              </div>
              <p className="text-sm text-muted-foreground">
                {insight.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            <strong>Key Recommendation:</strong> Focus on the {data.atRiskCount.value} at-risk learners 
            to maintain the positive completion rate trend and maximize program ROI.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
