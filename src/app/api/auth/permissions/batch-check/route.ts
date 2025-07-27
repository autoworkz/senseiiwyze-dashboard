import { NextRequest } from 'next/server';
import { checkUserPermission } from '@/lib/auth';

/**
 * POST /api/auth/permissions/batch-check
 * Check multiple permissions for the current user in a single request
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { 
      permissions?: Record<string, string[]> 
    };
    const { permissions } = body;

    if (!permissions || typeof permissions !== 'object') {
      return Response.json(
        { error: 'Permissions object is required' },
        { status: 400 }
      );
    }

    // Check all permissions
    const results: Record<string, boolean> = {};
    
    for (const [resource, actions] of Object.entries(permissions)) {
      for (const action of actions) {
        const key = `${resource}.${action}`;
        try {
          const hasPermission = await checkUserPermission(resource, action);
          results[key] = hasPermission;
        } catch (error) {
          console.error(`Permission check failed for ${key}:`, error);
          results[key] = false;
        }
      }
    }

    return Response.json({
      permissions: results,
    });
  } catch (error) {
    console.error('Batch permission check failed:', error);
    return Response.json(
      { error: 'Internal server error', permissions: {} },
      { status: 500 }
    );
  }
} 