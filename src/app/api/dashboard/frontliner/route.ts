import { NextRequest, NextResponse } from 'next/server';
import { APIAggregationService, APIPerformanceMonitor } from '@/lib/api-aggregation';
import { withAuth } from '@/lib/api/with-auth'

/**
 * Frontliner Dashboard Aggregated API Endpoint
 * 
 * Returns all organization-wide data needed for the Frontliner dashboard in a single request:
 * - Organization KPIs and metrics
 * - Executive insights and trends
 * - Organization reports and analytics
 * - Program readiness data
 * - Strategic oversight data
 */
export const GET = withAuth(async (_request: NextRequest) => {
  const startTime = Date.now();
  
  try {
    // Get aggregated Frontliner dashboard data
    const data = await APIAggregationService.getFrontlinerDashboardData();
    
    const responseTime = Date.now() - startTime;
    APIPerformanceMonitor.recordRequest(responseTime, false);
    
    return NextResponse.json({
      success: true,
      data,
      meta: {
        responseTime: `${responseTime}ms`,
        aggregated: true,
        dataTypes: ['organizationKPIs', 'executiveInsights', 'reports', 'programReadiness'],
        cacheStatus: 'miss'
      }
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Please log in to access this data' },
          { status: 401 }
        );
      }
      
      if (error.message === 'Forbidden') {
        return NextResponse.json(
          { error: 'Forbidden', message: 'Insufficient permissions to access organization data' },
          { status: 403 }
        );
      }
    }
    
    console.error('Frontliner Dashboard API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        message: 'Failed to fetch organization dashboard data',
        responseTime: `${responseTime}ms`
      },
      { status: 500 }
    );
  }
}); 