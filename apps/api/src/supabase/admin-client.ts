import { createClient } from "@supabase/supabase-js";
import type { Database } from "@nexlead/types";

import { getApiSupabaseAdminEnv } from "./env";

export function createAdminSupabaseClient() {
  const { url, serviceRoleKey } = getApiSupabaseAdminEnv();

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
