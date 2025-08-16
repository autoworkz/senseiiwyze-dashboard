'use server'
import { supabaseServer } from "@/lib/supabaseServer";
import { headers } from 'next/headers';
import { auth } from "@/lib/auth";

const BUCKET = 'assets';
const ALLOWED_MIME = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);

function mimeToExt(mime: string): '.png' | '.jpg' | '.webp' | '.gif' {
  switch (mime) {
    case 'image/png': return '.png';
    case 'image/jpeg': return '.jpg';
    case 'image/webp': return '.webp';
    case 'image/gif': return '.gif';
    default: return '.jpg';
  }
}

export async function getSignedAvatarUpload(file: File) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { error: 'Unauthorized' };

  if (!ALLOWED_MIME.has(file.type)) return { error: 'Unsupported file type' as const };

  const userId = String(session?.user.id);
  const safeUserId = userId.replace(/[^A-Za-z0-9_-]/g, '');
  const ext = mimeToExt(file.type);
  const path = `avatars${ext}`;

  const expiresIn = 60 * 5; // 5 minutes
  const { data, error } = await supabaseServer
    .storage.from(BUCKET)
    .createSignedUploadUrl('folders/avatar.png', { upsert: true });

  console.log("error", error);

  if (error || !data) return { error: error?.message || 'Failed to create signed URL' as const };

  const { data: pub } = supabaseServer.storage.from(BUCKET).getPublicUrl(path);

  return {
    bucket: BUCKET,
    path,
    token: data.token,
    expiresIn,
    publicUrl: pub?.publicUrl ?? null,
  };
}

export async function finalizeAvatar(path: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { error: 'Unauthorized' as const };

  if (!path || typeof path !== 'string') return { error: 'Missing path' as const };

  const userId = String(session.user.id);
  const safeUserId = userId.replace(/[^A-Za-z0-9_-]/g, '');
  const expectedPrefix = `avatars/${safeUserId}/`;
  if (!path.startsWith(expectedPrefix)) {
    return { error: 'Path does not belong to user' as const };
  }

  const { data: pub } = supabaseServer.storage.from(BUCKET).getPublicUrl(path);
  const publicUrl = pub?.publicUrl ?? null;

  const { error: buErr } = await supabaseServer
    .from('ba_users' as any)
    .update({ image: publicUrl, updated_at: new Date().toISOString() })
    .eq('id', userId);
  if (buErr) return { error: buErr.message || 'Failed to update user image' as const };

  const { data: userRow, error: fetchErr } = await supabaseServer
    .from('ba_users' as any)
    .select('profile_id, email')
    .eq('id', userId)
    .maybeSingle()
    .returns<{ profile_id: string | null; email: string | null }>();
  if (fetchErr || !userRow) return { error: 'User not found' as const };

  if (userRow.profile_id) {
    const { error } = await supabaseServer
      .from('profiles' as any)
      .update({ profile_photo: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', userRow.profile_id);
    if (error) return { error: error.message || 'Failed to update profile' as const };
  } else if (userRow.email) {
    const { error } = await supabaseServer
      .from('profiles' as any)
      .update({ profile_photo: publicUrl, updated_at: new Date().toISOString() })
      .eq('email', userRow.email);
    if (error) return { error: error.message || 'Failed to update profile' as const };
  }

  return { success: true as const, url: publicUrl };
}
