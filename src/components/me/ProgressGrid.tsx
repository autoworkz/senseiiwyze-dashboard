'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProgressGridProps {
  metrics: {
    skillFit: number
    overallProgress: number
    visionAlignment: number
    gameIndex: number
    gritScore: number
  }
}

export function ProgressGrid({ metrics }: ProgressGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.overallProgress}%</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Vision Alignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(metrics.visionAlignment * 100)}%</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Game Index</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(metrics.gameIndex * 100)}%</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Grit Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.gritScore}/10</div>
        </CardContent>
      </Card>
    </div>
  )
}
