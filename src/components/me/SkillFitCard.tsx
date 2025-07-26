'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SkillFitCardProps {
  score: number
  trend: number
  className?: string
}

export function SkillFitCard({ score, trend, className }: SkillFitCardProps) {
  const isPositiveTrend = trend > 0
  
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Skill Fit Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">{score}%</div>
          <div className={cn(
            "flex items-center gap-1 text-sm",
            isPositiveTrend ? "text-green-600" : "text-red-600"
          )}>
            {isPositiveTrend ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{Math.abs(trend)}%</span>
          </div>
        </div>
        <div className="mt-4 w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Your compatibility with the current learning track
        </p>
      </CardContent>
    </Card>
  )
}
