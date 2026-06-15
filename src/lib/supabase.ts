import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string || 'https://eoyymhwufjocahrffssg.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string || 'sb_publishable_bq4Ii8gzmL32zsZXLuyuoQ_GQ3LfSrP'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  display_name: string
  pair_code: string
  couple_id: string | null
  created_at: string
}
