import { supabase } from '@/lib/supabase'

export async function uploadAccountImage(file: File) {
  const res = await fetch('/api/storage/upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: file.name }),
  })
  const { path, token, error } = await res.json()
  if (error) throw new Error(error)

  const { error: upErr } = await supabase
    .storage
    .from('account_image')
    .uploadToSignedUrl(path, token, file)

  if (upErr) throw upErr
  
  // Get the public URL for the uploaded file
  const { data: pub } = supabase.storage
    .from('account_image')
    .getPublicUrl(path)
  
  return pub?.publicUrl ?? null
}
