'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lock } from 'lucide-react'

interface Achievement {
  icon: string
  title: string
  description: string
  unlocked: boolean
}

interface GameAchievementsProps {
  achievements: Achievement[]
}

export function GameAchievements({ achievements }: GameAchievementsProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Achievements
          <Badge variant="outline">
            {unlockedCount}/{achievements.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-3 rounded-lg border ${
                achievement.unlocked
                  ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                  : 'bg-muted/50 border-muted opacity-60'
              }`}
            >
              <div className="text-2xl">
                {achievement.unlocked ? achievement.icon : <Lock className="h-6 w-6 text-muted-foreground" />}
              </div>
              <div className="flex-1">
                <div className={`font-medium ${
                  achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {achievement.title}
                </div>
                <div className="text-sm text-muted-foreground">
                  {achievement.description}
                </div>
              </div>
              {achievement.unlocked && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Unlocked
                </Badge>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t text-center">
          <div className="text-sm text-muted-foreground">
            Keep playing to unlock more achievements!
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

