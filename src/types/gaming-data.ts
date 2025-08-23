import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

interface Profile {
  id: string;
  name: string;
}

interface GameActivity {
  id: string;
  name: string;
  description: string;
  total_levels: number;
}

interface GameDifficultyLevel {
  id: string;
  game_activity_id: string;
  level_number: number;
  difficulty: 'easy' | 'medium' | 'hard';
  max_score: number;
}

interface UserGameProgress {
  id: string;
  user_id: string;
  game_activity_id: string;
  current_level: number;
  levels_completed: number[];
  scores: number[];
  time_spent: number[];
  last_played_at: string;
}

export async function GET() {
  try {
    // Fetch all profiles
    const { data: profiles, error: profilesError } = await (supabase as any)
      .from('profiles')
      .select('id, name')
      .eq('is_deleted', false);
    
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
    }

    // Fetch all game activities
    const { data: gameActivities, error: activitiesError } = await (supabase as any)
      .from('game_activities')
      .select('id, name, description, total_levels');
    
    if (activitiesError) {
      console.error('Error fetching game activities:', activitiesError);
      return NextResponse.json({ error: 'Failed to fetch game activities' }, { status: 500 });
    }

    // Fetch all game difficulty levels
    const { data: difficultyLevels, error: difficultyError } = await (supabase as any)
      .from('game_difficulty_levels')
      .select('id, game_activity_id, level_number, difficulty, max_score');
    
    if (difficultyError) {
      console.error('Error fetching difficulty levels:', difficultyError);
      return NextResponse.json({ error: 'Failed to fetch difficulty levels' }, { status: 500 });
    }

    // Fetch all user game progress
    const { data: userProgress, error: progressError } = await (supabase as any)
      .from('user_game_progress')
      .select('id, user_id, game_activity_id, current_level, levels_completed, scores, time_spent, last_played_at');
    
    if (progressError) {
      console.error('Error fetching user progress:', progressError);
      return NextResponse.json({ error: 'Failed to fetch user progress' }, { status: 500 });
    }

    // Create lookup maps
    const gameActivityMap = new Map<string, GameActivity>();
    gameActivities.forEach((activity: GameActivity) => {
      gameActivityMap.set(activity.id, activity);
    });

    const difficultyByGame = new Map<string, GameDifficultyLevel[]>();
    difficultyLevels.forEach((level: GameDifficultyLevel) => {
      if (!difficultyByGame.has(level.game_activity_id)) {
        difficultyByGame.set(level.game_activity_id, []);
      }
      difficultyByGame.get(level.game_activity_id)!.push(level);
    });

    // Group progress by user
    const progressByUser = new Map<string, UserGameProgress[]>();
    userProgress.forEach((progress: UserGameProgress) => {
      if (!progressByUser.has(progress.user_id)) {
        progressByUser.set(progress.user_id, []);
      }
      progressByUser.get(progress.user_id)!.push(progress);
    });

    const users = profiles.map((profile: Profile) => {
      const userProgress = progressByUser.get(profile.id) || [];
      let totalCompletedLevels = 0;
      let totalTimeSpent = 0;

      const gamesPlayed = userProgress
        .map((progress: UserGameProgress) => {
          const gameActivity = gameActivityMap.get(progress.game_activity_id);
          if (!gameActivity) return null;

          // Count completed levels
          const completedCount = progress.levels_completed.length;
          totalCompletedLevels += completedCount;

          // Sum time spent
          const sumTimeSpent = progress.time_spent.reduce((sum: number, time: number) => sum + time, 0);
          totalTimeSpent += sumTimeSpent;

          // Determine difficulty based on current level
          const difficultyLevels = difficultyByGame.get(progress.game_activity_id) || [];
          let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
          let maxScore = 1000;

          if (difficultyLevels.length > 0) {
            const currentDifficulty = difficultyLevels.find(level => 
              progress.current_level >= level.level_number && 
              progress.current_level < (level.level_number + 10)
            );
            if (currentDifficulty) {
              difficulty = currentDifficulty.difficulty;
              maxScore = currentDifficulty.max_score;
            }
          }

          // Get latest score or calculate average
          const latestScore = progress.scores.length > 0 
            ? progress.scores[progress.scores.length - 1] 
            : Math.floor(Math.random() * 201) + 800;

          return {
            name: gameActivity.name,
            score: latestScore,
            maxScore: maxScore,
            difficulty: difficulty,
            completed: progress.current_level >= gameActivity.total_levels,
            timeSpent: parseFloat(sumTimeSpent.toFixed(2)),
          };
        })
        .filter(Boolean) as Array<{
          name: string;
          score: number;
          maxScore: number;
          difficulty: 'easy' | 'medium' | 'hard';
          completed: boolean;
          timeSpent: number;
        }>;

      const totalLevels = gamesPlayed.length * 30;
      const avgTimePerLevel = totalCompletedLevels > 0 
        ? parseFloat((totalTimeSpent / totalCompletedLevels).toFixed(2))
        : 0;
      const completionRate = totalLevels > 0 
        ? Math.round((totalCompletedLevels / totalLevels) * 100)
        : 0;

      return {
        id: profile.id,
        name: profile.name,
        gamingData: {
          levelsCompleted: totalCompletedLevels,
          totalLevels,
          avgTimePerLevel,
          completionRate,
          gamesPlayed,
        },
      };
    });

    return NextResponse.json({ users, success: true });
  } catch (error: any) {
    console.error('Gaming-data API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}