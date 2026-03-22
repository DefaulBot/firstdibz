'use client'

import type { SupabaseClient } from '@supabase/supabase-js'
import { createSupabaseBrowserClient } from './client'

let _client: SupabaseClient | null = null

export function supabaseBrowser(): SupabaseClient {
  if (_client) return _client
  _client = createSupabaseBrowserClient()
  return _client
}
