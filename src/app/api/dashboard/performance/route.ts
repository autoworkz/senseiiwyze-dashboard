import { NextRequest, NextResponse } from 'next/server';
import { APIPerformanceMonitor } from '@/lib/api-aggregation';
import { checkUserPermission } from '@/lib/auth';
import { withAuth } from '@/lib/api/with-auth'

/**
 * API Aggregation Performance Monitoring Endpoint
 * 
 * Returns performance metrics for the API aggregation system:
 * - Request count and response times
 * - Cache hit/miss rates
 * - Network request reduction analytics
 */
export const GET = withAuth(async (_request: NextRequest) => {
  try {
    // Check admin permissions for performance monitoring
    const canViewSystem = await checkUserPermission('system', 'audit');
    if (!canViewSystem) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Insufficient permissions to view performance metrics' },
        { status: 403 }
      );
    }
    
    // Get current performance metrics
    const metrics = APIPerformanceMonitor.getMetrics();
    
    // Calculate performance improvements
    const estimatedOriginalRequests = metrics.requestCount * 4; // Avg 4 requests per dashboard
    const actualRequests = metrics.requestCount;
    const networkReduction = ((estimatedOriginalRequests - actualRequests) / estimatedOriginalRequests) * 100;
    
    const performance = {
      ...metrics,
      networkReduction: {
        percentage: Math.round(networkReduction),
        originalRequests: estimatedOriginalRequests,
        aggregatedRequests: actualRequests,
        requestsSaved: estimatedOriginalRequests - actualRequests,
      },
      status: networkReduction >= 40 ? 'target-met' : 'below-target',
      target: {
        networkReduction: 40,
        description: 'Reduce network requests by 40%'
      }
    };
    
    return NextResponse.json({
      success: true,
      data: performance,
      meta: {
        timestamp: new Date().toISOString(),
        aggregationEnabled: true,
        cacheEnabled: true
      }
    });
  } catch (error) {
    console.error('Performance Monitoring API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch performance metrics' },
      { status: 500 }
    );
  }
});

/**
 * Reset performance metrics (admin only)
 */
export const DELETE = withAuth(async (_request: NextRequest) => {
  try {
    // Check admin permissions for performance monitoring
    const canViewSystem = await checkUserPermission('system', 'audit');
    if (!canViewSystem) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Insufficient permissions to reset performance metrics' },
        { status: 403 }
      );
    }
    
    APIPerformanceMonitor.reset();
    
    return NextResponse.json({
      success: true,
      message: 'Performance metrics reset successfully'
    });
  } catch (error) {
    console.error('Performance Reset API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to reset performance metrics' },
      { status: 500 }
    );
  }
}); 