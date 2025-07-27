import { NextRequest, NextResponse } from 'next/server';
import { APIAggregationService, APIPerformanceMonitor } from '@/lib/api-aggregation';

/**
 * Worker Dashboard Aggregated API Endpoint
 * 
 * Returns all team management data needed for the Worker dashboard in a single request:
 * - Team statistics and metrics
 * - Learner data with filtering and pagination
 * - Team insights and risk analysis
 * - Course management data
 * - Team messages and communications
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Extract filters from URL parameters
    const { searchParams } = new URL(request.url);
    const filters = {
      search: searchParams.get('search') || '',
      status: searchParams.get('status') || '',
      riskLevel: searchParams.get('riskLevel') || '',
      skillFit: searchParams.get('skillFit') || '',
      showAtRiskOnly: searchParams.get('showAtRiskOnly') === 'true',
      track: searchParams.get('track') || '',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '25'),
    };
    
    // Remove empty filters
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_key, value]) => 
        value !== '' && value !== false && value !== 0
      )
    );
    
    // Get aggregated Worker dashboard data
    const data = await APIAggregationService.getWorkerDashboardData(cleanFilters);
    
    const responseTime = Date.now() - startTime;
    APIPerformanceMonitor.recordRequest(responseTime, false);
    
    return NextResponse.json({
      success: true,
      data,
      meta: {
        responseTime: `${responseTime}ms`,
        aggregated: true,
        dataTypes: ['teamStats', 'learners', 'teamInsights', 'courses', 'messages'],
        filters: cleanFilters,
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
          { error: 'Forbidden', message: 'Insufficient permissions to access team data' },
          { status: 403 }
        );
      }
    }
    
    console.error('Worker Dashboard API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        message: 'Failed to fetch team dashboard data',
        responseTime: `${responseTime}ms`
      },
      { status: 500 }
    );
  }
} 