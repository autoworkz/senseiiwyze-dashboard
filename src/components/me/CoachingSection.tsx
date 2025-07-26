'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Info } from 'lucide-react'

interface CoachingSectionProps {
  interventions: Array<{
    id: string
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
    action: string
  }>
}

export function CoachingSection({ interventions }: CoachingSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Coaching Recommendations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {interventions.map((intervention) => (
          <Card key={intervention.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                {intervention.priority === 'high' ? (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                ) : (
                  <Info className="h-4 w-4 text-blue-500" />
                )}
                <CardTitle className="text-sm">{intervention.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {intervention.description}
              </p>
              <Button size="sm" variant="outline">
                {intervention.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
