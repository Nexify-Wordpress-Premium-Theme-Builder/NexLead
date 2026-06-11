import type { AuthSessionUser } from "./types";
import { createUserSupabaseClient } from "../supabase/user-client";

export async function getAuthSessionUser(accessToken: string): Promise<AuthSessionUser | null> {
  const supabase = createUserSupabaseClient(accessToken);
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email ?? null,
  };
}
