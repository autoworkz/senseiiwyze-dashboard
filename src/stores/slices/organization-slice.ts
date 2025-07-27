/**
 * Organization Data Slice (Frontliner Dashboard)
 * 
 * Manages organization-wide data including:
 * - Organization KPIs and metrics
 * - Executive insights and trends
 * - Organization reports and analytics
 * - Program readiness data
 * - Strategic oversight data
 */

import { StateCreator } from 'zustand';
import { useAPITrackingStore } from '../api-tracking-store';
import { clientPermissions } from '@/lib/auth-client';

// Types for organization data
export interface OrganizationKPIs {
  completionRate: {
    value: number;
    trend: number;
    period: string;
    history: number[];
  };
  costPerCompletion: {
    value: number;
    trend: number;
    period: string;
    history: number[];
  };
  atRiskCount: {
    value: number;
    trend: number;
    period: string;
    alert: boolean;
  };
  readinessIndex: {
    value: number;
    formula: string;
    zones: Array<{
      min: number;
      max: number;
      color: string;
      label: string;
    }>;
  };
  totalLearners: number;
  activeLearners: number;
  programsRunning: number;
  averageTimeToComplete: number;
}

export interface ExecutiveInsights {
  trends: Array<{
    category: string;
    value: number;
    change: number;
    period: string;
  }>;
  alerts: Array<{
    id: string;
    severity: 'high' | 'medium' | 'low';
    message: string;
    timestamp: number;
  }>;
  roi: {
    value: number;
    trend: number;
    breakdown: Record<string, number>;
  };
  costEfficiency: {
    costPerCompletion: number;
    trend: number;
    industryComparison: number;
  };
}

export interface OrganizationReports {
  monthly: any[];
  quarterly: any[];
  custom: any[];
}

export interface ProgramReadiness {
  overall: {
    score: number;
    status: 'excellent' | 'good' | 'moderate' | 'critical';
  };
  byProgram: Array<{
    id: string;
    name: string;
    readiness: number;
    participants: number;
    completion: number;
  }>;
  trends: Array<{
    period: string;
    score: number;
  }>;
}

export interface OrganizationSlice {
  // State
  organizationKPIs: OrganizationKPIs | null;
  executiveInsights: ExecutiveInsights | null;
  reports: OrganizationReports | null;
  programReadiness: ProgramReadiness | null;
  
  // Loading states
  isLoadingKPIs: boolean;
  isLoadingInsights: boolean;
  isLoadingReports: boolean;
  isLoadingProgramReadiness: boolean;
  
  // Error states
  kpisError: string | null;
  insightsError: string | null;
  reportsError: string | null;
  programReadinessError: string | null;
  
  // Last updated timestamps
  lastUpdated: {
    kpis: number | null;
    insights: number | null;
    reports: number | null;
    programReadiness: number | null;
  };

  // Actions
  fetchOrganizationKPIs: () => Promise<void>;
  fetchExecutiveInsights: () => Promise<void>;
  fetchReports: () => Promise<void>;
  fetchProgramReadiness: () => Promise<void>;
  fetchAllOrganizationData: () => Promise<void>;
  
  // Invalidation
  invalidateKPIs: () => void;
  invalidateInsights: () => void;
  invalidateReports: () => void;
  invalidateProgramReadiness: () => void;
  invalidateAllOrganizationData: () => void;
  
  // Selectors
  getCriticalAlerts: () => ExecutiveInsights['alerts'];
  getReadinessStatus: () => { status: string; score: number; trend: 'improving' | 'declining' | 'stable' };
  getROITrend: () => { current: number; trend: number; status: 'positive' | 'negative' | 'neutral' };
  isOrganizationDataStale: () => boolean;
}

// Helper function to check if data is stale (organization data refreshes every 10 minutes)
const isDataStale = (timestamp: number | null, staleTimeMs = 10 * 60 * 1000): boolean => {
  if (!timestamp) return true;
  return Date.now() - timestamp > staleTimeMs;
};

export const createOrganizationSlice: StateCreator<OrganizationSlice> = (set, get) => ({
  // Initial state
  organizationKPIs: null,
  executiveInsights: null,
  reports: null,
  programReadiness: null,
  
  // Loading states
  isLoadingKPIs: false,
  isLoadingInsights: false,
  isLoadingReports: false,
  isLoadingProgramReadiness: false,
  
  // Error states
  kpisError: null,
  insightsError: null,
  reportsError: null,
  programReadinessError: null,
  
  // Last updated timestamps
  lastUpdated: {
    kpis: null,
    insights: null,
    reports: null,
    programReadiness: null,
  },

  // Fetch organization KPIs
  fetchOrganizationKPIs: async () => {
    const state = get();
    
    if (state.isLoadingKPIs || !isDataStale(state.lastUpdated.kpis)) {
      return;
    }

    const trackingStore = useAPITrackingStore.getState();
    const callId = trackingStore.startCall({
      endpoint: '/api/organization/kpis',
      method: 'GET',
      feature: 'frontliner',
    });

    set({ isLoadingKPIs: true, kpisError: null });

    try {
      const canView = clientPermissions.checkUserPermission('organization', 'view');
      if (!canView) throw new Error('Forbidden');

      const { getOrganizationKPIs } = await import('@/lib/mock-data');
      const organizationKPIs = await getOrganizationKPIs();

      set({
        organizationKPIs,
        isLoadingKPIs: false,
        kpisError: null,
        lastUpdated: { ...state.lastUpdated, kpis: Date.now() },
      });

      trackingStore.completeCall(callId, true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch organization KPIs';
      set({
        isLoadingKPIs: false,
        kpisError: errorMessage,
      });
      trackingStore.completeCall(callId, false, errorMessage);
    }
  },

  // Fetch executive insights
  fetchExecutiveInsights: async () => {
    const state = get();
    
    if (state.isLoadingInsights || !isDataStale(state.lastUpdated.insights)) {
      return;
    }

    const trackingStore = useAPITrackingStore.getState();
    const callId = trackingStore.startCall({
      endpoint: '/api/organization/insights',
      method: 'GET',
      feature: 'frontliner',
    });

    set({ isLoadingInsights: true, insightsError: null });

    try {
      const canView = clientPermissions.checkUserPermission('organization', 'reports');
      if (!canView) throw new Error('Forbidden');

      // Simulated executive insights data
      const executiveInsights: ExecutiveInsights = {
        trends: [
          { category: 'Completion Rate', value: 87.3, change: 2.1, period: 'last month' },
          { category: 'Engagement', value: 82.5, change: -1.2, period: 'last month' },
          { category: 'Skill Development', value: 91.2, change: 4.8, period: 'last month' },
        ],
        alerts: [
          {
            id: 'alert-1',
            severity: 'high',
            message: '23 learners at high risk of dropping out',
            timestamp: Date.now() - 3600000,
          },
          {
            id: 'alert-2',
            severity: 'medium',
            message: 'Budget utilization at 85% for Q4',
            timestamp: Date.now() - 7200000,
          },
        ],
        roi: {
          value: 324,
          trend: 15,
          breakdown: {
            'Salary Increases': 180,
            'Productivity Gains': 95,
            'Reduced Turnover': 49,
          },
        },
        costEfficiency: {
          costPerCompletion: 284,
          trend: -12,
          industryComparison: -42, // 42% below industry average
        },
      };

      set({
        executiveInsights,
        isLoadingInsights: false,
        insightsError: null,
        lastUpdated: { ...state.lastUpdated, insights: Date.now() },
      });

      trackingStore.completeCall(callId, true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch executive insights';
      set({
        isLoadingInsights: false,
        insightsError: errorMessage,
      });
      trackingStore.completeCall(callId, false, errorMessage);
    }
  },

  // Fetch reports
  fetchReports: async () => {
    const state = get();
    
    if (state.isLoadingReports || !isDataStale(state.lastUpdated.reports)) {
      return;
    }

    const trackingStore = useAPITrackingStore.getState();
    const callId = trackingStore.startCall({
      endpoint: '/api/organization/reports',
      method: 'GET',
      feature: 'frontliner',
    });

    set({ isLoadingReports: true, reportsError: null });

    try {
      const canView = clientPermissions.checkUserPermission('organization', 'reports');
      if (!canView) throw new Error('Forbidden');

      // Simulated reports data
      const reports: OrganizationReports = {
        monthly: [
          { id: 'monthly-1', title: 'October Performance Report', date: '2024-10-31' },
          { id: 'monthly-2', title: 'September Performance Report', date: '2024-09-30' },
        ],
        quarterly: [
          { id: 'q4-2024', title: 'Q4 2024 Strategic Review', date: '2024-12-31' },
          { id: 'q3-2024', title: 'Q3 2024 Strategic Review', date: '2024-09-30' },
        ],
        custom: [
          { id: 'custom-1', title: 'Skill Gap Analysis', date: '2024-10-15' },
          { id: 'custom-2', title: 'ROI Deep Dive', date: '2024-10-01' },
        ],
      };

      set({
        reports,
        isLoadingReports: false,
        reportsError: null,
        lastUpdated: { ...state.lastUpdated, reports: Date.now() },
      });

      trackingStore.completeCall(callId, true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch reports';
      set({
        isLoadingReports: false,
        reportsError: errorMessage,
      });
      trackingStore.completeCall(callId, false, errorMessage);
    }
  },

  // Fetch program readiness
  fetchProgramReadiness: async () => {
    const state = get();
    
    if (state.isLoadingProgramReadiness || !isDataStale(state.lastUpdated.programReadiness)) {
      return;
    }

    const trackingStore = useAPITrackingStore.getState();
    const callId = trackingStore.startCall({
      endpoint: '/api/organization/program-readiness',
      method: 'GET',
      feature: 'frontliner',
    });

    set({ isLoadingProgramReadiness: true, programReadinessError: null });

    try {
      const canView = clientPermissions.checkUserPermission('organization', 'strategy');
      if (!canView) throw new Error('Forbidden');

      // Simulated program readiness data
      const programReadiness: ProgramReadiness = {
        overall: {
          score: 78.4,
          status: 'good',
        },
        byProgram: [
          { id: 'prog-1', name: 'Data Science Track', readiness: 85, participants: 45, completion: 78 },
          { id: 'prog-2', name: 'Cloud Engineering', readiness: 72, participants: 38, completion: 65 },
          { id: 'prog-3', name: 'Cybersecurity', readiness: 81, participants: 29, completion: 84 },
        ],
        trends: [
          { period: 'Q1', score: 72 },
          { period: 'Q2', score: 75 },
          { period: 'Q3', score: 78 },
          { period: 'Q4', score: 78.4 },
        ],
      };

      set({
        programReadiness,
        isLoadingProgramReadiness: false,
        programReadinessError: null,
        lastUpdated: { ...state.lastUpdated, programReadiness: Date.now() },
      });

      trackingStore.completeCall(callId, true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch program readiness';
      set({
        isLoadingProgramReadiness: false,
        programReadinessError: errorMessage,
      });
      trackingStore.completeCall(callId, false, errorMessage);
    }
  },

  // Fetch all organization data
  fetchAllOrganizationData: async () => {
    const actions = get();
    await Promise.allSettled([
      actions.fetchOrganizationKPIs(),
      actions.fetchExecutiveInsights(),
      actions.fetchReports(),
      actions.fetchProgramReadiness(),
    ]);
  },

  // Invalidation methods
  invalidateKPIs: () => {
    set((state) => ({
      lastUpdated: { ...state.lastUpdated, kpis: null }
    }));
  },

  invalidateInsights: () => {
    set((state) => ({
      lastUpdated: { ...state.lastUpdated, insights: null }
    }));
  },

  invalidateReports: () => {
    set((state) => ({
      lastUpdated: { ...state.lastUpdated, reports: null }
    }));
  },

  invalidateProgramReadiness: () => {
    set((state) => ({
      lastUpdated: { ...state.lastUpdated, programReadiness: null }
    }));
  },

  invalidateAllOrganizationData: () => {
    set((state) => ({
      lastUpdated: {
        kpis: null,
        insights: null,
        reports: null,
        programReadiness: null,
      }
    }));
  },

  // Selectors
  getCriticalAlerts: () => {
    const state = get();
    if (!state.executiveInsights) return [];
    return state.executiveInsights.alerts.filter(alert => alert.severity === 'high');
  },

  getReadinessStatus: () => {
    const state = get();
    if (!state.programReadiness) return { status: 'unknown', score: 0, trend: 'stable' as const };
    
    const { overall, trends } = state.programReadiness;
    const currentScore = overall.score;
    const previousScore = trends[trends.length - 2]?.score || currentScore;
    const scoreDiff = currentScore - previousScore;
    
    const trend = scoreDiff > 2 ? 'improving' : scoreDiff < -2 ? 'declining' : 'stable';
    
    return { status: overall.status, score: currentScore, trend };
  },

  getROITrend: () => {
    const state = get();
    if (!state.executiveInsights) return { current: 0, trend: 0, status: 'neutral' as const };
    
    const { roi } = state.executiveInsights;
    const status = roi.trend > 5 ? 'positive' : roi.trend < -5 ? 'negative' : 'neutral';
    
    return { current: roi.value, trend: roi.trend, status };
  },

  isOrganizationDataStale: () => {
    const state = get();
    return Object.values(state.lastUpdated).some(timestamp => isDataStale(timestamp));
  },
}); 