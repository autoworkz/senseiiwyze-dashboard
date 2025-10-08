import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Not available in production' },
        { status: 403 }
      );
    }

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check Autumn configuration
    const config = {
      hasAutumnApiKey: !!process.env.AUTUMN_API_KEY,
      autumnApiKeyLength: process.env.AUTUMN_API_KEY?.length || 0,
      hasStarterProductId: !!process.env.AUTUMN_STARTER_PRODUCT_ID,
      hasProfessionalProductId: !!process.env.AUTUMN_PROFESSIONAL_PRODUCT_ID,
      hasEnterpriseProductId: !!process.env.AUTUMN_ENTERPRISE_PRODUCT_ID,
      hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
      nodeEnv: process.env.NODE_ENV,
      
      // Partial values for debugging (first and last 4 chars)
      starterProductId: process.env.AUTUMN_STARTER_PRODUCT_ID 
        ? `${process.env.AUTUMN_STARTER_PRODUCT_ID.slice(0, 4)}...${process.env.AUTUMN_STARTER_PRODUCT_ID.slice(-4)}`
        : 'NOT_SET',
      professionalProductId: process.env.AUTUMN_PROFESSIONAL_PRODUCT_ID
        ? `${process.env.AUTUMN_PROFESSIONAL_PRODUCT_ID.slice(0, 4)}...${process.env.AUTUMN_PROFESSIONAL_PRODUCT_ID.slice(-4)}`
        : 'NOT_SET',
      enterpriseProductId: process.env.AUTUMN_ENTERPRISE_PRODUCT_ID
        ? `${process.env.AUTUMN_ENTERPRISE_PRODUCT_ID.slice(0, 4)}...${process.env.AUTUMN_ENTERPRISE_PRODUCT_ID.slice(-4)}`
        : 'NOT_SET',
    };

    const issues = [];
    
    if (!config.hasAutumnApiKey) {
      issues.push('Missing AUTUMN_API_KEY');
    }
    if (!config.hasStarterProductId) {
      issues.push('Missing AUTUMN_STARTER_PRODUCT_ID');
    }
    if (!config.hasProfessionalProductId) {
      issues.push('Missing AUTUMN_PROFESSIONAL_PRODUCT_ID');
    }
    if (!config.hasAppUrl) {
      issues.push('Missing NEXT_PUBLIC_APP_URL');
    }

    return NextResponse.json({
      status: issues.length === 0 ? 'ready' : 'needs_configuration',
      config,
      issues,
      message: issues.length === 0 
        ? 'Autumn integration is properly configured'
        : 'Missing required environment variables',
    });

  } catch (error) {
    console.error('Autumn config check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
