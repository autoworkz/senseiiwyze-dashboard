/**
 * Main Data Store - Zustand Best Practices Implementation
 * 
 * Follows official Zustand patterns:
 * - Async actions directly in store 
 * - Persist middleware with partialize
 * - Slice pattern for modular state
 * - Built-in staleness checking
 * - Proper TypeScript types
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

// ===== TYPES =====
interface PersonalData {
  metrics: {
    skillFit: number;
    skillFitTrend: number;
    visionAlignment: number;
    gameIndex: number;
    gritScore: number;
    overallProgress: number;
    personality: Record<string, number>;
  } | null;
  goals: {
    visionGoals: any[];
    activeGoals: any[];
    achievements: any[];
    stats: Record<string, number>;
  } | null;
  gameStats: {
    overview: Record<string, number>;
    userRank: Record<string, number>;
    leaderboard: any[];
    achievements: any[];
    recentGames: any[];
    metrics: Record<string, number>;
  } | null;
  learning: {
    progress: Record<string, any>;
    modules: any[];
    recommendations: any[];
    currentPath: any[];
  } | null;
  interventions: any[];
}

interface TeamData {
  stats: {
    totalLearners: number;
    averageSkillFit: number;
    atRiskPercentage: number;
    atRiskCount: number;
    weeklyActive: number;
    completionRate: number;
    averageProgress: number;
  } | null;
  learners: {
    data: any[];
    pagination: { total: number; page: number; limit: number };
    filters: Record<string, any>;
  } | null;
  insights: {
    riskAnalysis: any[];
    performanceTrends: any[];
    interventionQueue: any[];
  } | null;
  courses: any[];
  messages: any[];
}

interface OrganizationData {
  kpis: Record<string, any> | null;
  insights: any[] | null;
  reports: any[] | null;
  strategy: any[] | null;
  readinessScore: number | null;
  readinessMetrics: any | null;
  readinessBreakdown: any | null;
}

// ===== TIMESTAMP TRACKING =====
interface DataTimestamps {
  personal: {
    metrics: number | null;
    goals: number | null;
    gameStats: number | null;
    learning: number | null;
    interventions: number | null;
  };
  team: {
    stats: number | null;
    learners: number | null;
    insights: number | null;
    courses: number | null;
    messages: number | null;
  };
  organization: {
    kpis: number | null;
    insights: number | null;
    reports: number | null;
    strategy: number | null;
    readinessScore: number | null;
    readinessMetrics: number | null;
    readinessBreakdown: number | null;
  };
}

// ===== LOADING STATES =====
interface LoadingStates {
  personal: {
    metrics: boolean;
    goals: boolean;
    gameStats: boolean;
    learning: boolean;
    interventions: boolean;
  };
  team: {
    stats: boolean;
    learners: boolean;
    insights: boolean;
    courses: boolean;
    messages: boolean;
  };
  organization: {
    kpis: boolean;
    insights: boolean;
    reports: boolean;
    strategy: boolean;
    readinessScore: boolean;
    readinessMetrics: boolean;
    readinessBreakdown: boolean;
  };
}

// ===== COMPLETE STORE TYPE =====
interface DataStore {
  // State
  personal: PersonalData;
  team: TeamData;
  organization: OrganizationData;
  timestamps: DataTimestamps;
  loading: LoadingStates;
  errors: Record<string, string | null>;

  // Personal Actions (CEO Dashboard)
  fetchPersonalMetrics: () => Promise<void>;
  fetchPersonalGoals: () => Promise<void>;
  fetchPersonalGameStats: () => Promise<void>;
  fetchPersonalLearning: () => Promise<void>;
  fetchPersonalInterventions: () => Promise<void>;
  fetchAllPersonalData: () => Promise<void>;

  // Team Actions (Worker Dashboard)
  fetchTeamStats: () => Promise<void>;
  fetchTeamLearners: (filters?: Record<string, any>) => Promise<void>;
  fetchTeamInsights: () => Promise<void>;
  fetchTeamCourses: () => Promise<void>;
  fetchTeamMessages: () => Promise<void>;
  fetchAllTeamData: (filters?: Record<string, any>) => Promise<void>;

  // Organization Actions (Frontliner Dashboard)
  fetchOrganizationKPIs: () => Promise<void>;
  fetchOrganizationInsights: () => Promise<void>;
  fetchOrganizationReports: () => Promise<void>;
  fetchOrganizationStrategy: () => Promise<void>;
  fetchAllOrganizationData: () => Promise<void>;

  // Invalidation Actions
  invalidatePersonalData: (keys?: string[]) => void;
  invalidateTeamData: (keys?: string[]) => void;
  invalidateOrganizationData: (keys?: string[]) => void;
  invalidateAllData: () => void;

  // Utility Actions
  isDataStale: (category: 'personal' | 'team' | 'organization', key: string, staleTimeMs?: number) => boolean;
  getSkillFitProgress: () => { current: number; trend: number; status: 'improving' | 'declining' | 'stable' };
  getAtRiskLearners: () => any[];
}

// ===== HELPER FUNCTIONS =====
const isStale = (timestamp: number | null, staleTimeMs: number): boolean => {
  if (!timestamp) return true;
  return Date.now() - timestamp > staleTimeMs;
};

// Default stale times (in milliseconds)
const STALE_TIMES = {
  personal: 5 * 60 * 1000,  // 5 minutes - personal data changes frequently
  team: 3 * 60 * 1000,     // 3 minutes - team data is dynamic
  organization: 10 * 60 * 1000, // 10 minutes - org data changes less often
};

// ===== STORE IMPLEMENTATION =====
export const useDataStore = create<DataStore>()(
  devtools(
    persist(
      (set, get) => ({
          // Initial state
  personal: {
    metrics: null,
    goals: null,
    gameStats: null,
    learning: null,
    interventions: [],
  },
  team: {
    stats: null,
    learners: null,
    insights: null,
    courses: [],
    messages: [],
  },
  organization: {
    kpis: null,
    insights: null,
    reports: null,
    strategy: null,
    readinessScore: null,
    readinessMetrics: null,
    readinessBreakdown: null,
  },
        timestamps: {
          personal: {
            metrics: null,
            goals: null,
            gameStats: null,
            learning: null,
            interventions: null,
          },
          team: {
            stats: null,
            learners: null,
            insights: null,
            courses: null,
            messages: null,
          },
          organization: {
            kpis: null,
            insights: null,
            reports: null,
            strategy: null,
            readinessScore: null,
            readinessMetrics: null,
            readinessBreakdown: null,
          },
        },
        loading: {
          personal: {
            metrics: false,
            goals: false,
            gameStats: false,
            learning: false,
            interventions: false,
          },
          team: {
            stats: false,
            learners: false,
            insights: false,
            courses: false,
            messages: false,
          },
          organization: {
            kpis: false,
            insights: false,
            reports: false,
            strategy: false,
            readinessScore: false,
            readinessMetrics: false,
            readinessBreakdown: false,
          },
        },
        errors: {},

        // ===== PERSONAL DATA ACTIONS =====
        fetchPersonalMetrics: async () => {
          const state = get();
          if (state.loading.personal.metrics || !isStale(state.timestamps.personal.metrics, STALE_TIMES.personal)) {
            return;
          }

          set((state) => ({ loading: { ...state.loading, personal: { ...state.loading.personal, metrics: true } } }));

          try {
            // Note: Permission checks are now handled at the component level to avoid hook calls
            const { getMyMetrics } = await import('@/lib/mock-data');
            const metrics = await getMyMetrics();

            set((state) => ({
              personal: { ...state.personal, metrics },
              loading: { ...state.loading, personal: { ...state.loading.personal, metrics: false } },
              timestamps: { ...state.timestamps, personal: { ...state.timestamps.personal, metrics: Date.now() } },
              errors: { ...state.errors, 'personal.metrics': null },
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch metrics';
            set((state) => ({
              loading: { ...state.loading, personal: { ...state.loading.personal, metrics: false } },
              errors: { ...state.errors, 'personal.metrics': errorMessage },
            }));
          }
        },

        fetchPersonalGoals: async () => {
          const state = get();
          if (state.loading.personal.goals || !isStale(state.timestamps.personal.goals, STALE_TIMES.personal)) {
            return;
          }

          set((state) => ({ loading: { ...state.loading, personal: { ...state.loading.personal, goals: true } } }));

          try {
            // Note: Permission checks are now handled at the component level to avoid hook calls
            const { getMyGoals } = await import('@/lib/mock-data');
            const goals = await getMyGoals();

            set((state) => ({
              personal: { ...state.personal, goals },
              loading: { ...state.loading, personal: { ...state.loading.personal, goals: false } },
              timestamps: { ...state.timestamps, personal: { ...state.timestamps.personal, goals: Date.now() } },
              errors: { ...state.errors, 'personal.goals': null },
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch goals';
            set((state) => ({
              loading: { ...state.loading, personal: { ...state.loading.personal, goals: false } },
              errors: { ...state.errors, 'personal.goals': errorMessage },
            }));
          }
        },

        fetchPersonalGameStats: async () => {
          const state = get();
          if (state.loading.personal.gameStats || !isStale(state.timestamps.personal.gameStats, STALE_TIMES.personal)) {
            return;
          }

          set((state) => ({ loading: { ...state.loading, personal: { ...state.loading.personal, gameStats: true } } }));

          try {
            // Note: Permission checks are now handled at the component level to avoid hook calls
            const { getMyGameStats } = await import('@/lib/mock-data');
            const gameStats = await getMyGameStats();

            set((state) => ({
              personal: { ...state.personal, gameStats },
              loading: { ...state.loading, personal: { ...state.loading.personal, gameStats: false } },
              timestamps: { ...state.timestamps, personal: { ...state.timestamps.personal, gameStats: Date.now() } },
              errors: { ...state.errors, 'personal.gameStats': null },
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch game stats';
            set((state) => ({
              loading: { ...state.loading, personal: { ...state.loading.personal, gameStats: false } },
              errors: { ...state.errors, 'personal.gameStats': errorMessage },
            }));
          }
        },

        fetchPersonalLearning: async () => {
          const state = get();
          if (state.loading.personal.learning || !isStale(state.timestamps.personal.learning, STALE_TIMES.personal)) {
            return;
          }

          set((state) => ({ loading: { ...state.loading, personal: { ...state.loading.personal, learning: true } } }));

          try {
            // Note: Permission checks are now handled at the component level to avoid hook calls
            const { mockData } = await import('@/lib/mock-data');
            const learning = mockData.myLearningData;

            set((state) => ({
              personal: { ...state.personal, learning },
              loading: { ...state.loading, personal: { ...state.loading.personal, learning: false } },
              timestamps: { ...state.timestamps, personal: { ...state.timestamps.personal, learning: Date.now() } },
              errors: { ...state.errors, 'personal.learning': null },
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch learning data';
            set((state) => ({
              loading: { ...state.loading, personal: { ...state.loading.personal, learning: false } },
              errors: { ...state.errors, 'personal.learning': errorMessage },
            }));
          }
        },

        fetchPersonalInterventions: async () => {
          const state = get();
          if (state.loading.personal.interventions || !isStale(state.timestamps.personal.interventions, STALE_TIMES.personal)) {
            return;
          }

          set((state) => ({ loading: { ...state.loading, personal: { ...state.loading.personal, interventions: true } } }));

          try {
            // Note: Permission checks are now handled at the component level to avoid hook calls
            const { mockData } = await import('@/lib/mock-data');
            const interventions = mockData.myMetrics.interventions;

            set((state) => ({
              personal: { ...state.personal, interventions },
              loading: { ...state.loading, personal: { ...state.loading.personal, interventions: false } },
              timestamps: { ...state.timestamps, personal: { ...state.timestamps.personal, interventions: Date.now() } },
              errors: { ...state.errors, 'personal.interventions': null },
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch interventions';
            set((state) => ({
              loading: { ...state.loading, personal: { ...state.loading.personal, interventions: false } },
              errors: { ...state.errors, 'personal.interventions': errorMessage },
            }));
          }
        },

        fetchAllPersonalData: async () => {
          const actions = get();
          await Promise.allSettled([
            actions.fetchPersonalMetrics(),
            actions.fetchPersonalGoals(),
            actions.fetchPersonalGameStats(),
            actions.fetchPersonalLearning(),
            actions.fetchPersonalInterventions(),
          ]);
        },

        // ===== TEAM DATA ACTIONS =====
        fetchTeamStats: async () => {
          const state = get();
          if (state.loading.team.stats || !isStale(state.timestamps.team.stats, STALE_TIMES.team)) {
            return;
          }

          set((state) => ({ loading: { ...state.loading, team: { ...state.loading.team, stats: true } } }));

          try {
            // Note: Permission checks are now handled at the component level to avoid hook calls
            const { getTeamStats } = await import('@/lib/mock-data');
            const stats = await getTeamStats();

            set((state) => ({
              team: { ...state.team, stats },
              loading: { ...state.loading, team: { ...state.loading.team, stats: false } },
              timestamps: { ...state.timestamps, team: { ...state.timestamps.team, stats: Date.now() } },
              errors: { ...state.errors, 'team.stats': null },
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch team stats';
            set((state) => ({
              loading: { ...state.loading, team: { ...state.loading.team, stats: false } },
              errors: { ...state.errors, 'team.stats': errorMessage },
            }));
          }
        },

        fetchTeamLearners: async (filters = {}) => {
          const state = get();
          
          // Check if filters changed or data is stale
          const currentFilters = state.team.learners?.filters || {};
          const filtersChanged = JSON.stringify(filters) !== JSON.stringify(currentFilters);
          
          if (state.loading.team.learners || (!filtersChanged && !isStale(state.timestamps.team.learners, STALE_TIMES.team))) {
            return;
          }

          set((state) => ({ loading: { ...state.loading, team: { ...state.loading.team, learners: true } } }));

          try {
            // Note: Permission checks are now handled at the component level to avoid hook calls
            const { getLearners } = await import('@/lib/mock-data');
            const learnersResponse = await getLearners(filters);
            
            const learners = {
              data: learnersResponse.data,
              pagination: {
                total: learnersResponse.total,
                page: learnersResponse.page,
                limit: 25,
              },
              filters,
            };

            set((state) => ({
              team: { ...state.team, learners },
              loading: { ...state.loading, team: { ...state.loading.team, learners: false } },
              timestamps: { ...state.timestamps, team: { ...state.timestamps.team, learners: Date.now() } },
              errors: { ...state.errors, 'team.learners': null },
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch learners';
            set((state) => ({
              loading: { ...state.loading, team: { ...state.loading.team, learners: false } },
              errors: { ...state.errors, 'team.learners': errorMessage },
            }));
          }
        },

        fetchTeamInsights: async () => {
          const state = get();
          if (state.loading.team.insights || !isStale(state.timestamps.team.insights, STALE_TIMES.team)) {
            return;
          }

          set((state) => ({ loading: { ...state.loading, team: { ...state.loading.team, insights: true } } }));

          try {
            // Note: Permission checks are now handled at the component level to avoid hook calls
            // Mock team insights
            const insights = {
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

            set((state) => ({
              team: { ...state.team, insights },
              loading: { ...state.loading, team: { ...state.loading.team, insights: false } },
              timestamps: { ...state.timestamps, team: { ...state.timestamps.team, insights: Date.now() } },
              errors: { ...state.errors, 'team.insights': null },
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch team insights';
            set((state) => ({
              loading: { ...state.loading, team: { ...state.loading.team, insights: false } },
              errors: { ...state.errors, 'team.insights': errorMessage },
            }));
          }
        },

        fetchTeamCourses: async () => {
          const state = get();
          if (state.loading.team.courses || !isStale(state.timestamps.team.courses, STALE_TIMES.team)) {
            return;
          }

          set((state) => ({ loading: { ...state.loading, team: { ...state.loading.team, courses: true } } }));

          try {
            // Note: Permission checks are now handled at the component level to avoid hook calls
            // Mock courses data
            const courses = [
              { id: 'course-1', title: 'Advanced React Patterns', enrolled: 25, completed: 18 },
              { id: 'course-2', title: 'TypeScript Fundamentals', enrolled: 30, completed: 22 },
              { id: 'course-3', title: 'System Design', enrolled: 15, completed: 8 },
            ];

            set((state) => ({
              team: { ...state.team, courses },
              loading: { ...state.loading, team: { ...state.loading.team, courses: false } },
              timestamps: { ...state.timestamps, team: { ...state.timestamps.team, courses: Date.now() } },
              errors: { ...state.errors, 'team.courses': null },
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch courses';
            set((state) => ({
              loading: { ...state.loading, team: { ...state.loading.team, courses: false } },
              errors: { ...state.errors, 'team.courses': errorMessage },
            }));
          }
        },

        fetchTeamMessages: async () => {
          const state = get();
          if (state.loading.team.messages || !isStale(state.timestamps.team.messages, STALE_TIMES.team)) {
            return;
          }

          set((state) => ({ loading: { ...state.loading, team: { ...state.loading.team, messages: true } } }));

          try {
            // Note: Permission checks are now handled at the component level to avoid hook calls
            // Mock messages data
            const messages = [
              { id: 'msg-1', from: 'System', content: 'New learner joined your team', timestamp: Date.now() },
              { id: 'msg-2', from: 'Admin', content: 'Team performance review scheduled', timestamp: Date.now() - 3600000 },
            ];

            set((state) => ({
              team: { ...state.team, messages },
              loading: { ...state.loading, team: { ...state.loading.team, messages: false } },
              timestamps: { ...state.timestamps, team: { ...state.timestamps.team, messages: Date.now() } },
              errors: { ...state.errors, 'team.messages': null },
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch messages';
            set((state) => ({
              loading: { ...state.loading, team: { ...state.loading.team, messages: false } },
              errors: { ...state.errors, 'team.messages': errorMessage },
            }));
          }
        },

        fetchAllTeamData: async (filters = {}) => {
          const actions = get();
          await Promise.allSettled([
            actions.fetchTeamStats(),
            actions.fetchTeamLearners(filters),
            actions.fetchTeamInsights(),
            actions.fetchTeamCourses(),
            actions.fetchTeamMessages(),
          ]);
        },

        // ===== ORGANIZATION DATA ACTIONS =====
        fetchOrganizationKPIs: async () => {
          const state = get();
          if (state.loading.organization.kpis || !isStale(state.timestamps.organization.kpis, STALE_TIMES.organization)) {
            return;
          }

          set((state) => ({ loading: { ...state.loading, organization: { ...state.loading.organization, kpis: true } } }));

          try {
            // Note: Permission checks are now handled at the component level to avoid hook calls
            const { getOrganizationKPIs } = await import('@/lib/mock-data');
            const kpis = await getOrganizationKPIs();

            set((state) => ({
              organization: { ...state.organization, kpis },
              loading: { ...state.loading, organization: { ...state.loading.organization, kpis: false } },
              timestamps: { ...state.timestamps, organization: { ...state.timestamps.organization, kpis: Date.now() } },
              errors: { ...state.errors, 'organization.kpis': null },
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch organization KPIs';
            set((state) => ({
              loading: { ...state.loading, organization: { ...state.loading.organization, kpis: false } },
              errors: { ...state.errors, 'organization.kpis': errorMessage },
            }));
          }
        },

        fetchOrganizationInsights: async () => {
          const state = get();
          if (state.loading.organization.insights || !isStale(state.timestamps.organization.insights, STALE_TIMES.organization)) {
            return;
          }

          set((state) => ({ loading: { ...state.loading, organization: { ...state.loading.organization, insights: true } } }));

          try {
            // Note: Permission checks are now handled at the component level to avoid hook calls

            // Mock organization insights
            const insights = [
              { type: 'performance', title: 'Overall Performance Up 15%', data: { change: 15, period: 'Q1' } },
              { type: 'risk', title: 'Risk Mitigation Effective', data: { reduction: 23, period: 'Month' } },
              { type: 'engagement', title: 'Employee Engagement High', data: { score: 8.2, target: 7.5 } },
            ];

            set((state) => ({
              organization: { ...state.organization, insights },
              loading: { ...state.loading, organization: { ...state.loading.organization, insights: false } },
              timestamps: { ...state.timestamps, organization: { ...state.timestamps.organization, insights: Date.now() } },
              errors: { ...state.errors, 'organization.insights': null },
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch organization insights';
            set((state) => ({
              loading: { ...state.loading, organization: { ...state.loading.organization, insights: false } },
              errors: { ...state.errors, 'organization.insights': errorMessage },
            }));
          }
        },

        fetchOrganizationReports: async () => {
          const state = get();
          if (state.loading.organization.reports || !isStale(state.timestamps.organization.reports, STALE_TIMES.organization)) {
            return;
          }

          set((state) => ({ loading: { ...state.loading, organization: { ...state.loading.organization, reports: true } } }));

          try {
            // Note: Permission checks are now handled at the component level to avoid hook calls

            // Mock reports data
            const reports = [
              { id: 'report-1', title: 'Q1 Performance Report', type: 'quarterly', date: '2024-03-31' },
              { id: 'report-2', title: 'Skills Gap Analysis', type: 'analysis', date: '2024-01-15' },
              { id: 'report-3', title: 'Learning Effectiveness Study', type: 'study', date: '2024-01-10' },
            ];

            set((state) => ({
              organization: { ...state.organization, reports },
              loading: { ...state.loading, organization: { ...state.loading.organization, reports: false } },
              timestamps: { ...state.timestamps, organization: { ...state.timestamps.organization, reports: Date.now() } },
              errors: { ...state.errors, 'organization.reports': null },
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch organization reports';
            set((state) => ({
              loading: { ...state.loading, organization: { ...state.loading.organization, reports: false } },
              errors: { ...state.errors, 'organization.reports': errorMessage },
            }));
          }
        },

        fetchOrganizationStrategy: async () => {
          const state = get();
          if (state.loading.organization.strategy || !isStale(state.timestamps.organization.strategy, STALE_TIMES.organization)) {
            return;
          }

          set((state) => ({ loading: { ...state.loading, organization: { ...state.loading.organization, strategy: true } } }));

          try {
            // Note: Permission checks are now handled at the component level to avoid hook calls

            // Mock strategy data
            const strategy = [
              { objective: 'Increase skill fit by 20%', progress: 65, deadline: '2024-06-30' },
              { objective: 'Reduce onboarding time by 30%', progress: 80, deadline: '2024-05-15' },
              { objective: 'Improve retention by 15%', progress: 45, deadline: '2024-12-31' },
            ];

            set((state) => ({
              organization: { ...state.organization, strategy },
              loading: { ...state.loading, organization: { ...state.loading.organization, strategy: false } },
              timestamps: { ...state.timestamps, organization: { ...state.timestamps.organization, strategy: Date.now() } },
              errors: { ...state.errors, 'organization.strategy': null },
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch organization strategy';
            set((state) => ({
              loading: { ...state.loading, organization: { ...state.loading.organization, strategy: false } },
              errors: { ...state.errors, 'organization.strategy': errorMessage },
            }));
          }
        },

        fetchAllOrganizationData: async () => {
          const actions = get();
          await Promise.allSettled([
            actions.fetchOrganizationKPIs(),
            actions.fetchOrganizationInsights(),
            actions.fetchOrganizationReports(),
            actions.fetchOrganizationStrategy(),
          ]);
        },

        // ===== INVALIDATION ACTIONS =====
        invalidatePersonalData: (keys = []) => {
          set((state) => {
            const newTimestamps = { ...state.timestamps.personal };
            if (keys.length === 0) {
              // Invalidate all personal data
              Object.keys(newTimestamps).forEach(key => {
                newTimestamps[key as keyof typeof newTimestamps] = null;
              });
            } else {
              // Invalidate specific keys
              keys.forEach(key => {
                if (key in newTimestamps) {
                  newTimestamps[key as keyof typeof newTimestamps] = null;
                }
              });
            }
            return {
              timestamps: {
                ...state.timestamps,
                personal: newTimestamps,
              },
            };
          });
        },

        invalidateTeamData: (keys = []) => {
          set((state) => {
            const newTimestamps = { ...state.timestamps.team };
            if (keys.length === 0) {
              Object.keys(newTimestamps).forEach(key => {
                newTimestamps[key as keyof typeof newTimestamps] = null;
              });
            } else {
              keys.forEach(key => {
                if (key in newTimestamps) {
                  newTimestamps[key as keyof typeof newTimestamps] = null;
                }
              });
            }
            return {
              timestamps: {
                ...state.timestamps,
                team: newTimestamps,
              },
            };
          });
        },

        invalidateOrganizationData: (keys = []) => {
          set((state) => {
            const newTimestamps = { ...state.timestamps.organization };
            if (keys.length === 0) {
              Object.keys(newTimestamps).forEach(key => {
                newTimestamps[key as keyof typeof newTimestamps] = null;
              });
            } else {
              keys.forEach(key => {
                if (key in newTimestamps) {
                  newTimestamps[key as keyof typeof newTimestamps] = null;
                }
              });
            }
            return {
              timestamps: {
                ...state.timestamps,
                organization: newTimestamps,
              },
            };
          });
        },

        invalidateAllData: () => {
          set((state) => ({
            timestamps: {
              personal: {
                metrics: null,
                goals: null,
                gameStats: null,
                learning: null,
                interventions: null,
              },
              team: {
                stats: null,
                learners: null,
                insights: null,
                courses: null,
                messages: null,
              },
              organization: {
                kpis: null,
                insights: null,
                reports: null,
                strategy: null,
                readinessScore: null,
                readinessMetrics: null,
                readinessBreakdown: null,
              },
            },
          }));
        },

        // ===== UTILITY ACTIONS =====
        isDataStale: (category, key, staleTimeMs) => {
          const state = get();
          const timestamp = state.timestamps[category][key as keyof typeof state.timestamps[typeof category]];
          return isStale(timestamp, staleTimeMs || STALE_TIMES[category]);
        },

        getSkillFitProgress: () => {
          const state = get();
          if (!state.personal.metrics) return { current: 0, trend: 0, status: 'stable' as const };
          
          const { skillFit, skillFitTrend } = state.personal.metrics;
          const status = skillFitTrend > 2 ? 'improving' : skillFitTrend < -2 ? 'declining' : 'stable';
          
          return { current: skillFit, trend: skillFitTrend, status };
        },

        getAtRiskLearners: () => {
          const state = get();
          if (!state.team.learners) return [];
          return state.team.learners.data.filter((learner: any) => learner.riskStatus === 'red');
        },
      }),
      {
        name: 'sensii-data-store',
        // Only persist timestamps for data freshness
        partialize: (state) => ({
          timestamps: state.timestamps,
        }),
        storage: createJSONStorage(() => localStorage),
        version: 1,
      }
    ),
    { name: 'data-store' }
  )
);

// ===== SELECTOR HOOKS =====
export const usePersonalData = () => useDataStore((state) => state.personal);
export const useTeamData = () => useDataStore((state) => state.team);
export const useOrganizationData = () => useDataStore((state) => state.organization);
export const useLoadingStates = () => useDataStore((state) => state.loading); 