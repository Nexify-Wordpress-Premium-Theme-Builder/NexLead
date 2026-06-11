import type { AuthSessionUser } from "@nexlead/types";

import { createServerSupabaseClient } from "@/lib/supabase";

export async function getServerAuthSessionUser(): Promise<AuthSessionUser | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? null,
  };
}

export async function getServerAccessToken(): Promise<string | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token ?? null;
}
