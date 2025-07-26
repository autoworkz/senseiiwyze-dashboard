'use server'



import { NextResponse } from 'next/server';
import { sendMagicLinkEmail, sendVerificationEmail, sendOtpEmail } from '@/lib/email';

interface Body {
  email: string;
  kind?: 'magic-link' | 'verification' | 'otp';
}

export async function POST(request: Request) {
  try {
    const body: Body = await request.json();
    const { email, kind = 'magic-link' } = body;

    if (!email) {
      return new NextResponse(JSON.stringify({ error: 'Email is required' }), { status: 400 });
    }

    switch (kind) {
      case 'magic-link':
        await sendMagicLinkEmail({ email, url: 'https://example.com/login', appName: 'SenseiiWyze' });
        break;
      case 'verification':
        await sendVerificationEmail({ email, url: 'https://example.com/verify', appName: 'SenseiiWyze' });
        break;
      case 'otp':
        await sendOtpEmail({ email, otp: '123456', type: 'sign_in', appName: 'SenseiiWyze' });
        break;
      default:
        return new NextResponse(JSON.stringify({ error: 'Unknown kind' }), { status: 400 });
    }

    return NextResponse.json({ ok: true, kind });
  } catch (error: any) {
    console.error('send-test-email error', error);
    return new NextResponse(JSON.stringify({ error: error?.message || 'Server error' }), { status: 500 });
  }
} 