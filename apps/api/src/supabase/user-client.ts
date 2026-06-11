import { createClient } from "@supabase/supabase-js";
import type { Database } from "@nexlead/types";

import { getApiSupabaseAnonEnv } from "./env";

export function createUserSupabaseClient(accessToken: string) {
  const { url, anonKey } = getApiSupabaseAnonEnv();

  return createClient<Database>(url, anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
