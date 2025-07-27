/**
 * Personal Data Slice (CEO Dashboard)
 * 
 * Manages personal development data including:
 * - User metrics (skill fit, progress, personality)
 * - Personal goals and achievements
 * - Game statistics and leaderboard
 * - Learning progress and modules
 * - Interventions and recommendations
 */

import { StateCreator } from 'zustand';
import { useAPITrackingStore } from '../api-tracking-store';
import { clientPermissions } from '@/lib/auth-client';

// Types for personal data
export interface PersonalMetrics {
  skillFit: number;
  skillFitTrend: number;
  visionAlignment: number;
  gameIndex: number;
  gritScore: number;
  overallProgress: number;
  personality: Record<string, number>;
}

export interface PersonalGoals {
  visionGoals: any[];
  activeGoals: any[];
  achievements: any[];
  stats: Record<string, number>;
}

export interface GameStats {
  overview: Record<string, number>;
  userRank: Record<string, number>;
  leaderboard: any[];
  achievements: any[];
  recentGames: any[];
  metrics: Record<string, number>;
}

export interface LearningProgress {
  progress: Record<string, any>;
  modules: any[];
  recommendations: any[];
  currentPath: any[];
}

export interface PersonalSlice {
  // State
  metrics: PersonalMetrics | null;
  goals: PersonalGoals | null;
  gameStats: GameStats | null;
  learning: LearningProgress | null;
  interventions: any[];
  
  // Loading states
  isLoadingMetrics: boolean;
  isLoadingGoals: boolean;
  isLoadingGameStats: boolean;
  isLoadingLearning: boolean;
  isLoadingInterventions: boolean;
  
  // Error states
  metricsError: string | null;
  goalsError: string | null;
  gameStatsError: string | null;
  learningError: string | null;
  interventionsError: string | null;
  
  // Last updated timestamps
  lastUpdated: {
    metrics: number | null;
    goals: number | null;
    gameStats: number | null;
    learning: number | null;
    interventions: number | null;
  };

  // Actions
  fetchMetrics: () => Promise<void>;
  fetchGoals: () => Promise<void>;
  fetchGameStats: () => Promise<void>;
  fetchLearning: () => Promise<void>;
  fetchInterventions: () => Promise<void>;
  fetchAllPersonalData: () => Promise<void>;
  
  // Invalidation
  invalidateMetrics: () => void;
  invalidateGoals: () => void;
  invalidateGameStats: () => void;
  invalidateLearning: () => void;
  invalidateInterventions: () => void;
  invalidateAllPersonalData: () => void;
  
  // Selectors
  getSkillFitProgress: () => { current: number; trend: number; status: 'improving' | 'declining' | 'stable' };
  getActiveInterventions: () => any[];
  getRecentAchievements: () => any[];
  isPersonalDataStale: () => boolean;
}

// Helper function to check if data is stale (older than 5 minutes)
const isDataStale = (timestamp: number | null, staleTimeMs = 5 * 60 * 1000): boolean => {
  if (!timestamp) return true;
  return Date.now() - timestamp > staleTimeMs;
};

export const createPersonalSlice: StateCreator<PersonalSlice> = (set, get) => ({
  // Initial state
  metrics: null,
  goals: null,
  gameStats: null,
  learning: null,
  interventions: [],
  
  // Loading states
  isLoadingMetrics: false,
  isLoadingGoals: false,
  isLoadingGameStats: false,
  isLoadingLearning: false,
  isLoadingInterventions: false,
  
  // Error states
  metricsError: null,
  goalsError: null,
  gameStatsError: null,
  learningError: null,
  interventionsError: null,
  
  // Last updated timestamps
  lastUpdated: {
    metrics: null,
    goals: null,
    gameStats: null,
    learning: null,
    interventions: null,
  },

  // Fetch metrics
  fetchMetrics: async () => {
    const state = get();
    
    // Skip if already loading or data is fresh
    if (state.isLoadingMetrics || !isDataStale(state.lastUpdated.metrics)) {
      return;
    }

    const trackingStore = useAPITrackingStore.getState();
    const callId = trackingStore.startCall({
      endpoint: '/api/personal/metrics',
      method: 'GET',
      feature: 'ceo',
    });

    set({ isLoadingMetrics: true, metricsError: null });

    try {
      // Check permissions
      const canView = clientPermissions.checkUserPermission('personal', 'view');
      if (!canView) throw new Error('Forbidden');

      // Import and use mock data (would be real API call)
      const { getMyMetrics } = await import('@/lib/mock-data');
      const metrics = await getMyMetrics();

      set({
        metrics,
        isLoadingMetrics: false,
        metricsError: null,
        lastUpdated: { ...state.lastUpdated, metrics: Date.now() },
      });

      trackingStore.completeCall(callId, true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch metrics';
      set({
        isLoadingMetrics: false,
        metricsError: errorMessage,
      });
      trackingStore.completeCall(callId, false, errorMessage);
    }
  },

  // Fetch goals
  fetchGoals: async () => {
    const state = get();
    
    if (state.isLoadingGoals || !isDataStale(state.lastUpdated.goals)) {
      return;
    }

    const trackingStore = useAPITrackingStore.getState();
    const callId = trackingStore.startCall({
      endpoint: '/api/personal/goals',
      method: 'GET',
      feature: 'ceo',
    });

    set({ isLoadingGoals: true, goalsError: null });

    try {
      const canView = clientPermissions.checkUserPermission('personal', 'goals');
      if (!canView) throw new Error('Forbidden');

      const { getMyGoals } = await import('@/lib/mock-data');
      const goals = await getMyGoals();

      set({
        goals,
        isLoadingGoals: false,
        goalsError: null,
        lastUpdated: { ...state.lastUpdated, goals: Date.now() },
      });

      trackingStore.completeCall(callId, true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch goals';
      set({
        isLoadingGoals: false,
        goalsError: errorMessage,
      });
      trackingStore.completeCall(callId, false, errorMessage);
    }
  },

  // Fetch game stats
  fetchGameStats: async () => {
    const state = get();
    
    if (state.isLoadingGameStats || !isDataStale(state.lastUpdated.gameStats)) {
      return;
    }

    const trackingStore = useAPITrackingStore.getState();
    const callId = trackingStore.startCall({
      endpoint: '/api/personal/games',
      method: 'GET',
      feature: 'ceo',
    });

    set({ isLoadingGameStats: true, gameStatsError: null });

    try {
      const canView = clientPermissions.checkUserPermission('personal', 'games');
      if (!canView) throw new Error('Forbidden');

      const { getMyGameStats } = await import('@/lib/mock-data');
      const gameStats = await getMyGameStats();

      set({
        gameStats,
        isLoadingGameStats: false,
        gameStatsError: null,
        lastUpdated: { ...state.lastUpdated, gameStats: Date.now() },
      });

      trackingStore.completeCall(callId, true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch game stats';
      set({
        isLoadingGameStats: false,
        gameStatsError: errorMessage,
      });
      trackingStore.completeCall(callId, false, errorMessage);
    }
  },

  // Fetch learning progress
  fetchLearning: async () => {
    const state = get();
    
    if (state.isLoadingLearning || !isDataStale(state.lastUpdated.learning)) {
      return;
    }

    const trackingStore = useAPITrackingStore.getState();
    const callId = trackingStore.startCall({
      endpoint: '/api/personal/learning',
      method: 'GET',
      feature: 'ceo',
    });

    set({ isLoadingLearning: true, learningError: null });

    try {
      const canView = clientPermissions.checkUserPermission('personal', 'learning');
      if (!canView) throw new Error('Forbidden');

      const { mockData } = await import('@/lib/mock-data');
      const learning = mockData.myLearningData;

      set({
        learning,
        isLoadingLearning: false,
        learningError: null,
        lastUpdated: { ...state.lastUpdated, learning: Date.now() },
      });

      trackingStore.completeCall(callId, true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch learning data';
      set({
        isLoadingLearning: false,
        learningError: errorMessage,
      });
      trackingStore.completeCall(callId, false, errorMessage);
    }
  },

  // Fetch interventions
  fetchInterventions: async () => {
    const state = get();
    
    if (state.isLoadingInterventions || !isDataStale(state.lastUpdated.interventions)) {
      return;
    }

    const trackingStore = useAPITrackingStore.getState();
    const callId = trackingStore.startCall({
      endpoint: '/api/personal/interventions',
      method: 'GET',
      feature: 'ceo',
    });

    set({ isLoadingInterventions: true, interventionsError: null });

    try {
      const canView = clientPermissions.checkUserPermission('personal', 'view');
      if (!canView) throw new Error('Forbidden');

      const { mockData } = await import('@/lib/mock-data');
      const interventions = mockData.myMetrics.interventions;

      set({
        interventions,
        isLoadingInterventions: false,
        interventionsError: null,
        lastUpdated: { ...state.lastUpdated, interventions: Date.now() },
      });

      trackingStore.completeCall(callId, true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch interventions';
      set({
        isLoadingInterventions: false,
        interventionsError: errorMessage,
      });
      trackingStore.completeCall(callId, false, errorMessage);
    }
  },

  // Fetch all personal data
  fetchAllPersonalData: async () => {
    const actions = get();
    await Promise.allSettled([
      actions.fetchMetrics(),
      actions.fetchGoals(),
      actions.fetchGameStats(),
      actions.fetchLearning(),
      actions.fetchInterventions(),
    ]);
  },

  // Invalidation methods
  invalidateMetrics: () => {
    set((state) => ({
      lastUpdated: { ...state.lastUpdated, metrics: null }
    }));
  },

  invalidateGoals: () => {
    set((state) => ({
      lastUpdated: { ...state.lastUpdated, goals: null }
    }));
  },

  invalidateGameStats: () => {
    set((state) => ({
      lastUpdated: { ...state.lastUpdated, gameStats: null }
    }));
  },

  invalidateLearning: () => {
    set((state) => ({
      lastUpdated: { ...state.lastUpdated, learning: null }
    }));
  },

  invalidateInterventions: () => {
    set((state) => ({
      lastUpdated: { ...state.lastUpdated, interventions: null }
    }));
  },

  invalidateAllPersonalData: () => {
    set((state) => ({
      lastUpdated: {
        metrics: null,
        goals: null,
        gameStats: null,
        learning: null,
        interventions: null,
      }
    }));
  },

  // Selectors
  getSkillFitProgress: () => {
    const state = get();
    if (!state.metrics) return { current: 0, trend: 0, status: 'stable' as const };
    
    const { skillFit, skillFitTrend } = state.metrics;
    const status = skillFitTrend > 2 ? 'improving' : skillFitTrend < -2 ? 'declining' : 'stable';
    
    return { current: skillFit, trend: skillFitTrend, status };
  },

  getActiveInterventions: () => {
    const state = get();
    return state.interventions.filter((intervention: any) => intervention.priority === 'high');
  },

  getRecentAchievements: () => {
    const state = get();
    if (!state.goals) return [];
    return state.goals.achievements.slice(0, 3); // Last 3 achievements
  },

  isPersonalDataStale: () => {
    const state = get();
    return Object.values(state.lastUpdated).some(timestamp => isDataStale(timestamp));
  },
}); 