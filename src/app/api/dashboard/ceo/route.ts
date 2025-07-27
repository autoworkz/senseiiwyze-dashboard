/**
 * CEO Dashboard API Route
 * Provides executive-level insights and strategic metrics for C-suite leadership
 */

import { NextRequest, NextResponse } from 'next/server';
import { APIAggregationService } from '@/lib/api-aggregation';

/**
 * GET /api/dashboard/ceo
 * Fetch CEO dashboard data with executive-level metrics
 */
export async function GET(_request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Get aggregated CEO dashboard data
    const data = await APIAggregationService.getCEODashboardData();
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: true,
      data,
      meta: {
        responseTime,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    });
  } catch (error) {
    console.error('CEO Dashboard API Error:', error);
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch CEO dashboard data',
      meta: {
        responseTime,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    }, { status: 500 });
  }
} 