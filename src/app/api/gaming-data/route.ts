import { supabase } from '@/lib/supabase';
import { NextResponse, type NextRequest } from 'next/server';
import { withAuth } from '@/lib/api/with-auth'

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

export const GET = withAuth(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  try {
    let profilesQuery = (supabase as any)
      .from('profiles')
      .select('id, name')
      .eq('is_deleted', false);

    if (userId) {
      profilesQuery = profilesQuery.eq('id', userId);
    }

    // Fetch profiles
    const { data: profiles, error: profilesError } = await profilesQuery;

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

    let gameInfoQuery = (supabase as any)
      .from('game_info')
      .select(`
    id,
    profile_id,
    game_id,
    levels_completed,
    durations,
    total_levels,
    avg_time_per_level
  `);

    if (userId) {
      gameInfoQuery = gameInfoQuery.eq('profile_id', userId);
    }

    const { data: gameInfo, error: gameInfoError } = await gameInfoQuery;

    if (gameInfoError) {
      console.error('Error fetching game info:', gameInfoError);
      return NextResponse.json({ error: 'Failed to fetch game info' }, { status: 500 });
    }

    // Calculate total levels and average time per level
    const gameInfoWithCalculatedFields = (gameInfo || []).map((info: GameInfo) => {
      const totalLevels = info.levels_completed?.length || 0;
      const avgTimePerLevel = info.durations?.length
        ? Math.round(info.durations.reduce((sum: number, time: number) => sum + time, 0) / info.durations.length)
        : 0;
      return { ...info, total_levels: totalLevels, avg_time_per_level: avgTimePerLevel };
    });

    // Build response
    return NextResponse.json({
      profiles: profiles as Profile[],
      activities: activities as Activity[],
      gameTasks: gameTasks as GameTask[],
      gameInfo: gameInfoWithCalculatedFields as GameInfo[],
    });
  } catch (error) {
    console.error('Error fetching gaming data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
