import { NextRequest } from 'next/server';
import { checkUserPermission } from '@/lib/auth';

/**
 * POST /api/auth/permissions/check
 * Check a single permission for the current user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { resource?: string; action?: string };
    const { resource, action } = body;

    if (!resource || !action) {
      return Response.json(
        { error: 'Resource and action are required' },
        { status: 400 }
      );
    }

    // Use the server-side permission checking function
    const hasPermission = await checkUserPermission(resource, action);

    return Response.json({
      hasPermission,
      resource,
      action,
    });
  } catch (error) {
    console.error('Permission check failed:', error);
    return Response.json(
      { error: 'Internal server error', hasPermission: false },
      { status: 500 }
    );
  }
} 