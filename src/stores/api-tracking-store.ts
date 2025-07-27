/**
 * API Call Tracking Store
 * 
 * Tracks all API calls across the application for monitoring and debugging.
 * Provides insights into:
 * - Active API calls
 * - Call history and performance
 * - Error tracking
 * - Network request reduction metrics
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface APICall {
  id: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  status: 'pending' | 'success' | 'error';
  startTime: number;
  endTime?: number;
  duration?: number;
  fromCache?: boolean;
  error?: string;
  dataSize?: number;
  userId?: string;
  feature: 'ceo' | 'worker' | 'frontliner' | 'shared';
}

interface APICallMetrics {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  averageResponseTime: number;
  cacheHitRate: number;
  networkRequestsReduced: number;
  targetReduction: number; // 40%
}

interface APITrackingState {
  // Active API calls
  activeCalls: Record<string, APICall>;
  
  // Call history (last 100 calls)
  callHistory: APICall[];
  
  // Performance metrics
  metrics: APICallMetrics;
  
  // Actions
  startCall: (call: Omit<APICall, 'id' | 'startTime' | 'status'>) => string;
  completeCall: (id: string, success: boolean, error?: string, fromCache?: boolean) => void;
  clearHistory: () => void;
  getMetrics: () => APICallMetrics;
  getActiveCallsForFeature: (feature: APICall['feature']) => APICall[];
}

export const useAPITrackingStore = create<APITrackingState>()(
  devtools(
    (set, get) => ({
      activeCalls: {},
      callHistory: [],
      metrics: {
        totalCalls: 0,
        successfulCalls: 0,
        failedCalls: 0,
        averageResponseTime: 0,
        cacheHitRate: 0,
        networkRequestsReduced: 0,
        targetReduction: 40,
      },

      startCall: (callData) => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const call: APICall = {
          ...callData,
          id,
          startTime: Date.now(),
          status: 'pending',
        };

        set((state) => ({
          activeCalls: {
            ...state.activeCalls,
            [id]: call,
          },
        }));

        return id;
      },

      completeCall: (id, success, error, fromCache = false) => {
        const state = get();
        const call = state.activeCalls[id];
        
        if (!call) return;

        const endTime = Date.now();
        const duration = endTime - call.startTime;
        
        const completedCall: APICall = {
          ...call,
          status: success ? 'success' : 'error',
          endTime,
          duration,
          fromCache,
          error,
        };

        // Update call history (keep last 100)
        const newHistory = [completedCall, ...state.callHistory].slice(0, 100);
        
        // Update metrics
        const totalCalls = state.metrics.totalCalls + 1;
        const successfulCalls = state.metrics.successfulCalls + (success ? 1 : 0);
        const failedCalls = state.metrics.failedCalls + (!success ? 1 : 0);
        
        // Calculate average response time
        const totalResponseTime = newHistory.reduce((sum, call) => sum + (call.duration || 0), 0);
        const averageResponseTime = totalResponseTime / newHistory.length;
        
        // Calculate cache hit rate
        const cachedCalls = newHistory.filter(call => call.fromCache).length;
        const cacheHitRate = (cachedCalls / newHistory.length) * 100;
        
        // Calculate network requests reduced (estimate based on aggregation)
        const aggregatedCalls = newHistory.filter(call => 
          call.endpoint.includes('/dashboard/')
        ).length;
        const estimatedOriginalCalls = aggregatedCalls * 4; // Avg 4 calls per dashboard
        const networkRequestsReduced = ((estimatedOriginalCalls - aggregatedCalls) / estimatedOriginalCalls) * 100;

        set((state) => ({
          activeCalls: Object.fromEntries(
            Object.entries(state.activeCalls).filter(([key]) => key !== id)
          ),
          callHistory: newHistory,
          metrics: {
            ...state.metrics,
            totalCalls,
            successfulCalls,
            failedCalls,
            averageResponseTime,
            cacheHitRate,
            networkRequestsReduced: isNaN(networkRequestsReduced) ? 0 : networkRequestsReduced,
          },
        }));
      },

      clearHistory: () => {
        set((state) => ({
          callHistory: [],
          metrics: {
            ...state.metrics,
            totalCalls: 0,
            successfulCalls: 0,
            failedCalls: 0,
            averageResponseTime: 0,
            cacheHitRate: 0,
            networkRequestsReduced: 0,
          },
        }));
      },

      getMetrics: () => get().metrics,

      getActiveCallsForFeature: (feature) => {
        const state = get();
        return Object.values(state.activeCalls).filter(call => call.feature === feature);
      },
    }),
    { name: 'api-tracking-store' }
  )
); 