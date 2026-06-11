import { createClient } from "@supabase/supabase-js";
import type { Database } from "@nexlead/types";

import { getApiSupabaseAnonEnv } from "./env";

export function createAnonSupabaseClient() {
  const { url, anonKey } = getApiSupabaseAnonEnv();

  return createClient<Database>(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
