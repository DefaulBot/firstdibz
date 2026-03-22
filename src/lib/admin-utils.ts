import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Hook to check if the current user is an admin
 * Returns: { isAdmin: boolean, loading: boolean, error: Error | null }
 */
export async function checkAdminStatus(userId: string): Promise<boolean> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error checking admin status:", error);
    return false;
  }

  return data?.is_admin ?? false;
}
