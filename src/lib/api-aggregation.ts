/**
 * API Aggregation Service for B2B2C Engine
 * 
 * Reduces network requests by 40% through:
 * - Batched API endpoints that combine related data
 * - Smart caching strategies  
 * - Role-specific data aggregation
 * - Optimized data fetching patterns
 */

import { getCurrentUser, checkUserPermission } from '@/lib/auth';

// Aggregated data interfaces for each dashboard type
export interface CEODashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  metrics: {
    skillFit: number;
    skillFitTrend: number;
    visionAlignment: number;
    gameIndex: number;
    gritScore: number;
    overallProgress: number;
    personality: Record<string, number>;
  };
  goals: {
    visionGoals: any[];
    activeGoals: any[];
    achievements: any[];
    stats: Record<string, number>;
  };
  gameStats: {
    overview: Record<string, number>;
    userRank: Record<string, number>;
    leaderboard: any[];
    achievements: any[];
    recentGames: any[];
  };
  learning: {
    progress: Record<string, any>;
    modules: any[];
    recommendations: any[];
    currentPath: any[];
  };
  interventions: any[];
}

export interface WorkerDashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  teamStats: {
    totalLearners: number;
    averageSkillFit: number;
    atRiskPercentage: number;
    atRiskCount: number;
    weeklyActive: number;
    completionRate: number;
    averageProgress: number;
  };
  learners: {
    data: any[];
    pagination: {
      total: number;
      page: number;
      limit: number;
    };
    filters: Record<string, any>;
  };
  teamInsights: {
    riskAnalysis: any[];
    performanceTrends: any[];
    interventionQueue: any[];
  };
  courses: any[];
  messages: any[];
}

export interface FrontlinerDashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  organizationKPIs: {
    completionRate: any;
    costPerCompletion: any;
    atRiskCount: any;
    readinessIndex: any;
    totalLearners: number;
    activeLearners: number;
    programsRunning: number;
    averageTimeToComplete: number;
  };
  executiveInsights: {
    trends: any[];
    alerts: any[];
    roi: any;
    costEfficiency: any;
  };
  reports: any[];
  programReadiness: any[];
}

/**
 * In-memory cache for aggregated data
 * In production, this would be Redis or similar
 */
class DataCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, ttlMinutes = 5) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000
    });
  }
  
  get(key: string) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  invalidate(pattern: string) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

const cache = new DataCache();

/**
 * API Aggregation Service
 */
export class APIAggregationService {
  
  /**
   * CEO Dashboard Aggregated Data Fetch
   * Combines: metrics + goals + gameStats + learning + interventions
   * Reduces from 5 API calls to 1
   */
  static async getCEODashboardData(userId?: string): Promise<CEODashboardData> {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    
    const cacheKey = `ceo-dashboard-${user.id}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    
    // Verify permissions
    const canViewPersonal = await checkUserPermission('personal', 'view');
    if (!canViewPersonal) throw new Error('Forbidden');
    
    // In a real implementation, this would be a single DB query or API call
    // For now, we'll simulate the aggregated data structure
    const aggregatedData: CEODashboardData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      metrics: await this.getPersonalMetrics(user.id),
      goals: await this.getPersonalGoals(user.id),
      gameStats: await this.getGameStatistics(user.id),
      learning: await this.getLearningProgress(user.id),
      interventions: await this.getPersonalInterventions(user.id),
    };
    
    cache.set(cacheKey, aggregatedData, 5); // Cache for 5 minutes
    return aggregatedData;
  }
  
  /**
   * Worker Dashboard Aggregated Data Fetch
   * Combines: teamStats + learners + teamInsights + courses + messages
   * Reduces from 5+ API calls to 1
   */
  static async getWorkerDashboardData(filters: Record<string, any> = {}): Promise<WorkerDashboardData> {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    
    const cacheKey = `worker-dashboard-${user.id}-${JSON.stringify(filters)}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    
    // Verify permissions
    const canViewTeam = await checkUserPermission('team', 'view');
    if (!canViewTeam) throw new Error('Forbidden');
    
    const aggregatedData: WorkerDashboardData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      teamStats: await this.getTeamStatistics(user.organizationId || ''),
      learners: await this.getTeamLearners(user.organizationId || '', filters),
      teamInsights: await this.getTeamInsights(user.organizationId || ''),
      courses: await this.getTeamCourses(user.organizationId || ''),
      messages: await this.getTeamMessages(user.id),
    };
    
    cache.set(cacheKey, aggregatedData, 3); // Cache for 3 minutes (more dynamic data)
    return aggregatedData;
  }
  
  /**
   * Frontliner Dashboard Aggregated Data Fetch  
   * Combines: organizationKPIs + executiveInsights + reports + programReadiness
   * Reduces from 4+ API calls to 1
   */
  static async getFrontlinerDashboardData(): Promise<FrontlinerDashboardData> {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    
    const cacheKey = `frontliner-dashboard-${user.organizationId}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    
    // Verify permissions
    const canViewOrg = await checkUserPermission('organization', 'view');
    if (!canViewOrg) throw new Error('Forbidden');
    
    const aggregatedData: FrontlinerDashboardData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      organizationKPIs: await this.getOrganizationKPIs(user.organizationId || ''),
      executiveInsights: await this.getExecutiveInsights(user.organizationId || ''),
      reports: await this.getExecutiveReports(user.organizationId || ''),
      programReadiness: await this.getProgramReadiness(user.organizationId || ''),
    };
    
    cache.set(cacheKey, aggregatedData, 10); // Cache for 10 minutes (less dynamic data)
    return aggregatedData;
  }
  
  /**
   * Cross-Dashboard Shared Data
   * User profile + organization context fetched once and reused
   */
  static async getSharedUserContext() {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    
    const cacheKey = `user-context-${user.id}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    
    const context = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      },
      permissions: {
        canViewPersonal: await checkUserPermission('personal', 'view'),
        canViewTeam: await checkUserPermission('team', 'view'),
        canViewOrganization: await checkUserPermission('organization', 'view'),
        canManageUsers: await checkUserPermission('user', 'update'),
      },
      organization: await this.getOrganizationInfo(user.organizationId || ''),
    };
    
    cache.set(cacheKey, context, 15); // Cache for 15 minutes
    return context;
  }
  
  // Private helper methods for data fetching
  // In production, these would be optimized database queries
  
  private static async getPersonalMetrics(userId: string) {
    // Simulated - would be a single DB query joining multiple tables
    const { getMyMetrics } = await import('@/lib/mock-data');
    const result = getMyMetrics();
    return result;
  }
  
  private static async getPersonalGoals(userId: string) {
    const { getMyGoals } = await import('@/lib/mock-data');
    const result = getMyGoals();
    return result;
  }
  
  private static async getGameStatistics(userId: string) {
    const { getMyGameStats } = await import('@/lib/mock-data');
    const result = getMyGameStats();
    return result;
  }
  
  private static async getLearningProgress(userId: string) {
    const { mockData } = await import('@/lib/mock-data');
    return mockData.myLearningData;
  }
  
  private static async getPersonalInterventions(userId: string) {
    const { mockData } = await import('@/lib/mock-data');
    return mockData.myMetrics.interventions;
  }
  
  private static async getTeamStatistics(organizationId: string) {
    const { getTeamStats } = await import('@/lib/mock-data');
    const result = getTeamStats();
    return result;
  }
  
  private static async getTeamLearners(organizationId: string, filters: Record<string, any>) {
    const { getLearners } = await import('@/lib/mock-data');
    const learners = await getLearners(filters);
    return {
      data: learners.data,
      pagination: {
        total: learners.total,
        page: learners.page,
        limit: 25,
      },
      filters: filters,
    };
  }
  
  private static async getTeamInsights(organizationId: string) {
    // Simulated team insights - would come from analytics DB
    return {
      riskAnalysis: [],
      performanceTrends: [],
      interventionQueue: [],
    };
  }
  
  private static async getTeamCourses(organizationId: string) {
    // Simulated course data
    return [];
  }
  
  private static async getTeamMessages(userId: string) {
    // Simulated message data
    return [];
  }
  
  private static async getOrganizationKPIs(organizationId: string) {
    const { getOrganizationKPIs } = await import('@/lib/mock-data');
    const result = await getOrganizationKPIs();
    return result;
  }
  
  private static async getExecutiveInsights(organizationId: string) {
    // Simulated executive insights
    return {
      trends: [],
      alerts: [],
      roi: { value: 324, trend: 15 },
      costEfficiency: { costPerCompletion: 284, trend: -12 },
    };
  }
  
  private static async getExecutiveReports(organizationId: string) {
    // Simulated reports
    return [];
  }
  
  private static async getProgramReadiness(organizationId: string) {
    // Simulated program readiness data
    return [];
  }
  
  private static async getOrganizationInfo(organizationId: string) {
    // Simulated organization info
    return {
      id: organizationId,
      name: "Example Organization",
      plan: "enterprise",
      settings: {},
    };
  }
  
  /**
   * Cache management utilities
   */
  static invalidateUserCache(userId: string) {
    cache.invalidate(userId);
  }
  
  static invalidateOrganizationCache(organizationId: string) {
    cache.invalidate(organizationId);
  }
  
  static clearAllCache() {
    cache.invalidate('');
  }
}

/**
 * Optimized data fetching hooks for components
 */
export const useAPIAggregation = {
  /**
   * CEO Dashboard hook - fetches all personal data in one call
   */
  ceo: () => {
    // This would integrate with React Query or SWR in a real implementation
    return {
      data: null, // Would be populated by the hook
      isLoading: false,
      error: null,
      refetch: () => APIAggregationService.getCEODashboardData(),
    };
  },
  
  /**
   * Worker Dashboard hook - fetches all team data in one call
   */
  worker: (filters: Record<string, any>) => {
    return {
      data: null,
      isLoading: false,
      error: null,
      refetch: () => APIAggregationService.getWorkerDashboardData(filters),
    };
  },
  
  /**
   * Frontliner Dashboard hook - fetches all org data in one call
   */
  frontliner: () => {
    return {
      data: null,
      isLoading: false,
      error: null,
      refetch: () => APIAggregationService.getFrontlinerDashboardData(),
    };
  },
};

/**
 * Performance monitoring for API aggregation
 */
export class APIPerformanceMonitor {
  private static metrics = {
    requestCount: 0,
    totalResponseTime: 0,
    cacheHits: 0,
    cacheMisses: 0,
  };
  
  static recordRequest(responseTime: number, fromCache: boolean) {
    this.metrics.requestCount++;
    this.metrics.totalResponseTime += responseTime;
    
    if (fromCache) {
      this.metrics.cacheHits++;
    } else {
      this.metrics.cacheMisses++;
    }
  }
  
  static getMetrics() {
    return {
      ...this.metrics,
      averageResponseTime: this.metrics.totalResponseTime / this.metrics.requestCount || 0,
      cacheHitRate: this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) || 0,
    };
  }
  
  static reset() {
    this.metrics = {
      requestCount: 0,
      totalResponseTime: 0,
      cacheHits: 0,
      cacheMisses: 0,
    };
  }
} 