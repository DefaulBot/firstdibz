import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function supabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return { url, anon };
}

// Server-side Supabase instance (works in Route Handlers + Server Components).
// In Server Components, setting cookies can throw — we swallow it (middleware handles refresh).
export function createSupabaseServerClient() {
  const env = supabaseEnv();
  if (!env)
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );

  const cookieStore = cookies();

  return createServerClient(env.url, env.anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: any[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }: any) => {
            cookieStore.set(name, value, options as any);
          });
        } catch {
          // Server Components may be read-only. Middleware handles cookie refresh.
        }
      },
    },
  });
}
