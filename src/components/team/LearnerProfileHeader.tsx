'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Mail, User, AlertTriangle } from 'lucide-react'

interface LearnerProfileHeaderProps {
  learner: {
    id: string
    name: string
    email: string
    avatar: string
    track: string
    joinDate: string
    coach: string
    metrics: {
      skillFit: number
      progress: number
      riskScore: string
      engagement: number
      performance: number
    }
  }
}

export function LearnerProfileHeader({ learner }: LearnerProfileHeaderProps) {

  const getRiskBadge = (riskLevel: string) => {
    const variants = {
      high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    }
    
    return (
      <Badge className={variants[riskLevel as keyof typeof variants]}>
        {riskLevel} risk
      </Badge>
    )
  }

  const getSkillFitColor = (skillFit: number) => {
    if (skillFit >= 80) return 'text-green-600'
    if (skillFit >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={learner.avatar} alt={learner.name} />
            <AvatarFallback className="text-lg">
              {learner.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{learner.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <Mail className="h-4 w-4" />
                  <span>{learner.email}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {learner.metrics.riskScore === 'high' && (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
                {getRiskBadge(learner.metrics.riskScore)}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Track</div>
                  <div className="text-sm text-muted-foreground">{learner.track}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Joined</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(learner.joinDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Coach</div>
                  <div className="text-sm text-muted-foreground">{learner.coach}</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium">Skill Fit</div>
                <div className={`text-sm font-bold ${getSkillFitColor(learner.metrics.skillFit)}`}>
                  {learner.metrics.skillFit}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
