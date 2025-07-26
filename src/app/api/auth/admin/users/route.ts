import { auth } from '@/lib/auth-config';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Built-in helper from admin plugin will internally check admin privileges
    // @ts-expect-error admin helper exposed by plugin
    const users = await auth.admin({ request }).listUsers();
    return NextResponse.json({ users });
  } catch (error: any) {
    const status = error?.status || 500;
    return new NextResponse(JSON.stringify({ error: error?.message || 'Server error' }), { status });
  }
} 