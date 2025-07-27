/**
 * Dashboard Data Hooks
 * 
 * Simple hooks for consuming dashboard data from Zustand store.
 * Follows Zustand best practices with selective subscriptions.
 */

import { useEffect } from 'react';
import { useDataStore } from '@/stores/data-store';

// ===== CEO DASHBOARD HOOK =====
/**
 * Hook for CEO dashboard data with automatic fetching
 */
export function useCEODashboard() {
  const personal = useDataStore((state) => state.personal);
  const loading = useDataStore((state) => state.loading.personal);
  const fetchAllPersonalData = useDataStore((state) => state.fetchAllPersonalData);
  const invalidatePersonalData = useDataStore((state) => state.invalidatePersonalData);
  const getSkillFitProgress = useDataStore((state) => state.getSkillFitProgress);
  
  const errors = {
    metrics: useDataStore((state) => state.errors['personal.metrics']),
    goals: useDataStore((state) => state.errors['personal.goals']),
    gameStats: useDataStore((state) => state.errors['personal.gameStats']),
    learning: useDataStore((state) => state.errors['personal.learning']),
    interventions: useDataStore((state) => state.errors['personal.interventions']),
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchAllPersonalData();
  }, [fetchAllPersonalData]);

  return {
    data: personal,
    loading,
    errors,
    refetch: fetchAllPersonalData,
    invalidate: invalidatePersonalData,
    skillFitProgress: getSkillFitProgress(),
    isLoading: Object.values(loading).some(Boolean),
    hasError: Object.values(errors).some(Boolean),
  };
}

// ===== WORKER DASHBOARD HOOK =====
/**
 * Hook for Worker dashboard data with automatic fetching
 */
export function useWorkerDashboard(filters: Record<string, any> = {}) {
  const team = useDataStore((state) => state.team);
  const loading = useDataStore((state) => state.loading.team);
  const fetchAllTeamData = useDataStore((state) => state.fetchAllTeamData);
  const invalidateTeamData = useDataStore((state) => state.invalidateTeamData);
  const getAtRiskLearners = useDataStore((state) => state.getAtRiskLearners);
  
  const errors = {
    stats: useDataStore((state) => state.errors['team.stats']),
    learners: useDataStore((state) => state.errors['team.learners']),
    insights: useDataStore((state) => state.errors['team.insights']),
    courses: useDataStore((state) => state.errors['team.courses']),
    messages: useDataStore((state) => state.errors['team.messages']),
  };

  // Auto-fetch on mount or when filters change
  useEffect(() => {
    fetchAllTeamData(filters);
  }, [fetchAllTeamData, JSON.stringify(filters)]);

  return {
    data: team,
    loading,
    errors,
    refetch: (newFilters = filters) => fetchAllTeamData(newFilters),
    invalidate: invalidateTeamData,
    atRiskLearners: getAtRiskLearners(),
    isLoading: Object.values(loading).some(Boolean),
    hasError: Object.values(errors).some(Boolean),
  };
}

// ===== FRONTLINER DASHBOARD HOOK =====
/**
 * Hook for Frontliner dashboard data with automatic fetching
 */
export function useFrontlinerDashboard() {
  const organization = useDataStore((state) => state.organization);
  const loading = useDataStore((state) => state.loading.organization);
  const fetchAllOrganizationData = useDataStore((state) => state.fetchAllOrganizationData);
  const invalidateOrganizationData = useDataStore((state) => state.invalidateOrganizationData);
  
  const errors = {
    kpis: useDataStore((state) => state.errors['organization.kpis']),
    insights: useDataStore((state) => state.errors['organization.insights']),
    reports: useDataStore((state) => state.errors['organization.reports']),
    strategy: useDataStore((state) => state.errors['organization.strategy']),
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchAllOrganizationData();
  }, [fetchAllOrganizationData]);

  return {
    data: organization,
    loading,
    errors,
    refetch: fetchAllOrganizationData,
    invalidate: invalidateOrganizationData,
    isLoading: Object.values(loading).some(Boolean),
    hasError: Object.values(errors).some(Boolean),
  };
}

// ===== UTILITY HOOKS =====

/**
 * Hook for checking data staleness
 */
export function useDataStaleness() {
  const isDataStale = useDataStore((state) => state.isDataStale);
  const invalidateAllData = useDataStore((state) => state.invalidateAllData);

  return {
    isStale: isDataStale,
    invalidateAll: invalidateAllData,
  };
}

/**
 * Hook for global data operations
 */
export function useGlobalDataOperations() {
  const fetchAllPersonalData = useDataStore((state) => state.fetchAllPersonalData);
  const fetchAllTeamData = useDataStore((state) => state.fetchAllTeamData);
  const fetchAllOrganizationData = useDataStore((state) => state.fetchAllOrganizationData);
  const invalidateAllData = useDataStore((state) => state.invalidateAllData);

  const refetchAll = async () => {
    await Promise.allSettled([
      fetchAllPersonalData(),
      fetchAllTeamData(),
      fetchAllOrganizationData(),
    ]);
  };

  return {
    refetchAll,
    invalidateAll: invalidateAllData,
  };
} 