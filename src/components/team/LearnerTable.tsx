'use client'


import { LocaleLocaleLink } from '@/components/locale-link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ExternalLocaleLink, AlertTriangle } from 'lucide-react'

interface Learner {
  id: string
  name: string
  email: string
  track: string
  skillFit: number
  progress: number
  lastActive: Date
  riskStatus: string
  coach: string
  joinDate: Date
}



interface LearnerTableProps {
  learners: Learner[]
}

export function LearnerTable({ learners }: LearnerTableProps) {

  const getRiskBadge = (riskStatus: string) => {
    const variants = {
      red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      amber: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    }
    
    return (
      <Badge className={variants[riskStatus as keyof typeof variants]}>
        {riskStatus} risk
      </Badge>
    )
  }

  const getSkillFitColor = (skillFit: number) => {
    if (skillFit >= 80) return 'text-green-600'
    if (skillFit >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Use learners directly since filtering is done in parent component

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Learner</TableHead>
            <TableHead>Track</TableHead>
            <TableHead>Skill Fit</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Coach</TableHead>
            <TableHead>Risk Status</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {learners.map((learner) => (
            <TableRow key={learner.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={learner.name} />
                    <AvatarFallback>
                      {learner.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{learner.name}</div>
                    <div className="text-sm text-muted-foreground">{learner.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">{learner.track}</div>
              </TableCell>
              <TableCell>
                <div className={`font-medium ${getSkillFitColor(learner.skillFit)}`}>
                  {learner.skillFit}%
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{learner.progress}%</span>
                  </div>
                  <Progress value={learner.progress} className="h-2 w-[80px]" />
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">{learner.coach}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {learner.riskStatus === 'red' && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  {getRiskBadge(learner.riskStatus)}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-muted-foreground">
                  {new Date(learner.lastActive).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" asChild>
                  <LocaleLink href={`/team/profile/${learner.id}`} className="gap-1">
                    <ExternalLocaleLink className="h-3 w-3" />
                    View
                  </LocaleLink>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {learners.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No learners match the current filters.</p>
        </div>
      )}
    </div>
  )
}
