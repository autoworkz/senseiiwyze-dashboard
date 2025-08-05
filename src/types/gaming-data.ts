export interface GamingData {
  levelsCompleted: number;
  totalLevels: number;
  avgTimePerLevel: number;
  gamesPlayed: Array<{
    name: string;
    score: number;
    maxScore: number;
    difficulty: 'easy' | 'medium' | 'hard';
    completed: boolean;
    timeSpent?: number;
  }>;
  completionRate: number;
}

export interface UserGamingData {
  id: string;
  name: string;
  gamingData: GamingData;
}