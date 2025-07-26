'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Crown, Medal, Award } from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  name: string
  score: number
}

interface GameLeaderboardProps {
  userRank: {
    position: number
    totalPlayers: number
    percentile: number
  }
  leaderboard: LeaderboardEntry[]
}

export function GameLeaderboard({ userRank, leaderboard }: GameLeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-4 w-4 text-yellow-500" />
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />
      case 3:
        return <Award className="h-4 w-4 text-amber-600" />
      default:
        return <span className="text-sm font-medium text-muted-foreground">#{rank}</span>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Leaderboard
          <Badge variant="secondary">
            Top {userRank.percentile}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center justify-between p-3 rounded-lg ${
                entry.name === 'You' ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankIcon(entry.rank)}
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={entry.name} />
                    <AvatarFallback>
                      {entry.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className={`font-medium ${
                    entry.name === 'You' ? 'text-primary' : ''
                  }`}>
                    {entry.name}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{entry.score.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">points</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="text-center text-sm text-muted-foreground">
            You&apos;re ranked #{userRank.position} out of {userRank.totalPlayers} players
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
