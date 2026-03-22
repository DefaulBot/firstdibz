import { createBrowserClient } from "@supabase/ssr";

function supabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return { url, anon };
}

// Client-side (browser) Supabase instance.
export function createSupabaseBrowserClient() {
  const env = supabaseEnv();
  if (!env)
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  return createBrowserClient(env.url, env.anon);
}
