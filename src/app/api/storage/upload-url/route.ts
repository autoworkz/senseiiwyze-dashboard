export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { withAuth } from '@/lib/api/with-auth';

const BUCKET = 'account_image';
  
export const POST = withAuth(async (request: NextRequest, { session }) => {
  try {
    const body = await request.json();
    const { fileName } = body;

    if (!fileName) {
      return NextResponse.json({ error: 'Missing fileName' }, { status: 400 });
    }

    const userId = session.user.id;
    const objectPath = `${userId}/${fileName}`;

    const { data, error } = await supabaseServer
      .storage
      .from(BUCKET)
      .createSignedUploadUrl(objectPath, { upsert: true });

    if (error || !data) {
      console.error('Error creating signed URL:', error);
      return NextResponse.json(
        { error: error?.message || 'Failed to create signed URL' }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ path: data.path, token: data.token })
  } catch (error) {
    console.error('Error in upload-url route:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
})  
