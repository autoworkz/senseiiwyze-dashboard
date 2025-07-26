'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Calendar, User, AlertTriangle } from 'lucide-react'

interface InterventionHistoryProps {
  interventions: Array<{
    id: string
    date: string
    type: string
    description: string
    outcome: string
  }>
}

export function InterventionHistory({ interventions }: InterventionHistoryProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'check-in':
        return <MessageSquare className="h-4 w-4 text-blue-600" />
      case 'support':
        return <User className="h-4 w-4 text-green-600" />
      case 'escalation':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'feedback':
        return <MessageSquare className="h-4 w-4 text-purple-600" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />
    }
  }

  const getTypeBadge = (type: string) => {
    const variants = {
      'check-in': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      support: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      escalation: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      feedback: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    }
    
    return (
      <Badge className={variants[type as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {type.replace('-', ' ')}
      </Badge>
    )
  }

  const getOutcomeBadge = (outcome: string) => {
    const variants = {
      positive: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      negative: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    }
    
    return (
      <Badge className={variants[outcome as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {outcome}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Intervention History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {interventions.map((intervention) => (
            <div
              key={intervention.id}
              className="p-4 rounded-lg border bg-muted/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getTypeIcon(intervention.type)}
                  <h4 className="font-medium capitalize">{intervention.type.replace('-', ' ')}</h4>
                </div>
                <div className="flex items-center gap-2">
                  {getTypeBadge(intervention.type)}
                  {getOutcomeBadge(intervention.outcome)}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {intervention.description}
              </p>
              
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{new Date(intervention.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
        
        {interventions.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No interventions yet</h3>
            <p className="text-muted-foreground">
              Interventions will appear here when they are created.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

