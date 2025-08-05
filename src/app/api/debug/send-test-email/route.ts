'use server'



import { NextResponse } from 'next/server';
import { sendMagicLinkEmail, sendVerificationEmail, sendLoginCodeEmail } from '@/lib/email';

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
        await sendMagicLinkEmail({ email, magicLink: 'https://example.com/login' });
        break;
      case 'verification':
        await sendVerificationEmail({ email, verificationLink: 'https://example.com/verify' });
        break;
      case 'otp':
        await sendLoginCodeEmail({ email, code: '123456' });
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