/**
 * Team Data Slice (Worker Dashboard)
 * 
 * Manages team management data including:
 * - Team statistics and metrics
 * - Learner data with filtering and pagination
 * - Team insights and risk analysis
 * - Course management data
 * - Team messages and communications
 */

import { StateCreator } from 'zustand';
import { useAPITrackingStore } from '../api-tracking-store';
import { clientPermissions } from '@/lib/auth-client';

// Types for team data
export interface TeamStats {
  totalLearners: number;
  averageSkillFit: number;
  atRiskPercentage: number;
  atRiskCount: number;
  weeklyActive: number;
  completionRate: number;
  averageProgress: number;
}

export interface Learner {
  id: string;
  name: string;
  email: string;
  track: string;
  skillFit: number;
  progress: number;
  lastActive: Date;
  riskStatus: string;
  coach: string;
  joinDate: Date;
}

export interface LearnerData {
  data: Learner[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  filters: Record<string, any>;
}

export interface TeamInsights {
  riskAnalysis: any[];
  performanceTrends: any[];
  interventionQueue: any[];
}

export interface TeamSlice {
  // State
  teamStats: TeamStats | null;
  learners: LearnerData | null;
  teamInsights: TeamInsights | null;
  courses: any[];
  messages: any[];
  
  // Loading states
  isLoadingTeamStats: boolean;
  isLoadingLearners: boolean;
  isLoadingTeamInsights: boolean;
  isLoadingCourses: boolean;
  isLoadingMessages: boolean;
  
  // Error states
  teamStatsError: string | null;
  learnersError: string | null;
  teamInsightsError: string | null;
  coursesError: string | null;
  messagesError: string | null;
  
  // Last updated timestamps
  lastUpdated: {
    teamStats: number | null;
    learners: number | null;
    teamInsights: number | null;
    courses: number | null;
    messages: number | null;
  };

  // Current filters for learners
  currentFilters: Record<string, any>;

  // Actions
  fetchTeamStats: () => Promise<void>;
  fetchLearners: (filters?: Record<string, any>) => Promise<void>;
  fetchTeamInsights: () => Promise<void>;
  fetchCourses: () => Promise<void>;
  fetchMessages: () => Promise<void>;
  fetchAllTeamData: (filters?: Record<string, any>) => Promise<void>;
  
  // Filter management
  updateLearnerFilters: (filters: Record<string, any>) => void;
  clearLearnerFilters: () => void;
  
  // Invalidation
  invalidateTeamStats: () => void;
  invalidateLearners: () => void;
  invalidateTeamInsights: () => void;
  invalidateCourses: () => void;
  invalidateMessages: () => void;
  invalidateAllTeamData: () => void;
  
  // Selectors
  getAtRiskLearners: () => Learner[];
  getTopPerformers: () => Learner[];
  getTeamPerformanceMetrics: () => { improving: number; declining: number; stable: number };
  isTeamDataStale: () => boolean;
}

// Helper function to check if data is stale (team data refreshes every 3 minutes)
const isDataStale = (timestamp: number | null, staleTimeMs = 3 * 60 * 1000): boolean => {
  if (!timestamp) return true;
  return Date.now() - timestamp > staleTimeMs;
};

export const createTeamSlice: StateCreator<TeamSlice> = (set, get) => ({
  // Initial state
  teamStats: null,
  learners: null,
  teamInsights: null,
  courses: [],
  messages: [],
  
  // Loading states
  isLoadingTeamStats: false,
  isLoadingLearners: false,
  isLoadingTeamInsights: false,
  isLoadingCourses: false,
  isLoadingMessages: false,
  
  // Error states
  teamStatsError: null,
  learnersError: null,
  teamInsightsError: null,
  coursesError: null,
  messagesError: null,
  
  // Last updated timestamps
  lastUpdated: {
    teamStats: null,
    learners: null,
    teamInsights: null,
    courses: null,
    messages: null,
  },

  // Current filters
  currentFilters: {},

  // Fetch team stats
  fetchTeamStats: async () => {
    const state = get();
    
    if (state.isLoadingTeamStats || !isDataStale(state.lastUpdated.teamStats)) {
      return;
    }

    const trackingStore = useAPITrackingStore.getState();
    const callId = trackingStore.startCall({
      endpoint: '/api/team/stats',
      method: 'GET',
      feature: 'worker',
    });

    set({ isLoadingTeamStats: true, teamStatsError: null });

    try {
      const canView = clientPermissions.checkUserPermission('team', 'view');
      if (!canView) throw new Error('Forbidden');

      const { getTeamStats } = await import('@/lib/mock-data');
      const teamStats = await getTeamStats();

      set({
        teamStats,
        isLoadingTeamStats: false,
        teamStatsError: null,
        lastUpdated: { ...state.lastUpdated, teamStats: Date.now() },
      });

      trackingStore.completeCall(callId, true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch team stats';
      set({
        isLoadingTeamStats: false,
        teamStatsError: errorMessage,
      });
      trackingStore.completeCall(callId, false, errorMessage);
    }
  },

  // Fetch learners with optional filters
  fetchLearners: async (filters = {}) => {
    const state = get();
    
    // Check if filters changed or data is stale
    const filtersChanged = JSON.stringify(filters) !== JSON.stringify(state.currentFilters);
    const dataStale = isDataStale(state.lastUpdated.learners);
    
    if (state.isLoadingLearners || (!filtersChanged && !dataStale)) {
      return;
    }

    const trackingStore = useAPITrackingStore.getState();
    const callId = trackingStore.startCall({
      endpoint: '/api/team/learners',
      method: 'GET',
      feature: 'worker',
    });

    set({ 
      isLoadingLearners: true, 
      learnersError: null,
      currentFilters: filters,
    });

    try {
      const canView = clientPermissions.checkUserPermission('team', 'view');
      if (!canView) throw new Error('Forbidden');

      const { getLearners } = await import('@/lib/mock-data');
      const learnersResponse = await getLearners(filters);
      
      const learners: LearnerData = {
        data: learnersResponse.data,
        pagination: {
          total: learnersResponse.total,
          page: learnersResponse.page,
          limit: 25,
        },
        filters,
      };

      set({
        learners,
        isLoadingLearners: false,
        learnersError: null,
        lastUpdated: { ...state.lastUpdated, learners: Date.now() },
      });

      trackingStore.completeCall(callId, true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch learners';
      set({
        isLoadingLearners: false,
        learnersError: errorMessage,
      });
      trackingStore.completeCall(callId, false, errorMessage);
    }
  },

  // Fetch team insights
  fetchTeamInsights: async () => {
    const state = get();
    
    if (state.isLoadingTeamInsights || !isDataStale(state.lastUpdated.teamInsights)) {
      return;
    }

    const trackingStore = useAPITrackingStore.getState();
    const callId = trackingStore.startCall({
      endpoint: '/api/team/insights',
      method: 'GET',
      feature: 'worker',
    });

    set({ isLoadingTeamInsights: true, teamInsightsError: null });

    try {
      const canView = clientPermissions.checkUserPermission('team', 'analytics');
      if (!canView) throw new Error('Forbidden');

      // Simulated team insights data
      const teamInsights: TeamInsights = {
        riskAnalysis: [
          { category: 'High Risk', count: 5, trend: '+2' },
          { category: 'Medium Risk', count: 12, trend: '-1' },
          { category: 'Low Risk', count: 35, trend: '+3' },
        ],
        performanceTrends: [
          { period: 'Week 1', average: 75 },
          { period: 'Week 2', average: 78 },
          { period: 'Week 3', average: 82 },
          { period: 'Week 4', average: 80 },
        ],
        interventionQueue: [
          { learnerId: 'learner-1', priority: 'high', type: 'skill-gap' },
          { learnerId: 'learner-2', priority: 'medium', type: 'engagement' },
        ],
      };

      set({
        teamInsights,
        isLoadingTeamInsights: false,
        teamInsightsError: null,
        lastUpdated: { ...state.lastUpdated, teamInsights: Date.now() },
      });

      trackingStore.completeCall(callId, true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch team insights';
      set({
        isLoadingTeamInsights: false,
        teamInsightsError: errorMessage,
      });
      trackingStore.completeCall(callId, false, errorMessage);
    }
  },

  // Fetch courses
  fetchCourses: async () => {
    const state = get();
    
    if (state.isLoadingCourses || !isDataStale(state.lastUpdated.courses)) {
      return;
    }

    const trackingStore = useAPITrackingStore.getState();
    const callId = trackingStore.startCall({
      endpoint: '/api/team/courses',
      method: 'GET',
      feature: 'worker',
    });

    set({ isLoadingCourses: true, coursesError: null });

    try {
      const canView = clientPermissions.checkUserPermission('team', 'courses');
      if (!canView) throw new Error('Forbidden');

      // Simulated courses data
      const courses = [
        { id: 'course-1', title: 'Advanced React Patterns', enrolled: 25, completed: 18 },
        { id: 'course-2', title: 'TypeScript Fundamentals', enrolled: 30, completed: 22 },
        { id: 'course-3', title: 'System Design', enrolled: 15, completed: 8 },
      ];

      set({
        courses,
        isLoadingCourses: false,
        coursesError: null,
        lastUpdated: { ...state.lastUpdated, courses: Date.now() },
      });

      trackingStore.completeCall(callId, true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch courses';
      set({
        isLoadingCourses: false,
        coursesError: errorMessage,
      });
      trackingStore.completeCall(callId, false, errorMessage);
    }
  },

  // Fetch messages
  fetchMessages: async () => {
    const state = get();
    
    if (state.isLoadingMessages || !isDataStale(state.lastUpdated.messages)) {
      return;
    }

    const trackingStore = useAPITrackingStore.getState();
    const callId = trackingStore.startCall({
      endpoint: '/api/team/messages',
      method: 'GET',
      feature: 'worker',
    });

    set({ isLoadingMessages: true, messagesError: null });

    try {
      const canView = clientPermissions.checkUserPermission('team', 'messages');
      if (!canView) throw new Error('Forbidden');

      // Simulated messages data
      const messages = [
        { id: 'msg-1', from: 'System', content: 'New learner joined your team', timestamp: Date.now() },
        { id: 'msg-2', from: 'Admin', content: 'Team performance review scheduled', timestamp: Date.now() - 3600000 },
      ];

      set({
        messages,
        isLoadingMessages: false,
        messagesError: null,
        lastUpdated: { ...state.lastUpdated, messages: Date.now() },
      });

      trackingStore.completeCall(callId, true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch messages';
      set({
        isLoadingMessages: false,
        messagesError: errorMessage,
      });
      trackingStore.completeCall(callId, false, errorMessage);
    }
  },

  // Fetch all team data
  fetchAllTeamData: async (filters = {}) => {
    const actions = get();
    await Promise.allSettled([
      actions.fetchTeamStats(),
      actions.fetchLearners(filters),
      actions.fetchTeamInsights(),
      actions.fetchCourses(),
      actions.fetchMessages(),
    ]);
  },

  // Filter management
  updateLearnerFilters: (filters) => {
    set({ currentFilters: filters });
    // Automatically refetch with new filters
    get().fetchLearners(filters);
  },

  clearLearnerFilters: () => {
    set({ currentFilters: {} });
    get().fetchLearners({});
  },

  // Invalidation methods
  invalidateTeamStats: () => {
    set((state) => ({
      lastUpdated: { ...state.lastUpdated, teamStats: null }
    }));
  },

  invalidateLearners: () => {
    set((state) => ({
      lastUpdated: { ...state.lastUpdated, learners: null }
    }));
  },

  invalidateTeamInsights: () => {
    set((state) => ({
      lastUpdated: { ...state.lastUpdated, teamInsights: null }
    }));
  },

  invalidateCourses: () => {
    set((state) => ({
      lastUpdated: { ...state.lastUpdated, courses: null }
    }));
  },

  invalidateMessages: () => {
    set((state) => ({
      lastUpdated: { ...state.lastUpdated, messages: null }
    }));
  },

  invalidateAllTeamData: () => {
    set((state) => ({
      lastUpdated: {
        teamStats: null,
        learners: null,
        teamInsights: null,
        courses: null,
        messages: null,
      }
    }));
  },

  // Selectors
  getAtRiskLearners: () => {
    const state = get();
    if (!state.learners) return [];
    return state.learners.data.filter(learner => learner.riskStatus === 'red');
  },

  getTopPerformers: () => {
    const state = get();
    if (!state.learners) return [];
    return state.learners.data
      .filter(learner => learner.skillFit >= 80)
      .sort((a, b) => b.skillFit - a.skillFit)
      .slice(0, 5);
  },

  getTeamPerformanceMetrics: () => {
    const state = get();
    if (!state.learners) return { improving: 0, declining: 0, stable: 0 };
    
    const learners = state.learners.data;
    const improving = learners.filter(l => l.progress > 75).length;
    const declining = learners.filter(l => l.riskStatus === 'red').length;
    const stable = learners.length - improving - declining;
    
    return { improving, declining, stable };
  },

  isTeamDataStale: () => {
    const state = get();
    return Object.values(state.lastUpdated).some(timestamp => isDataStale(timestamp));
  },
}); 