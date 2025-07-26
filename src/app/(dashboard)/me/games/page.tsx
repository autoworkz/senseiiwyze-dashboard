import { GameStatsOverview } from '@/components/me/GameStatsOverview'
import { GameLeaderboard } from '@/components/me/GameLeaderboard'
import { GameAchievements } from '@/components/me/GameAchievements'
import { getMyGameStats } from '@/lib/api/games'

export default async function GamesPage() {
  const gameStats = await getMyGameStats()
  
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Game Statistics</h1>
        <p className="text-muted-foreground mt-2">
          Track your performance in learning games and compete with peers
        </p>
      </div>
      
      {/* Game stats overview */}
      <GameStatsOverview stats={gameStats.overview} />
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <GameLeaderboard 
          userRank={gameStats.userRank}
          leaderboard={gameStats.leaderboard}
        />
        
        {/* Achievements */}
        <GameAchievements achievements={gameStats.achievements} />
      </div>
      
      {/* Recent games */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Games</h3>
        <div className="space-y-4">
          {gameStats.recentGames.map((game, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-4">
                <div className="text-2xl">{game.icon}</div>
                <div>
                  <div className="font-medium">{game.name}</div>
                  <div className="text-sm text-muted-foreground">{game.category}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{game.score} pts</div>
                <div className="text-sm text-muted-foreground">{game.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Performance metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-primary">{gameStats.metrics.totalGames}</div>
          <div className="text-sm text-muted-foreground">Games Played</div>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{gameStats.metrics.averageScore}</div>
          <div className="text-sm text-muted-foreground">Avg Score</div>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{gameStats.metrics.bestStreak}</div>
          <div className="text-sm text-muted-foreground">Best Streak</div>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{gameStats.metrics.timeSpent}</div>
          <div className="text-sm text-muted-foreground">Hours Played</div>
        </div>
      </div>
    </div>
  )
}
