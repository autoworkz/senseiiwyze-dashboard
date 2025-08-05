import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

interface Profile {
  id: string;
  name: string;
}

interface Activity {
  id: string;
  name: string;
}

interface GameTask {
  id: string;
  activity_id: string;
  max_score: number;
  difficulty_level: string;
  order: number;
}

interface GameInfo {
  id: string;
  profile_id: string;
  game_id: string;
  levels_completed: boolean[];
  durations: number[];
  total_levels?: number;
  avg_time_per_level?: number;
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

    // Fetch all activities
    const { data: activities, error: activitiesError } = await (supabase as any)
      .from('activities')
      .select('id, name');
    
    if (activitiesError) {
      console.error('Error fetching activities:', activitiesError);
      return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
    }

    // Fetch all game tasks
    const { data: gameTasks, error: tasksError } = await (supabase as any)
      .from('game_tasks')
      .select('id, activity_id, max_score, difficulty_level, "order"');
    
    if (tasksError) {
      console.error('Error fetching game tasks:', tasksError);
      return NextResponse.json({ error: 'Failed to fetch game tasks' }, { status: 500 });
    }

    // Fetch all game_info (removed avg_time_per_level as it doesn't exist)
    const { data: gameInfo, error: infoError } = await (supabase as any)
      .from('game_info')
      .select('id, profile_id, game_id, levels_completed, durations, total_levels');
    
    if (infoError) {
      console.error('Error fetching game info:', infoError);
      return NextResponse.json({ error: 'Failed to fetch game info' }, { status: 500 });
    }

    // Create lookup maps
    const activityMap = new Map<string, string>();
    activities.forEach((activity: Activity) => {
      activityMap.set(activity.id, activity.name);
    });

    const tasksByActivity: Record<string, GameTask[]> = {};
    gameTasks.forEach((task: GameTask) => {
      if (!tasksByActivity[task.activity_id]) {
        tasksByActivity[task.activity_id] = [];
      }
      tasksByActivity[task.activity_id].push(task);
    });

    // Sort tasks for each activity by order
    Object.values(tasksByActivity).forEach(tasks => {
      tasks.sort((a, b) => a.order - b.order);
    });

    // Group game info by user
    const gamesByUser: Record<string, GameInfo[]> = {};
    gameInfo.forEach((info: GameInfo) => {
      if (!gamesByUser[info.profile_id]) {
        gamesByUser[info.profile_id] = [];
      }
      gamesByUser[info.profile_id].push(info);
    });

    const users = profiles.map((profile: Profile) => {
      const infos = gamesByUser[profile.id] || [];
      let totalCompletedLevels = 0;
      let totalDurationsSec = 0;

      const gamesPlayed = infos
        .map((info: GameInfo) => {
          const activityName = activityMap.get(info.game_id);
          if (!activityName) return null; // Skip unknown games

          // Count completed levels
          const completedCount = info.levels_completed.filter(Boolean).length;
          totalCompletedLevels += completedCount;

          // Sum durations
          const sumDurations = info.durations.reduce((sum: number, d: number) => sum + d, 0);
          totalDurationsSec += sumDurations;

          // Determine task level index
          const levelIndex = completedCount <= 9 ? 0 : completedCount <= 19 ? 1 : 2;
          const tasks = tasksByActivity[info.game_id] || [];
          const task = tasks[levelIndex];

          // Calculate time spent in minutes
          const timeSpentMin = parseFloat((sumDurations / 60).toFixed(2));

          return {
            name: activityName,
            score: Math.floor(Math.random() * 201) + 800, // Random between 800-1000
            maxScore: task?.max_score ?? 1000,
            difficulty: (task?.difficulty_level as 'easy' | 'medium' | 'hard') || 'medium',
            completed: completedCount === info.levels_completed.length,
            timeSpent: timeSpentMin,
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

      const gameCount = gamesPlayed.length;
      const totalLevels = gameCount * 30;
      const avgTimePerLevel =
        totalCompletedLevels > 0
          ? parseFloat(((totalDurationsSec / 60) / totalCompletedLevels).toFixed(2))
          : 0;
      const completionRate = totalLevels
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
