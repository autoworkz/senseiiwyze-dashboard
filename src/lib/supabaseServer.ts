import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase_database'

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!

export const supabaseServer = createClient<Database>(
  SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
